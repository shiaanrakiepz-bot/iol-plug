"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Palette,
  Bell,
  Globe,
  Accessibility,
  ShieldCheck,
  UserCog,
  Moon,
  Sun,
  Wifi,
  Film,
  LogOut,
  Trash2,
  Check,
} from "lucide-react";
import { useSettings, useContent, ACCENTS, LANGUAGES, TEXT_SIZES } from "@/lib/store";
import { useUI, type ProfilePage } from "@/lib/ui-store";
import { SubPageHeader, MenuRow, ToggleRow, SectionLabel } from "./shared";
import { cn, vibrate } from "@/lib/utils";
import { HINTS_KEY } from "@/lib/storage";
import { Segmented } from "@/components/ui/segmented";

export function SettingsPages({ page }: { page: ProfilePage }) {
  switch (page) {
    case "notifications":
      return <NotificationsPage />;
    case "appearance":
      return <AppearancePage />;
    case "accessibility":
      return <AccessibilityPage />;
    case "privacy":
      return <PrivacyPage />;
    case "account":
      return <AccountPage />;
    default:
      return <SettingsMain />;
  }
}

/* ------------------------------------------------------------------ */
function SettingsMain() {
  const setProfilePage = useUI((s) => s.setProfilePage);
  const showToast = useUI((s) => s.showToast);
  const settings = useSettings();

  return (
    <div>
      <SubPageHeader title="Settings" onBack={() => setProfilePage("main")} />

      <SectionLabel>Personalise</SectionLabel>
      <div className="ios-group rounded-3xl bg-surface-raised p-1.5 shadow-card">
        <MenuRow icon={<Palette size={18} />} iconBg="#A855F7" label="Appearance" detail={settings.theme === "dark" ? "Dark" : "Light"} onPress={() => setProfilePage("appearance")} />
        <MenuRow icon={<Bell size={18} />} iconBg="#F59E0B" label="Notifications" onPress={() => setProfilePage("notifications")} />
        <MenuRow
          icon={<Globe size={18} />}
          iconBg="#0EA5E9"
          label="Language"
          detail={settings.language}
          onPress={() => {
            const idx = LANGUAGES.indexOf(settings.language);
            const next = LANGUAGES[(idx + 1) % LANGUAGES.length];
            settings.set("language", next);
            showToast(`Language: ${next}`, "globe");
          }}
        />
        <MenuRow icon={<Accessibility size={18} />} iconBg="#22C55E" label="Accessibility" onPress={() => setProfilePage("accessibility")} />
      </div>

      <SectionLabel>Data & playback</SectionLabel>
      <div className="ios-group rounded-3xl bg-surface-raised p-1.5 shadow-card">
        <ToggleRow
          label="Data saver"
          detail="Lower-res images, no autoplay"
          value={settings.dataSaver}
          onChange={(v) => {
            settings.set("dataSaver", v);
            showToast(v ? "Data saver on" : "Data saver off", "wave");
          }}
        />
        <ToggleRow
          label="Autoplay videos"
          detail="Play video stories automatically in the feed"
          value={settings.autoplayVideos}
          onChange={(v) => settings.set("autoplayVideos", v)}
        />
        <ToggleRow
          label="Captions"
          detail="Show captions on videos"
          value={settings.captions}
          onChange={(v) => settings.set("captions", v)}
        />
        <button
          onClick={() => {
            const order = ["auto", "high", "low"] as const;
            const next = order[(order.indexOf(settings.videoQuality) + 1) % 3];
            settings.set("videoQuality", next);
            showToast(`Video quality: ${next}`, "entertainment");
          }}
          className="flex w-full items-center gap-3.5 rounded-2xl px-3 py-3 text-left active:bg-ink/8"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink/6 text-ink">
            <Film size={18} />
          </span>
          <span className="flex-1 text-[14.5px] font-semibold text-ink">Video quality</span>
          <span className="rounded-pill bg-[var(--accent)]/12 px-3 py-1 text-[11.5px] font-bold uppercase text-[var(--accent)]">
            {settings.videoQuality}
          </span>
        </button>
      </div>

      <SectionLabel>Account</SectionLabel>
      <div className="ios-group rounded-3xl bg-surface-raised p-1.5 shadow-card">
        <MenuRow icon={<ShieldCheck size={18} />} iconBg="#22C55E" label="Privacy" onPress={() => showToast("Your data stays on this device in the demo", "lock")} />
        <MenuRow icon={<UserCog size={18} />} iconBg="#64748B" label="Manage account" onPress={() => setProfilePage("account")} />
      </div>

      <p className="mt-8 text-center text-[11px] font-semibold text-ink-faint">
        IOL Plug · v1.0.0 · Made with heart in South Africa
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
function AppearancePage() {
  const setProfilePage = useUI((s) => s.setProfilePage);
  const settings = useSettings();

  return (
    <div>
      <SubPageHeader title="Appearance" onBack={() => setProfilePage("settings")} />

      <SectionLabel>Theme</SectionLabel>
      <div className="grid grid-cols-2 gap-3">
        {(
          [
            { id: "dark", label: "OLED Dark", icon: <Moon size={18} />, bg: "#000", fg: "#fff" },
            { id: "light", label: "Light", icon: <Sun size={18} />, bg: "#f6f5f7", fg: "#0b0b0d" },
          ] as const
        ).map((t) => (
          <motion.button
            key={t.id}
            whileTap={{ scale: 0.96 }}
            onClick={() => {
              settings.set("theme", t.id);
              vibrate(5);
            }}
            aria-pressed={settings.theme === t.id}
            className={cn(
              "flex flex-col items-center gap-2 rounded-3xl border-2 p-5 transition-colors",
              settings.theme === t.id ? "border-[var(--accent)]" : "border-transparent"
            )}
            style={{ background: t.bg, color: t.fg }}
          >
            {t.icon}
            <span className="text-[13px] font-bold">{t.label}</span>
            {settings.theme === t.id && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--accent)] text-white">
                <Check size={12} strokeWidth={3.5} />
              </span>
            )}
          </motion.button>
        ))}
      </div>

      <SectionLabel>Accent colour</SectionLabel>
      <div className="flex flex-wrap gap-3 rounded-3xl bg-surface-raised p-4 shadow-card">
        {ACCENTS.map((a) => (
          <motion.button
            key={a.id}
            whileTap={{ scale: 0.85 }}
            onClick={() => {
              settings.set("accent", a.id);
              vibrate(5);
            }}
            aria-label={`Accent ${a.label}`}
            aria-pressed={settings.accent === a.id}
            className="flex flex-col items-center gap-1.5"
          >
            <span
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-full transition-transform",
                settings.accent === a.id && "ring-4 ring-offset-2 ring-offset-surface"
              )}
              style={{
                background: a.hex,
                boxShadow: `0 4px 16px ${a.hex}66`,
                ...(settings.accent === a.id
                  ? ({ "--tw-ring-color": `${a.hex}55` } as React.CSSProperties)
                  : {}),
              }}
            >
              {settings.accent === a.id && <Check size={18} strokeWidth={3.5} className="text-white" />}
            </span>
            <span className="text-[10.5px] font-bold text-ink-dim">{a.label}</span>
          </motion.button>
        ))}
      </div>
      <p className="mt-3 px-2 text-[12px] font-medium text-ink-faint">
        Your accent colour re-tints buttons, highlights and gestures across the whole app.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
