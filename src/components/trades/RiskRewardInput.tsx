
import React, { useState } from 'react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import { ChevronDown } from "lucide-react";
import { parseRiskRewardRatio } from "@/utils/risk-reward-utils";
import { cn } from "@/lib/utils";

const RiskRewardInput = () => {
  const form = useFormContext();
  const [isValidFormat, setIsValidFormat] = useState(true);

  const validateFormat = (value: string): boolean => {
    if (!value) return true;
    // Fix: Convert regex match result to boolean
    return !!value.match(/^\d*[:/]?\d*$/);
  };

  const getRatioQuality = (ratio: number): { color: string; message: string } => {
    if (ratio <= 0) return { color: '', message: '' };
    if (ratio >= 2) return { color: 'text-success', message: 'Excellent R:R ratio' };
    if (ratio >= 1) return { color: 'text-warning', message: 'Acceptable R:R ratio' };
    return { color: 'text-destructive', message: 'Poor R:R ratio' };
  };

  const currentValue = form.watch('riskToReward');
  const ratio = parseRiskRewardRatio(currentValue);
  const { color, message } = getRatioQuality(ratio);

  return (
    <FormField
      control={form.control}
      name="riskToReward"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Risk to Reward Ratio</FormLabel>
          <FormControl>
            <div className="space-y-2">
              <div className="relative">
                <Input
                  placeholder="e.g., 1:2 or 1/2"
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value;
                    const isValid = validateFormat(value);
                    setIsValidFormat(isValid);
                    if (isValid) {
                      field.onChange(value);
                    }
                  }}
                  className={cn(
                    "bg-background/50 pl-3 pr-8 transition-colors",
                    !isValidFormat && "border-destructive",
                    ratio > 0 && "border-primary"
                  )}
                />
                <div className="absolute right-2 top-2.5 pointer-events-none">
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </div>
              </div>
              {ratio > 0 && (
                <p className={cn("text-xs", color)}>
                  {message} ({ratio.toFixed(2)})
                </p>
              )}
              {!isValidFormat && (
                <p className="text-xs text-destructive">
                  Please use format: number:number or number/number
                </p>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default React.memo(RiskRewardInput);
