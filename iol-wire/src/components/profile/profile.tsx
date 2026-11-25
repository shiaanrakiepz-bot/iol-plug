"use client";

import { motion } from "framer-motion";
import {
  Briefcase,
  ShieldCheck,
  Heart,
  Bookmark,
  History,
  ListMusic,
  Download,
  Trophy,
  Settings,
  Bell,
  Shield,
  Trash2,
} from "lucide-react";
import { useUI, type ProfilePage } from "@/lib/ui-store";
import {
  useContent,
  useSettings,
  savedIds,
  ACCENTS,
  TEXT_SIZES,
  LANGUAGES,
} from "@/lib/store";
import { getArticle } from "@/data/articles";
import { SELF_HANDLE } from "@/data/accounts";
import { ACHIEVEMENTS } from "@/data/achievements";
import {
  SubPageHeader,
  ArticleRow,
  MenuRow,
  ToggleRow,
  EmptyState,
  SectionLabel,
} from "./shared";
import { SettingsPages } from "./settings";
import { Applications } from "./applications";
import { Badge } from "./badge";
import { WrappedCard } from "@/components/wrapped/wrapped-card";
import { TodayPanel } from "@/components/progress/today-panel";
import { DailyBrief } from "./brief";
import { cn } from "@/lib/utils";
import { Glyph, type GlyphName } from "@/components/icons/glyphs";

export function Profile() {
  const page = useUI((s) => s.profilePage);

  return (
    <div className="absolute inset-x-0 bottom-[86px] top-[60px] overflow-y-auto overscroll-contain px-4 pb-6">
      <motion.div
        key={page}
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 34 }}
      >
        <ProfileRouter page={page} />
      </motion.div>
    </div>
  );
}

function ProfileRouter({ page }: { page: ProfilePage }) {
  switch (page) {
    case "main":
      return <ProfileMain />;
    case "liked":
      return <LikedPage />;
    case "history":
      return <HistoryPage />;
    case "playlists":
    case "saved":
      return <PlaylistsPage />;
    case "downloads":
      return <DownloadsPage />;
    case "achievements":
      return <AchievementsPage />;
    case "applications":
      return <Applications />;
    case "brief":
      return <DailyBrief />;
    default:
      return <SettingsPages page={page} />;
  }
}