function NotificationsPage() {
  const setProfilePage = useUI((s) => s.setProfilePage);
  const notifications = useSettings((s) => s.notifications);
  const setNotification = useSettings((s) => s.setNotification);

  return (
    <div>
      <SubPageHeader title="Notifications" onBack={() => setProfilePage("settings")} />
      <div className="mt-3 ios-group rounded-3xl bg-surface-raised p-1.5 shadow-card">
        <ToggleRow label="Breaking news" detail="Big stories, the moment they break" value={notifications.breaking} onChange={(v) => setNotification("breaking", v)} />
        <ToggleRow label="Daily Brief" detail="Your personalised brief every morning at 7am" value={notifications.dailyBrief} onChange={(v) => setNotification("dailyBrief", v)} />
        <ToggleRow label="Followed topics" detail="New stories in topics you follow" value={notifications.followedTopics} onChange={(v) => setNotification("followedTopics", v)} />
        <ToggleRow label="Trending" detail="When a story blows up" value={notifications.trending} onChange={(v) => setNotification("trending", v)} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
function PrivacyPage() {
  const setProfilePage = useUI((s) => s.setProfilePage);
  const showToast = useUI((s) => s.showToast);
  const settings = useSettings();

  return (
    <div>
      <SubPageHeader title="Privacy" onBack={() => setProfilePage("main")} />

      <div className="mt-2 ios-group rounded-3xl bg-surface-raised p-1.5 shadow-card">
        <ToggleRow
          label="Personalised feed"
          detail="Use my activity to rank stories"
          value={settings.personalisedFeed}
          onChange={(v) => settings.set("personalisedFeed", v)}
        />
        <ToggleRow
          label="Share analytics"
          detail="Anonymous usage data"
          value={settings.shareAnalytics}
          onChange={(v) => settings.set("shareAnalytics", v)}
        />
        <ToggleRow
          label="Private profile"
          detail="Hide your likes and playlists from others"
          value={settings.privateProfile}
          onChange={(v) => settings.set("privateProfile", v)}
        />
      </div>

      {/*
        Stands in for a role claim from the auth provider. It lives here so the
        moderation flow can be demonstrated end to end; once there is a real
        backend this switch goes away and the role comes off the session.
      */}
      <SectionLabel>Newsroom access</SectionLabel>
      <div className="ios-group rounded-3xl bg-surface-raised p-1.5 shadow-card">
        <ToggleRow
          label="Reviewer mode"
          detail="Opens the moderation queue for user uploads"
          value={settings.isReviewer}
          onChange={(v) => {
            settings.set("isReviewer", v);
            showToast(v ? "Reviewer mode on" : "Reviewer mode off", v ? "shield" : "cross");
          }}
        />
      </div>

      <p className="mt-3.5 px-1 text-[11px] leading-[1.6] text-ink-dim">
        IOL Plug never sells your data. Your reading history stays on your
        device unless you sign in and enable sync. Read the full policy at
        iol.co.za/privacy.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
function AccessibilityPage() {
  const setProfilePage = useUI((s) => s.setProfilePage);
  const settings = useSettings();

  return (
    <div>
      <SubPageHeader title="Accessibility" onBack={() => setProfilePage("settings")} />

      <SectionLabel>Text size</SectionLabel>
      <div className="rounded-3xl bg-surface-raised p-3 shadow-card">
        <Segmented
          layoutGroupId="a11y-textsize"
          value={settings.textSize}
          onChange={(id) => settings.set("textSize", id)}
          segments={TEXT_SIZES.map((t) => ({
            id: t.id,
            // Each option is set at the size it selects, so the control is
            // its own preview rather than three identical letters.
            label: <span style={{ fontSize: `${13 * t.scale}px` }}>{t.id}</span>,
            srLabel: { S: "Small text", M: "Medium text", L: "Large text" }[t.id],
          }))}
        />
      </div>

      <SectionLabel>Motion</SectionLabel>
      <div className="ios-group rounded-3xl bg-surface-raised p-1.5 shadow-card">
        <ToggleRow
          label="Reduce motion"
          detail="Minimise animations across the app"
          value={settings.reducedMotion}
          onChange={(v) => settings.set("reducedMotion", v)}
        />
      </div>

      <SectionLabel>Data</SectionLabel>
      <div className="ios-group rounded-3xl bg-surface-raised p-1.5 shadow-card">
        <ToggleRow
          label={
            <span className="flex items-center gap-1.5">
              <Wifi size={14} /> Low data mode
            </span>
          }
          detail="Same as Data saver — smaller images, no autoplay"
          value={settings.dataSaver}
          onChange={(v) => settings.set("dataSaver", v)}
        />
      </div>
      <p className="mt-3 px-2 text-[12px] font-medium leading-relaxed text-ink-faint">
        IOL Plug supports screen readers, keyboard navigation and dynamic text out of the box. Every gesture also has a button alternative.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
function AccountPage() {
  const setProfilePage = useUI((s) => s.setProfilePage);
  const user = useSettings((s) => s.user);
  const signOut = useSettings((s) => s.signOut);
  const resetAll = useContent((s) => s.resetAll);
  const setPhase = useUI((s) => s.setPhase);
  const showToast = useUI((s) => s.showToast);
  const [confirming, setConfirming] = useState(false);

  const logOut = () => {
    signOut();
    setProfilePage("main");
    setPhase("onboarding");
  };

  return (
    <div>
      <SubPageHeader title="Manage account" onBack={() => setProfilePage("settings")} />

      <div className="mt-3 rounded-3xl bg-surface-raised p-5 shadow-card">
        <p className="text-[11px] font-bold uppercase tracking-widest text-ink-faint">Signed in as</p>
        <p className="mt-1 text-[17px] font-bold text-ink">{user?.name ?? "Guest"}</p>
        <p className="text-[13px] font-medium text-ink-dim">{user?.email || "No email — guest mode"}</p>
        <span className="mt-2 inline-block rounded-pill bg-ink/6 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-ink-dim">
          {user?.method ?? "guest"}
        </span>
      </div>

      <div className="mt-4 ios-group rounded-3xl bg-surface-raised p-1.5 shadow-card">
        <button onClick={logOut} className="flex w-full items-center gap-3.5 rounded-2xl px-3 py-3.5 text-left text-[14.5px] font-semibold text-ink active:bg-ink/8">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink/6"><LogOut size={18} /></span>
          Sign out
        </button>
        <button
          onClick={() => {
            if (!confirming) {
              setConfirming(true);
              showToast("Tap again to confirm", "alert");
              return;
            }
            resetAll();
            signOut();
            localStorage.removeItem(HINTS_KEY);
            setPhase("onboarding");
          }}
          className="flex w-full items-center gap-3.5 rounded-2xl px-3 py-3.5 text-left text-[14.5px] font-semibold text-iol-red active:bg-iol-red/10"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-iol-red/12 text-iol-red"><Trash2 size={18} /></span>
          {confirming ? "Tap again — erase everything" : "Delete all my data"}
        </button>
      </div>
      <p className="mt-3 px-2 text-[12px] font-medium text-ink-faint">
        Deleting your data wipes likes, playlists, history and settings from this device.
      </p>
    </div>
  );
}
