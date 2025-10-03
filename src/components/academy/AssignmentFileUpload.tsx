
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Upload, X, File, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface AssignmentFileUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  allowedFormats?: string[];
  maxFileSize?: number; // in MB
  maxFiles?: number;
  className?: string;
}

const AssignmentFileUpload: React.FC<AssignmentFileUploadProps> = ({
  value,
  onChange,
  allowedFormats = ['PDF', 'DOC', 'DOCX', 'TXT', 'JPG', 'PNG'],
  maxFileSize = 10,
  maxFiles = 5,
  className = ""
}) => {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxFileSize * 1024 * 1024) {
      return `File size must be less than ${maxFileSize}MB`;
    }

    // Check file type
    const fileExtension = file.name.split('.').pop()?.toUpperCase();
    if (fileExtension && !allowedFormats.includes(fileExtension)) {
      return `File type .${fileExtension} is not allowed. Allowed formats: ${allowedFormats.join(', ')}`;
    }

    // Check max files
    if (value.length >= maxFiles) {
      return `Maximum ${maxFiles} files allowed`;
    }

    return null;
  };

  const uploadFile = useCallback(async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('course-media')
        .upload(`assignments/${fileName}`, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Upload error:', error);
        toast.error('Failed to upload file');
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('course-media')
        .getPublicUrl(data.path);

      onChange([...value, publicUrl]);
      toast.success(`${file.name} uploaded successfully`);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload file');
    } finally {
      setUploading(false);
    }
  }, [value, onChange, maxFileSize, allowedFormats, maxFiles]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    files.forEach(uploadFile);
  }, [uploadFile]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(uploadFile);
    // Reset input
    e.target.value = '';
  }, [uploadFile]);

  const removeFile = useCallback((indexToRemove: number) => {
    onChange(value.filter((_, index) => index !== indexToRemove));
  }, [value, onChange]);

  const getFileName = (url: string) => {
    return url.split('/').pop()?.split('?')[0] || 'Unknown file';
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext || '')) {
      return '🖼️';
    } else if (['pdf'].includes(ext || '')) {
      return '📄';
    } else if (['doc', 'docx'].includes(ext || '')) {
      return '📝';
    }
    return '📎';
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Label className="text-sm font-medium">File Attachments</Label>
      
      {/* Upload Area */}
      <div
        className={`
          border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer
          ${dragActive ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/20' : 'border-gray-300 hover:border-gray-400'}
          ${uploading ? 'opacity-50 pointer-events-none' : ''}
          ${value.length >= maxFiles ? 'opacity-50 pointer-events-none' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => document.getElementById('assignment-file-upload')?.click()}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Upload className="h-8 w-8 text-indigo-500" />
            </motion.div>
            <p className="text-sm text-gray-600">Uploading...</p>
          </div>
        ) : value.length >= maxFiles ? (
          <div className="flex flex-col items-center gap-2">
            <AlertCircle className="h-8 w-8 text-orange-500" />
            <p className="text-sm text-gray-600">Maximum {maxFiles} files reached</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="h-8 w-8 text-gray-400" />
            <p className="text-sm text-gray-600">
              Drag and drop files here, or click to select
            </p>
            <p className="text-xs text-gray-500">
              Allowed: {allowedFormats.join(', ')} • Max {maxFileSize}MB each • Up to {maxFiles} files
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-2 mt-2"
            >
              <Upload className="h-4 w-4" />
              Browse Files
            </Button>
          </div>
        )}
        
        <input
          id="assignment-file-upload"
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          accept={allowedFormats.map(f => `.${f.toLowerCase()}`).join(',')}
        />
      </div>

      {/* Uploaded Files List */}
      <AnimatePresence>
        {value.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            <Label className="text-sm font-medium">Uploaded Files ({value.length})</Label>
            <div className="space-y-2">
              {value.map((url, index) => {
                const fileName = getFileName(url);
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border"
                  >
                    <span className="text-lg">{getFileIcon(fileName)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{fileName}</p>
                      <p className="text-xs text-gray-500">File {index + 1} of {maxFiles}</p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AssignmentFileUpload;