/* ------------------------------------------------------------------ */
/** "Thabo Mokoena" → "TM"; guests get a single G. */
function initialsOf(name: string | undefined): string {
  const words = (name ?? "").trim().split(/\s+/).filter(Boolean);
  if (!words.length) return "G";
  return words.map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

function ProfileMain() {
  const user = useSettings((s) => s.user);
  const interests = useSettings((s) => s.interests);
  const settings = useSettings();
  const stats = useContent((s) => s.stats);
  const liked = useContent((s) => s.liked);
  const playlists = useContent((s) => s.playlists);
  const history = useContent((s) => s.history);
  const downloads = useContent((s) => s.downloads);
  const setProfilePage = useUI((s) => s.setProfilePage);
  const showToast = useUI((s) => s.showToast);
  const viewAccount = useUI((s) => s.viewAccount);

  const isGuest = user?.method === "guest";
  const unlocked = ACHIEVEMENTS.filter(
    (a) => metricValue(stats, interests.length, a.metric) >= a.goal
  );
  const savedCount = savedIds(playlists).length;
  const applicationCount = useContent((s) => s.applications.length);
  const pendingReviews = useContent((s) => s.submissions.filter((x) => x.status === "pending").length);
  const isReviewer = useSettings((s) => s.isReviewer);
  const setAdmin = useUI((s) => s.setAdmin);
  const handle = isGuest
    ? "guest mode"
    : `@${(user?.name ?? "guest").toLowerCase().replace(/\s+/g, "")}`;

  return (
    <div>
      {/* header */}
      <div className="flex flex-col items-center gap-1">
        <span
          className="flex h-[78px] w-[78px] items-center justify-center rounded-full text-[25px] font-extrabold text-white"
          style={{
            background: "linear-gradient(140deg, var(--accent), #5B0E18)",
            boxShadow: "0 10px 30px var(--accent-soft)",
          }}
          aria-hidden
        >
          {initialsOf(user?.name)}
        </span>
        <h1 className="mt-2 text-[19px] font-extrabold tracking-[-0.3px] text-ink">
          {user?.name || "Guest"}
        </h1>
        <p className="text-[11.5px] text-ink-dim">{handle}</p>
        <div className="mt-2.5 flex gap-2">
          <PillButton
            onPress={() =>
              isGuest
                ? showToast("Sign up to edit your profile", "pencil")
                : setProfilePage("account")
            }
          >
            Edit profile
          </PillButton>
          <PillButton onPress={() => viewAccount(SELF_HANDLE)}>
            View profile
          </PillButton>
          <PillButton
            onPress={() => showToast("Profile link copied", "link")}
          >
            Share
          </PillButton>
        </div>
      </div>

      {isGuest && (
        <div
          className="mt-4 flex items-center gap-3.5 rounded-[20px] border border-[var(--glass-border)] px-4 py-4"
          style={{
            background:
              "linear-gradient(140deg, var(--accent-soft), var(--surface-raised) 70%)",
          }}
        >
          <div className="flex-1">
            <p className="text-[13px] font-bold text-ink">
              You&apos;re browsing as a guest
            </p>
            <p className="mt-0.5 text-[11px] leading-[1.45] text-ink-dim">
              Create an account to keep your likes, playlists and streaks.
            </p>
          </div>
          <button
            onClick={() => useUI.getState().setPhase("onboarding")}
            className="shrink-0 rounded-pill bg-[var(--accent)] px-4 py-2.5 text-[11.5px] font-bold text-white"
          >
            Sign up
          </button>
        </div>
      )}

      {/* stats */}
      <div className="mt-4 flex overflow-hidden rounded-[20px] border border-[var(--glass-border)] bg-surface-raised">
        <Stat label="Liked" value={liked.length} />
        <span className="w-px bg-[var(--glass-border)]" />
        <Stat label="Saved" value={savedCount} />
        <span className="w-px bg-[var(--glass-border)]" />
        <Stat label="Day streak" value={stats.streak} accent />
      </div>

      <WrappedCard />

      <div className="mt-4">
        <TodayPanel />
      </div>

      {/* library */}
      <SectionLabel>Your library</SectionLabel>
      <Group>
        <MenuRow icon={<Heart size={16} />} iconBg="#FF8FB1" label="Liked stories" detail={String(liked.length)} onPress={() => setProfilePage("liked")} />
        <MenuRow icon={<Bookmark size={15} />} iconBg="#FFD166" label="Saved" detail={String(savedCount)} onPress={() => setProfilePage("saved")} />
        <MenuRow icon={<History size={16} />} iconBg="#7CC4FF" label="History" detail={String(history.length)} onPress={() => setProfilePage("history")} />
        <MenuRow icon={<ListMusic size={16} />} iconBg="#D9A0FF" label="Playlists" detail={String(playlists.length)} onPress={() => setProfilePage("playlists")} />
        <MenuRow icon={<Download size={16} />} iconBg="#7CE0B3" label="Downloads" detail={String(downloads.length)} onPress={() => setProfilePage("downloads")} />
        <MenuRow icon={<Briefcase size={16} />} iconBg="#6FBFFF" label="Applications" detail={String(applicationCount)} onPress={() => setProfilePage("applications")} />
        <MenuRow icon={<Trophy size={16} />} iconBg="#FFB35C" label="Achievements" detail={`${unlocked.length}/${ACHIEVEMENTS.length}`} onPress={() => setProfilePage("achievements")} />
      </Group>

      {/* appearance */}
      <SectionLabel>Appearance</SectionLabel>
      <div className="flex flex-col gap-3.5 rounded-[20px] border border-[var(--glass-border)] bg-surface-raised px-4 py-3.5">
        <div className="flex gap-[3px] rounded-2xl bg-[var(--glass-bg)] p-[3px]">
          {(["dark", "light"] as const).map((t) => (
            <button
              key={t}
              onClick={() => settings.set("theme", t)}
              aria-pressed={settings.theme === t}
              className={cn(
                "flex-1 rounded-[11px] py-2 text-center text-[12.5px] font-semibold capitalize transition-all duration-250",
                settings.theme === t
                  ? "bg-[var(--accent)] text-white"
                  : "text-ink-dim"
              )}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[13px] font-semibold text-ink">Accent colour</span>
          <div className="flex gap-2.5">
            {ACCENTS.map((a) => (
              <button
                key={a.id}
                onClick={() => settings.set("accent", a.id)}
                aria-label={a.label}
                aria-pressed={settings.accent === a.id}
                className="h-[26px] w-[26px] rounded-full border-2 transition-all duration-200"
                style={{
                  background: a.hex,
                  borderColor:
                    settings.accent === a.id
                      ? settings.theme === "dark"
                        ? "#fff"
                        : "#101014"
                      : "transparent",
                }}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[13px] font-semibold text-ink">Text size</span>
          <div className="flex gap-[3px] rounded-xl bg-[var(--glass-bg)] p-[3px]">
            {TEXT_SIZES.map((s) => (
              <button
                key={s.id}
                onClick={() => settings.set("textSize", s.id)}
                aria-pressed={settings.textSize === s.id}
                className={cn(
                  "rounded-[11px] px-3.5 py-1.5 text-[11px] font-semibold transition-all duration-200",
                  settings.textSize === s.id
                    ? "bg-[var(--accent)] text-white"
                    : "text-ink-dim"
                )}
              >
                {s.id}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* playback */}
      <SectionLabel>Playback &amp; data</SectionLabel>
      <Group>
        <ToggleRow label="Autoplay videos" value={settings.autoplayVideos} onChange={(v) => settings.set("autoplayVideos", v)} />
        <ToggleRow label="Captions" value={settings.captions} onChange={(v) => settings.set("captions", v)} />
        <ToggleRow label="Data saver" value={settings.dataSaver} onChange={(v) => settings.set("dataSaver", v)} />
        <ValueRow
          label="Video quality"
          value={QUALITY_LABEL[settings.videoQuality]}
          onPress={() => {
            const order = ["auto", "low", "high"] as const;
            const next = order[(order.indexOf(settings.videoQuality) + 1) % order.length];
            settings.set("videoQuality", next);
          }}
        />
      </Group>

      {/* general */}
      <SectionLabel>General</SectionLabel>
      <Group>
        <MenuRow icon={<Bell size={16} />} label="Notification preferences" onPress={() => setProfilePage("notifications")} />
        <ValueRow
          label="Language"
          value={settings.language}
          onPress={() => {
            const i = LANGUAGES.indexOf(settings.language);
            settings.set("language", LANGUAGES[(i + 1) % LANGUAGES.length]);
          }}
        />
        <ToggleRow label="Reduce motion" value={settings.reducedMotion} onChange={(v) => settings.set("reducedMotion", v)} />
        <MenuRow icon={<Shield size={16} />} label="Privacy" onPress={() => setProfilePage("privacy")} />
      </Group>

      {/*
        Staff only. The queue itself re-checks the flag, so hiding the row is
        presentation rather than the access control.
      */}
      {isReviewer && (
        <>
          <SectionLabel>Newsroom</SectionLabel>
          <Group>
            <MenuRow
              icon={<ShieldCheck size={16} />}
              iconBg="#7CE0B3"
              label="Review queue"
              detail={pendingReviews ? String(pendingReviews) : undefined}
              onPress={() => setAdmin(true)}
            />
          </Group>
        </>
      )}

      {/* account */}
      <SectionLabel>Account</SectionLabel>
      <Group>
        <MenuRow icon={<Settings size={16} />} label="Manage account" onPress={() => setProfilePage("account")} />
      </Group>

      <p className="mt-[22px] text-center text-[10px] tracking-[1px] text-ink-dim">
        IOL PLUG v1.0 · MADE IN SOUTH AFRICA
      </p>
    </div>
  );
}

const QUALITY_LABEL = { auto: "Auto", low: "480p", high: "1080p" } as const;

function Group({ children }: { children: React.ReactNode }) {
  return (
    <div className="ios-group overflow-hidden rounded-[20px] border border-[var(--glass-border)] bg-surface-raised [--row-inset:16px]">
      {children}
    </div>
  );
}

function PillButton({
  children,
  onPress,
}: {
  children: React.ReactNode;
  onPress: () => void;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      onClick={onPress}
      className="rounded-pill border border-[var(--glass-border)] bg-[var(--glass-bg)] px-[18px] py-2.5 text-[12px] font-semibold text-ink"
    >
      {children}
    </motion.button>
  );
}

function ValueRow({
  label,
  value,
  onPress,
}: {
  label: string;
  value: string;
  onPress: () => void;
}) {
  return (
    <button
      onClick={onPress}
      className="flex w-full items-center justify-between px-4 py-3.5 text-left transition-colors active:bg-ink/8"
    >
      <span className="text-[13px] font-semibold text-ink">{label}</span>
      <span className="text-[12px] font-semibold text-[var(--accent)]">{value}</span>
    </button>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent?: boolean;
}) {
  return (
    <div className="flex-1 py-3.5 text-center">
      <p
        className={cn(
          "text-[19px] font-extrabold",
          accent ? "text-[var(--accent)]" : "text-ink"
        )}
      >
        {value}
      </p>
      <p className="mt-0.5 text-[9.5px] font-semibold uppercase tracking-[1.5px] text-ink-dim">
        {label}
      </p>
    </div>
  );
}

export function metricValue(
  stats: { reads: number; likes: number; saves: number; shares: number; streak: number },
  topics: number,
  metric: string
): number {
  switch (metric) {
    case "reads": return stats.reads;
    case "likes": return stats.likes;
    case "saves": return stats.saves;
    case "shares": return stats.shares;
    case "streak": return stats.streak;
    case "topics": return topics;
    default: return 0;
  }
}

/* ------------------------------------------------------------------ */
function ListPage({
  title,
  ids,
  empty,
  trailing,
}: {
  title: string;
  ids: string[];
  empty: { glyph: GlyphName; title: string; text: string };
  trailing?: (id: string) => React.ReactNode;
}) {
  const setProfilePage = useUI((s) => s.setProfilePage);
  const setTab = useUI((s) => s.setTab);
  const articles = ids.map(getArticle).filter(Boolean);

  return (
    <div>
      <SubPageHeader title={title} onBack={() => setProfilePage("main")} />
      {articles.length === 0 ? (
        <EmptyState {...empty} cta="Go to your feed" onCta={() => setTab("foryou")} />
      ) : (
        <div className="mt-2 space-y-3">
          {articles.map((a) => (
            <ArticleRow key={a!.id} article={a!} trailing={trailing?.(a!.id)} />
          ))}
        </div>
      )}
    </div>
  );
}

function LikedPage() {
  const liked = useContent((s) => s.liked);
  const toggleLike = useContent((s) => s.toggleLike);
  return (
    <ListPage
      title="Liked stories"
      ids={liked}
      empty={{ glyph: "heart", title: "No likes yet", text: "Swipe left on a story you love and it lands here." }}
      trailing={(id) => (
        <button onClick={() => toggleLike(id)} aria-label="Unlike" className="p-2 text-[#FF2E54]">
          <Heart size={18} fill="#FF2E54" />
        </button>
      )}
    />
  );
}

function HistoryPage() {
  const history = useContent((s) => s.history);
  const clearHistory = useContent((s) => s.clearHistory);
  const setProfilePage = useUI((s) => s.setProfilePage);
  const setTab = useUI((s) => s.setTab);
  const showToast = useUI((s) => s.showToast);
  const articles = history.map(getArticle).filter(Boolean);

  return (
    <div>
      <SubPageHeader
        title="History"
        onBack={() => setProfilePage("main")}
        action={
          articles.length > 0 ? (
            <button
              onClick={() => {
                clearHistory();
                showToast("History cleared", "trash");
              }}
              className="text-[12.5px] font-bold text-iol-red"
            >
              Clear
            </button>
          ) : undefined
        }
      />
      {articles.length === 0 ? (
        <EmptyState glyph="clock" title="Nothing here yet" text="Stories you open show up here so you can find them again." cta="Go to your feed" onCta={() => setTab("foryou")} />
      ) : (
        <div className="mt-2 space-y-3">
          {articles.map((a) => (
            <ArticleRow key={a!.id} article={a!} />
          ))}
        </div>
      )}
    </div>
  );
}

function DownloadsPage() {
  const downloads = useContent((s) => s.downloads);
  const toggleDownload = useContent((s) => s.toggleDownload);
  return (
    <ListPage
      title="Downloads"
      ids={downloads}
      empty={{ glyph: "download", title: "No downloads", text: "Download stories from the reader and they'll work even offline." }}
      trailing={(id) => (
        <button onClick={() => toggleDownload(id)} aria-label="Remove download" className="p-2 text-ink-faint">
          <Trash2 size={17} />
        </button>
      )}
    />
  );
}

/* ------------------------------------------------------------------ */
function PlaylistsPage() {
  const playlists = useContent((s) => s.playlists);
  const readLater = useContent((s) => s.readLater);
  const deletePlaylist = useContent((s) => s.deletePlaylist);
  const removeFromPlaylist = useContent((s) => s.removeFromPlaylist);
  const setProfilePage = useUI((s) => s.setProfilePage);
  const profilePage = useUI((s) => s.profilePage);
  const playlistDetail = useUI((s) => s.playlistDetail);
  const setPlaylistDetail = useUI((s) => s.setPlaylistDetail);
  const setTab = useUI((s) => s.setTab);
  const showToast = useUI((s) => s.showToast);

  // "saved" page doubles as Read Later
  if (profilePage === "saved") {
    return (
      <ListPage
        title="Read Later"
        ids={readLater}
        empty={{ glyph: "clock", title: "Nothing saved for later", text: "Hold a story card and tap Read Later to stash it here." }}
      />
    );
  }

  const detail = playlists.find((p) => p.id === playlistDetail);
  if (detail) {
    const articles = detail.articleIds.map(getArticle).filter(Boolean);
    return (
      <div>
        <SubPageHeader
          title={detail.name}
          onBack={() => setPlaylistDetail(null)}
          action={
            <button
              onClick={() => {
                deletePlaylist(detail.id);
                setPlaylistDetail(null);
                showToast("Playlist deleted", "trash");
              }}
              aria-label="Delete playlist"
              className="p-2 text-iol-red"
            >
              <Trash2 size={17} />
            </button>
          }
        />
        {articles.length === 0 ? (
          <EmptyState glyph={detail.glyph} title="Empty playlist" text="Swipe down on a story in your feed to add it here." cta="Go to your feed" onCta={() => setTab("foryou")} />
        ) : (
          <div className="mt-2 space-y-3">
            {articles.map((a) => (
              <ArticleRow
                key={a!.id}
                article={a!}
                trailing={
                  <button
                    onClick={() => removeFromPlaylist(detail.id, a!.id)}
                    aria-label="Remove from playlist"
                    className="p-2 text-ink-faint"
                  >
                    <Trash2 size={17} />
                  </button>
                }
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <SubPageHeader title="Playlists" onBack={() => setProfilePage("main")} />
      {playlists.length === 0 ? (
        <EmptyState glyph="archive" title="No playlists yet" text="Swipe down on any story to create your first playlist." cta="Go to your feed" onCta={() => setTab("foryou")} />
      ) : (
        <div className="mt-3 grid grid-cols-2 gap-3">
          {playlists.map((p) => {
            const cover = p.articleIds[0] ? getArticle(p.articleIds[0]) : null;
            return (
              <motion.button
                key={p.id}
                whileTap={{ scale: 0.96 }}
                onClick={() => setPlaylistDetail(p.id)}
                className="relative h-40 overflow-hidden rounded-3xl text-left shadow-card"
              >
                {cover ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={`https://picsum.photos/seed/${cover.imageSeed}/400/320`} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full bg-ink/10" />
                )}
                <div aria-hidden className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85), transparent 60%)" }} />
                <div className="absolute inset-x-0 bottom-0 p-3.5">
                  <Glyph name={p.glyph} size={22} className="text-ink" />
                  <p className="text-[14px] font-bold text-white">{p.name}</p>
                  <p className="text-[11px] font-semibold text-white/70">
                    {p.articleIds.length} {p.articleIds.length === 1 ? "story" : "stories"}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
function AchievementsPage() {
  const stats = useContent((s) => s.stats);
  const interests = useSettings((s) => s.interests);
  const setProfilePage = useUI((s) => s.setProfilePage);

  return (
    <div>
      <SubPageHeader title="Achievements" onBack={() => setProfilePage("main")} />
      <div className="mt-3 grid grid-cols-2 gap-3">
        {ACHIEVEMENTS.map((a, i) => {
          const value = metricValue(stats, interests.length, a.metric);
          const done = value >= a.goal;
          const pct = Math.min(100, Math.round((value / a.goal) * 100));
          return (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.04 * i }}
              className={cn(
                "rounded-3xl bg-surface-raised p-4 shadow-card",
                !done && "opacity-80"
              )}
            >
              <Badge id={a.id} glyph={a.glyph} earned={done} size={60} />
              <p className="mt-2 text-[13.5px] font-bold text-ink">{a.title}</p>
              <p className="text-[11px] font-medium leading-snug text-ink-faint">{a.description}</p>
              <div className="mt-2.5 h-1.5 w-full rounded-full bg-ink/10">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct}%`, background: done ? "#22C55E" : "var(--accent)" }}
                />
              </div>
              <p className="mt-1 text-[10.5px] font-bold text-ink-faint">
                {done ? "Unlocked" : `${Math.min(value, a.goal)}/${a.goal}`}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
