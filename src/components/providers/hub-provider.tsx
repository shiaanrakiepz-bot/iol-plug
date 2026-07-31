"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { BRANDS } from "@/data/brands";
import { useLocalStorage } from "@/lib/hooks/use-local-storage";
import { STORAGE_KEYS, logoKey } from "@/lib/storage";
import type {
  AssetStatus,
  ApprovalStatus,
  Brand,
  ColorSwatch,
  LogoType,
  PromptTemplate,
  SavedOutput,
  Typography,
} from "@/types";

interface AssetStats {
  totalBrands: number;
  approvedAssets: number;
  uploadedAssets: number;
  totalSlots: number;
  palettesNeedingConfirmation: number;
  fullyApprovedBrands: number;
}

interface HubContextValue {
  hydrated: boolean;
  brands: Brand[];
  getBrand: (id: string) => Brand | undefined;

  // favourites & recents
  favorites: string[];
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
  recent: string[];
  addRecent: (id: string) => void;

  // brand editing
  updateBrand: (id: string, partial: Partial<Brand>) => void;
  addBrand: (brand: Brand) => void;
  setApproval: (id: string, status: ApprovalStatus) => void;

  // palette
  addColor: (brandId: string, swatch: ColorSwatch) => void;
  updateColor: (brandId: string, swatchId: string, partial: Partial<ColorSwatch>) => void;
  removeColor: (brandId: string, swatchId: string) => void;

  // typography
  updateTypography: (brandId: string, partial: Partial<Typography>) => void;

  // logos
  logos: Record<string, string>;
  getLogo: (brandId: string, type: LogoType) => string | undefined;
  setLogo: (brandId: string, type: LogoType, dataUrl: string) => void;
  removeLogo: (brandId: string, type: LogoType) => void;
  getLogoStatus: (brandId: string, type: LogoType) => AssetStatus;
  setLogoStatus: (brandId: string, type: LogoType, status: AssetStatus) => void;

  // saved prompts & outputs
  savedPrompts: PromptTemplate[];
  savePrompt: (prompt: PromptTemplate) => void;
  removePrompt: (id: string) => void;
  savedOutputs: SavedOutput[];
  saveOutput: (output: SavedOutput) => void;
  removeOutput: (id: string) => void;

  // admin
  adminMode: boolean;
  setAdminMode: (v: boolean) => void;

  // data management
  exportData: () => string;
  importData: (json: string) => { ok: boolean; message: string };
  resetData: () => void;

  stats: AssetStats;
}

const HubContext = createContext<HubContextValue | null>(null);

