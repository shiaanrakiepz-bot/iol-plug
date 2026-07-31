"use client";

import { Select } from "@/components/ui/select";
import { useHub } from "@/components/providers/hub-provider";

export function BrandSelect({
  value,
  onValueChange,
  placeholder = "Select a brand",
  className,
  triggerClassName,
}: {
  value: string;
  onValueChange: (v: string) => void;
  placeholder?: string;
  className?: string;
  triggerClassName?: string;
}) {
  const { brands } = useHub();
  const options = brands.map((b) => ({ label: b.name, value: b.id, hint: b.category }));
  return (
    <Select
      value={value}
      onValueChange={onValueChange}
      options={options}
      placeholder={placeholder}
      className={className}
      triggerClassName={triggerClassName}
      aria-label="Select brand"
    />
  );
}
