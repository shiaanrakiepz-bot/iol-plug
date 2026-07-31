"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useUI } from "@/lib/ui-store";
import { TopBar } from "@/components/navigation/top-bar";
import { BottomNav } from "@/components/navigation/bottom-nav";
import { CategoryDrawer } from "@/components/navigation/category-drawer";
import { Feed } from "@/components/feed/feed";
import { Explore } from "@/components/explore/explore";
import { Profile } from "@/components/profile/profile";
import { ArticleReader } from "@/components/reader/article-reader";
import { VideoOverlay } from "@/components/reader/video-overlay";
import { ContextSheet } from "@/components/sheets/context-sheet";
import { PlaylistSheet } from "@/components/sheets/playlist-sheet";
import { ShareSheet } from "@/components/sheets/share-sheet";
import { CommentsSheet } from "@/components/sheets/comments-sheet";
import { AccountProfile } from "@/components/profile/account-profile";

export function AppShell() {
  const tab = useUI((s) => s.tab);
  const readerId = useUI((s) => s.readerId);
  const videoId = useUI((s) => s.videoId);
  const contextId = useUI((s) => s.contextId);
  const playlistFor = useUI((s) => s.playlistFor);
  const shareFor = useUI((s) => s.shareFor);
  const commentsFor = useUI((s) => s.commentsFor);
  const drawerOpen = useUI((s) => s.drawerOpen);
  const viewingAccount = useUI((s) => s.viewingAccount);

  return (
    <motion.div
      className="absolute inset-0 mx-auto max-w-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <TopBar />

      {/* Keyed enter-only transition: tab switches must never wait on a
          heavy exiting tree, so the old tab is dropped instantly. */}
      <motion.div
        key={tab}
        className="absolute inset-0"
        initial={{ opacity: 0, scale: 0.985 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
      >
        {tab === "foryou" && <Feed />}
        {tab === "explore" && <Explore />}
        {tab === "profile" && <Profile />}
      </motion.div>

      <BottomNav />

      {/* overlays */}
      <AnimatePresence>{drawerOpen && <CategoryDrawer key="drawer" />}</AnimatePresence>
      <AnimatePresence>
        {viewingAccount && (
          <AccountProfile key={`acct-${viewingAccount}`} handle={viewingAccount} />
        )}
      </AnimatePresence>
      <AnimatePresence>{readerId && <ArticleReader key={`reader-${readerId}`} articleId={readerId} />}</AnimatePresence>
      <AnimatePresence>{videoId && <VideoOverlay key={`video-${videoId}`} articleId={videoId} />}</AnimatePresence>
      <AnimatePresence>{contextId && <ContextSheet key="ctx" articleId={contextId} />}</AnimatePresence>
      <AnimatePresence>{playlistFor && <PlaylistSheet key="pl" articleId={playlistFor} />}</AnimatePresence>
      <AnimatePresence>{shareFor && <ShareSheet key="share" articleId={shareFor} />}</AnimatePresence>
      <AnimatePresence>{commentsFor && <CommentsSheet key="cm" articleId={commentsFor} />}</AnimatePresence>
    </motion.div>
  );
}
