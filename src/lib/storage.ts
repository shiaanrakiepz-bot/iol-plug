export const STORAGE_KEYS = {
  brands: "imdh:brands:v1",
  logos: "imdh:logos:v1",
  logoStatus: "imdh:logo-status:v1",
  favorites: "imdh:favorites:v1",
  recent: "imdh:recent:v1",
  savedPrompts: "imdh:saved-prompts:v1",
  savedOutputs: "imdh:saved-outputs:v1",
  adminMode: "imdh:admin-mode:v1",
} as const;

export const THEME_KEY = "imdh-theme";

export function logoKey(brandId: string, type: string): string {
  return `${brandId}:${type}`;
}