export function HubProvider({ children }: { children: React.ReactNode }) {
  const [brands, setBrands] = useLocalStorage<Brand[]>(STORAGE_KEYS.brands, BRANDS);
  const [logos, setLogos] = useLocalStorage<Record<string, string>>(STORAGE_KEYS.logos, {});
  const [logoStatusMap, setLogoStatusMap] = useLocalStorage<Record<string, AssetStatus>>(
    STORAGE_KEYS.logoStatus,
    {},
  );
  const [favorites, setFavorites] = useLocalStorage<string[]>(STORAGE_KEYS.favorites, []);
  const [recent, setRecent] = useLocalStorage<string[]>(STORAGE_KEYS.recent, []);
  const [savedPrompts, setSavedPrompts] = useLocalStorage<PromptTemplate[]>(
    STORAGE_KEYS.savedPrompts,
    [],
  );
  const [savedOutputs, setSavedOutputs] = useLocalStorage<SavedOutput[]>(
    STORAGE_KEYS.savedOutputs,
    [],
  );
  const [adminMode, setAdminModeState] = useLocalStorage<boolean>(STORAGE_KEYS.adminMode, false);

  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  // ---- favourites & recents ------------------------------------------------
  const isFavorite = useCallback((id: string) => favorites.includes(id), [favorites]);
  const toggleFavorite = useCallback(
    (id: string) =>
      setFavorites((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])),
    [setFavorites],
  );
  const addRecent = useCallback(
    (id: string) => setRecent((prev) => [id, ...prev.filter((x) => x !== id)].slice(0, 8)),
    [setRecent],
  );

  // ---- brand editing -------------------------------------------------------
  const getBrand = useCallback((id: string) => brands.find((b) => b.id === id), [brands]);

  const patchBrand = useCallback(
    (id: string, mutate: (b: Brand) => Brand) =>
      setBrands((prev) => prev.map((b) => (b.id === id ? mutate(b) : b))),
    [setBrands],
  );

  const updateBrand = useCallback(
    (id: string, partial: Partial<Brand>) => patchBrand(id, (b) => ({ ...b, ...partial })),
    [patchBrand],
  );

  const addBrand = useCallback((brand: Brand) => setBrands((prev) => [...prev, brand]), [setBrands]);

  const setApproval = useCallback(
    (id: string, status: ApprovalStatus) => patchBrand(id, (b) => ({ ...b, approvalStatus: status })),
    [patchBrand],
  );

  // ---- palette -------------------------------------------------------------
  const addColor = useCallback(
    (brandId: string, swatch: ColorSwatch) =>
      patchBrand(brandId, (b) => ({ ...b, palette: [...b.palette, swatch] })),
    [patchBrand],
  );
  const updateColor = useCallback(
    (brandId: string, swatchId: string, partial: Partial<ColorSwatch>) =>
      patchBrand(brandId, (b) => ({
        ...b,
        palette: b.palette.map((c) => (c.id === swatchId ? { ...c, ...partial } : c)),
      })),
    [patchBrand],
  );
  const removeColor = useCallback(
    (brandId: string, swatchId: string) =>
      patchBrand(brandId, (b) => ({ ...b, palette: b.palette.filter((c) => c.id !== swatchId) })),
    [patchBrand],
  );

  // ---- typography ----------------------------------------------------------
  const updateTypography = useCallback(
    (brandId: string, partial: Partial<Typography>) =>
      patchBrand(brandId, (b) => ({ ...b, typography: { ...b.typography, ...partial } })),
    [patchBrand],
  );

  // ---- logos ---------------------------------------------------------------
  const getLogo = useCallback(
    (brandId: string, type: LogoType) => logos[logoKey(brandId, type)],
    [logos],
  );
  const setLogo = useCallback(
    (brandId: string, type: LogoType, dataUrl: string) => {
      const key = logoKey(brandId, type);
      setLogos((prev) => ({ ...prev, [key]: dataUrl }));
      setLogoStatusMap((prev) => ({ ...prev, [key]: prev[key] === "approved" ? "approved" : "needs-review" }));
    },
    [setLogos, setLogoStatusMap],
  );
  const removeLogo = useCallback(
    (brandId: string, type: LogoType) => {
      const key = logoKey(brandId, type);
      setLogos((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
      setLogoStatusMap((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    },
    [setLogos, setLogoStatusMap],
  );
  const getLogoStatus = useCallback(
    (brandId: string, type: LogoType): AssetStatus => {
      const key = logoKey(brandId, type);
      if (logoStatusMap[key]) return logoStatusMap[key];
      const brand = brands.find((b) => b.id === brandId);
      const seed = brand?.logoAssets.find((a) => a.type === type);
      return seed?.status ?? "missing";
    },
    [logoStatusMap, brands],
  );
  const setLogoStatus = useCallback(
    (brandId: string, type: LogoType, status: AssetStatus) =>
      setLogoStatusMap((prev) => ({ ...prev, [logoKey(brandId, type)]: status })),
    [setLogoStatusMap],
  );

  // ---- saved prompts & outputs --------------------------------------------
  const savePrompt = useCallback(
    (prompt: PromptTemplate) =>
      setSavedPrompts((prev) => (prev.some((p) => p.id === prompt.id) ? prev : [prompt, ...prev])),
    [setSavedPrompts],
  );
  const removePrompt = useCallback(
    (id: string) => setSavedPrompts((prev) => prev.filter((p) => p.id !== id)),
    [setSavedPrompts],
  );
  const saveOutput = useCallback(
    (output: SavedOutput) => setSavedOutputs((prev) => [output, ...prev].slice(0, 60)),
    [setSavedOutputs],
  );
  const removeOutput = useCallback(
    (id: string) => setSavedOutputs((prev) => prev.filter((o) => o.id !== id)),
    [setSavedOutputs],
  );

  const setAdminMode = useCallback((v: boolean) => setAdminModeState(v), [setAdminModeState]);

  // ---- data management -----------------------------------------------------
  const exportData = useCallback(() => {
    return JSON.stringify(
      {
        product: "Independent Media Design Hub",
        version: 1,
        exportedAt: new Date().toISOString(),
        brands,
        favorites,
        savedPrompts,
        savedOutputs,
        logos,
        logoStatus: logoStatusMap,
      },
      null,
      2,
    );
  }, [brands, favorites, savedPrompts, savedOutputs, logos, logoStatusMap]);

  const importData = useCallback(
    (json: string): { ok: boolean; message: string } => {
      try {
        const data = JSON.parse(json);
        if (!data || !Array.isArray(data.brands)) {
          return { ok: false, message: "File doesn't contain a valid brands array." };
        }
        setBrands(data.brands as Brand[]);
        if (Array.isArray(data.favorites)) setFavorites(data.favorites);
        if (Array.isArray(data.savedPrompts)) setSavedPrompts(data.savedPrompts);
        if (Array.isArray(data.savedOutputs)) setSavedOutputs(data.savedOutputs);
        if (data.logos && typeof data.logos === "object") setLogos(data.logos);
        if (data.logoStatus && typeof data.logoStatus === "object") setLogoStatusMap(data.logoStatus);
        return { ok: true, message: `Imported ${data.brands.length} brands successfully.` };
      } catch {
        return { ok: false, message: "Couldn't parse that file. Make sure it's valid JSON." };
      }
    },
    [setBrands, setFavorites, setSavedPrompts, setSavedOutputs, setLogos, setLogoStatusMap],
  );

  const resetData = useCallback(() => {
    setBrands(BRANDS);
    setLogos({});
    setLogoStatusMap({});
    setFavorites([]);
    setRecent([]);
    setSavedPrompts([]);
    setSavedOutputs([]);
  }, [
    setBrands,
    setLogos,
    setLogoStatusMap,
    setFavorites,
    setRecent,
    setSavedPrompts,
    setSavedOutputs,
  ]);

  // ---- stats ---------------------------------------------------------------
  const stats = useMemo<AssetStats>(() => {
    let approvedAssets = 0;
    let uploadedAssets = 0;
    let totalSlots = 0;
    let palettesNeedingConfirmation = 0;
    let fullyApprovedBrands = 0;

    for (const b of brands) {
      let brandApproved = b.logoAssets.length > 0;
      for (const a of b.logoAssets) {
        totalSlots += 1;
        const key = logoKey(b.id, a.type);
        const status = logoStatusMap[key] ?? a.status;
        if (logos[key]) uploadedAssets += 1;
        if (status === "approved") approvedAssets += 1;
        else brandApproved = false;
      }
      if (b.palette.some((c) => c.status === "needs-confirmation")) palettesNeedingConfirmation += 1;
      if (brandApproved) fullyApprovedBrands += 1;
    }

    return {
      totalBrands: brands.length,
      approvedAssets,
      uploadedAssets,
      totalSlots,
      palettesNeedingConfirmation,
      fullyApprovedBrands,
    };
  }, [brands, logos, logoStatusMap]);

  const value = useMemo<HubContextValue>(
    () => ({
      hydrated,
      brands,
      getBrand,
      favorites,
      isFavorite,
      toggleFavorite,
      recent,
      addRecent,
      updateBrand,
      addBrand,
      setApproval,
      addColor,
      updateColor,
      removeColor,
      updateTypography,
      logos,
      getLogo,
      setLogo,
      removeLogo,
      getLogoStatus,
      setLogoStatus,
      savedPrompts,
      savePrompt,
      removePrompt,
      savedOutputs,
      saveOutput,
      removeOutput,
      adminMode,
      setAdminMode,
      exportData,
      importData,
      resetData,
      stats,
    }),
    [
      hydrated,
      brands,
      getBrand,
      favorites,
      isFavorite,
      toggleFavorite,
      recent,
      addRecent,
      updateBrand,
      addBrand,
      setApproval,
      addColor,
      updateColor,
      removeColor,
      updateTypography,
      logos,
      getLogo,
      setLogo,
      removeLogo,
      getLogoStatus,
      setLogoStatus,
      savedPrompts,
      savePrompt,
      removePrompt,
      savedOutputs,
      saveOutput,
      removeOutput,
      adminMode,
      setAdminMode,
      exportData,
      importData,
      resetData,
      stats,
    ],
  );

  return <HubContext.Provider value={value}>{children}</HubContext.Provider>;
}

export function useHub() {
  const ctx = useContext(HubContext);
  if (!ctx) throw new Error("useHub must be used within HubProvider");
  return ctx;
}
