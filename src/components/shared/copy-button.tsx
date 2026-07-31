"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { useToast } from "@/components/providers/toast-provider";
import { copyToClipboard } from "@/lib/utils";

interface CopyButtonProps extends Omit<ButtonProps, "onClick" | "value"> {
  value: string;
  label?: string;
  toastLabel?: string;
  iconOnly?: boolean;
}

export function CopyButton({
  value,
  label = "Copy",
  toastLabel = "Copied to clipboard",
  iconOnly,
  variant = "outline",
  size,
  ...rest
}: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false);
  const { toast } = useToast();

  async function handle() {
    const ok = await copyToClipboard(value);
    if (ok) {
      setCopied(true);
      toast({ title: toastLabel, variant: "success" });
      window.setTimeout(() => setCopied(false), 1500);
    } else {
      toast({ title: "Couldn't copy — try selecting the text", variant: "error" });
    }
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={size ?? (iconOnly ? "icon-sm" : "sm")}
      onClick={handle}
      aria-label={iconOnly ? label : undefined}
      {...rest}
    >
      {copied ? <Check /> : <Copy />}
      {!iconOnly ? <span>{copied ? "Copied" : label}</span> : null}
    </Button>
  );
}
