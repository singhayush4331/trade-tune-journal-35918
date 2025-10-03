
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Target, TrendingUp, ArrowRight, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Progress } from '@/components/ui/progress';

interface StrategyChecklistDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  playbook: any;
}

const StrategyChecklistDialog = ({
  open,
  onOpenChange,
  playbook
}: StrategyChecklistDialogProps) => {
  const [entryCriteria, setEntryCriteria] = useState<{ [key: string]: boolean }>({});
  const [exitCriteria, setExitCriteria] = useState<{ [key: string]: boolean }>({});
  const [activeSection, setActiveSection] = useState<'entry' | 'exit'>('entry');
  const [progress, setProgress] = useState(0);

  const parseRules = (rulesString: string) => {
    if (!rulesString) return [];
    return rulesString.split('\n').filter(rule => rule.trim());
  };

  const entryRules = parseRules(playbook?.entry_rules || '');
  const exitRules = parseRules(playbook?.exit_rules || '');

  const calculateCompletion = (criteria: { [key: string]: boolean }, rules: string[]) => {
    if (rules.length === 0) return 0;
    const checkedCount = Object.values(criteria).filter(Boolean).length;
    return (checkedCount / rules.length) * 100;
  };

  useEffect(() => {
    const currentCriteria = activeSection === 'entry' ? entryCriteria : exitCriteria;
    const currentRules = activeSection === 'entry' ? entryRules : exitRules;
    const newProgress = calculateCompletion(currentCriteria, currentRules);
    
    // Animate progress
    const timeout = setTimeout(() => {
      setProgress(newProgress);
    }, 100);

    return () => clearTimeout(timeout);
  }, [entryCriteria, exitCriteria, activeSection]);

  const handleCheckChange = (index: number, type: 'entry' | 'exit', checked: boolean) => {
    if (type === 'entry') {
      setEntryCriteria(prev => ({ ...prev, [index]: checked }));
    } else {
      setExitCriteria(prev => ({ ...prev, [index]: checked }));
    }
  };

  const isAllChecked = (type: 'entry' | 'exit') => {
    const criteria = type === 'entry' ? entryCriteria : exitCriteria;
    const rules = type === 'entry' ? entryRules : exitRules;
    return rules.length > 0 && Object.values(criteria).filter(Boolean).length === rules.length;
  };

  const handleReset = () => {
    setEntryCriteria({});
    setExitCriteria({});
    setProgress(0);
  };

  const ChecklistItem = ({ rule, index, type }: { rule: string; index: number; type: 'entry' | 'exit' }) => {
    const isChecked = type === 'entry' ? entryCriteria[index] : exitCriteria[index];
    
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "relative overflow-hidden rounded-xl border p-4 mb-3",
          "bg-gradient-to-br transition-all duration-300",
          isChecked 
            ? "from-primary/10 to-primary/5 border-primary/20 shadow-lg shadow-primary/5" 
            : "from-card to-card/95 hover:from-card/95 hover:to-card/90 border-border"
        )}
      >
        <div className="flex items-center gap-4">
          <motion.div 
            initial={false}
            animate={{ 
              scale: isChecked ? 1.1 : 1,
              rotate: isChecked ? 360 : 0 
            }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
            className="relative"
          >
            <Checkbox
              id={`${type}-${index}`}
              checked={isChecked}
              onCheckedChange={(checked) => handleCheckChange(index, type, checked === true)}
              className={cn(
                "h-5 w-5 rounded-md border-2 transition-colors duration-200",
                isChecked ? "border-primary" : "border-muted-foreground/30"
              )}
            />
            {isChecked && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-primary"
              />
            )}
          </motion.div>
          
          <motion.label
            initial={false}
            animate={{
              color: isChecked ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
              fontWeight: isChecked ? 500 : 400
            }}
            transition={{ duration: 0.2 }}
            htmlFor={`${type}-${index}`}
            className="flex-1 cursor-pointer text-base"
          >
            {rule}
          </motion.label>

          <AnimatePresence>
            {isChecked && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <CheckCircle2 className="h-5 w-5 text-primary animate-pulse-subtle" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ 
            scaleX: isChecked ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          className="absolute bottom-0 left-0 h-0.5 w-full origin-left bg-gradient-to-r from-primary/50 to-primary"
        />
      </motion.div>
    );
  };

  const sectionVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 20 : -20,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 20 : -20,
      opacity: 0
    })
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden rounded-xl border-primary/20">
        <div className="flex h-[600px]">
          <div className="w-48 bg-gradient-to-br from-muted/50 to-muted/30 p-4 flex flex-col border-r border-primary/10">
            <div className="space-y-2">
              {['entry', 'exit'].map((section) => (
                <motion.button
                  key={section}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveSection(section as 'entry' | 'exit')}
                  className={cn(
                    "w-full p-3 rounded-lg flex items-center gap-2 transition-all duration-200",
                    activeSection === section
                      ? "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
                      : "hover:bg-muted text-muted-foreground"
                  )}
                >
                  {section === 'entry' ? (
                    <Target className="h-4 w-4" />
                  ) : (
                    <TrendingUp className="h-4 w-4" />
                  )}
                  <span className="capitalize">
                    {section} Rules
                  </span>
                </motion.button>
              ))}
            </div>

            <div className="mt-auto">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="w-full hover:bg-primary/10"
              >
                Reset All
              </Button>
            </div>
          </div>

          <div className="flex-1 p-6 bg-gradient-to-br from-background to-background/95">
            <div className="mb-6">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3"
              >
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                  {activeSection === 'entry' ? (
                    <Target className="h-5 w-5 text-primary" />
                  ) : (
                    <TrendingUp className="h-5 w-5 text-primary" />
                  )}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold capitalize">
                    {activeSection} Criteria
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Verify your {activeSection} conditions before proceeding
                  </p>
                </div>
                <motion.div 
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.span 
                    className="text-sm font-medium text-primary"
                    key={progress}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {Math.round(progress)}%
                  </motion.span>
                </motion.div>
              </motion.div>

              <div className="mt-4">
                <Progress 
                  value={progress} 
                  className="h-2 bg-primary/10"
                  indicatorClassName={cn(
                    "bg-gradient-to-r from-primary/60 to-primary transition-all duration-500",
                    progress === 100 && "animate-pulse-subtle"
                  )}
                />
              </div>
            </div>

            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              <AnimatePresence mode="wait" custom={activeSection === 'entry' ? 1 : -1}>
                <motion.div
                  key={activeSection}
                  custom={activeSection === 'entry' ? 1 : -1}
                  variants={sectionVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 }
                  }}
                >
                  {(activeSection === 'entry' ? entryRules : exitRules).map((rule, index) => (
                    <ChecklistItem
                      key={`${activeSection}-${index}`}
                      rule={rule}
                      index={index}
                      type={activeSection}
                    />
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            {isAllChecked(activeSection) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 rounded-lg bg-gradient-to-br from-success/20 to-success/10 border border-success/20"
              >
                <div className="flex items-center gap-3 text-success">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="font-medium">
                    All {activeSection} criteria verified! Ready to proceed.
                  </span>
                </div>
              </motion.div>
            )}

            <motion.div 
              className="mt-6 flex justify-end"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Button
                size="lg"
                onClick={() => onOpenChange(false)}
                className="gap-2 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
              >
                Done
                <ArrowRight className="h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StrategyChecklistDialog;
