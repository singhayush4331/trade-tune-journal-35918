
import React from 'react';
import { Bug } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ResetPasswordDebugDialogProps {
  isOpen: boolean;
  onClose: () => void;
  urlDebugInfo: any;
  token: string | null;
  status: string;
  debug: any;
}

const ResetPasswordDebugDialog: React.FC<ResetPasswordDebugDialogProps> = ({
  isOpen,
  onClose,
  urlDebugInfo,
  token,
  status,
  debug
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bug className="h-5 w-5" />
            Custom Token Reset Debug Information
          </DialogTitle>
          <DialogDescription>
            Technical details for the new custom token password reset system
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-1">URL Information</h3>
            <div className="bg-muted p-3 rounded-md overflow-auto text-xs">
              <pre className="whitespace-pre-wrap">{JSON.stringify(urlDebugInfo, null, 2)}</pre>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-1">Token Status</h3>
            <div className="bg-muted p-3 rounded-md overflow-auto text-xs">
              <pre className="whitespace-pre-wrap">
                {JSON.stringify({
                  hasToken: !!token,
                  tokenType: "Custom UUID Token (No Auto-Login)",
                  tokenPreview: token ? `${token.substring(0, 10)}...` : null,
                  status,
                  systemType: "Custom Token System - No Supabase Auth Auto-Login"
                }, null, 2)}
              </pre>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-1">Full Debug Object</h3>
            <div className="bg-muted p-3 rounded-md overflow-auto text-xs">
              <pre className="whitespace-pre-wrap">{JSON.stringify(debug, null, 2)}</pre>
            </div>
          </div>
        </div>
        
        <div className="mt-2 flex justify-end">
          <Button onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResetPasswordDebugDialog;
