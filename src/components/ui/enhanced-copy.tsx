
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Check, Download } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface CopyButtonProps {
  text: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showToast?: boolean;
  successMessage?: string;
  className?: string;
  onCopy?: () => void;
}

export function CopyButton({ 
  text, 
  variant = 'outline', 
  size = 'sm',
  showToast = true,
  successMessage = 'Copied to clipboard!',
  className,
  onCopy 
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCopy = async () => {
    setIsLoading(true);
    
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      
      if (showToast) {
        toast({
          title: "Success!",
          description: successMessage,
        });
      }
      
      onCopy?.();
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again or copy manually",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={variant}
          size={size}
          onClick={handleCopy}
          disabled={isLoading}
          className={className}
        >
          {copied ? (
            <Check className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{copied ? 'Copied!' : 'Copy to clipboard'}</p>
      </TooltipContent>
    </Tooltip>
  );
}

interface EnhancedCopyButtonProps {
  code: string;
  language?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showLanguage?: boolean;
  className?: string;
  onCopy?: () => void;
}

export function EnhancedCopyButton({
  code,
  language = 'tsx',
  variant = 'outline',
  size = 'sm',
  showLanguage = true,
  className,
  onCopy
}: EnhancedCopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCopy = async () => {
    setIsLoading(true);
    
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      
      toast({
        title: "Code copied!",
        description: `${language.toUpperCase()} code copied to clipboard`,
      });
      
      onCopy?.();
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {showLanguage && (
        <Badge variant="secondary" className="text-xs">
          {language.toUpperCase()}
        </Badge>
      )}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={variant}
            size={size}
            onClick={handleCopy}
            disabled={isLoading}
            className="relative"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            {copied && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-ping" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{copied ? 'Copied!' : `Copy ${language.toUpperCase()} code`}</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
