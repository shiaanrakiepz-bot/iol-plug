"use client";

import { useHub } from "@/components/providers/hub-provider";
import { cn, initials } from "@/lib/utils";
import type { Brand } from "@/types";

interface BrandAvatarProps {
  brand: Brand;
  size?: number;
  className?: string;
  rounded?: string;
}

export function BrandAvatar({ brand, size = 44, className, rounded = "rounded-xl" }: BrandAvatarProps) {
  const { getLogo } = useHub();
  const logo = getLogo(brand.id, "primary") ?? getLogo(brand.id, "icon");

  return (
    <div
      className={cn("flex shrink-0 items-center justify-center overflow-hidden font-semibold", rounded, className)}
      style={{
        width: size,
        height: size,
        backgroundColor: logo ? "hsl(var(--muted))" : `hsl(${brand.uiHue} 62% 50% / 0.16)`,
        color: `hsl(${brand.uiHue} 55% 48%)`,
      }}
      aria-hidden
    >
      {logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logo} alt="" className="h-full w-full object-contain p-1.5" />
      ) : (
        <span style={{ fontSize: Math.round(size * 0.36) }}>{initials(brand.name)}</span>
      )}
    </div>
  );
}
