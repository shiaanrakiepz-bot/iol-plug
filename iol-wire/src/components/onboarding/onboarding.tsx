"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { CATEGORY_MAP, INTEREST_TOPICS } from "@/data/categories";
import { useSettings, type UserProfile } from "@/lib/store";
import { useUI } from "@/lib/ui-store";
import { cn, vibrate } from "@/lib/utils";
import type { CategoryId } from "@/types";

type Mode = "signin" | "signup";

const spring = { type: "spring", stiffness: 380, damping: 32 } as const;

export function Onboarding() {
  const [step, setStep] = useState<"auth" | "interests">("auth");
  const [pendingUser, setPendingUser] = useState<UserProfile | null>(null);

  return (
    <motion.div
      className="fixed inset-0 z-[90] overflow-y-auto bg-black text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04, transition: { duration: 0.35 } }}
    >
      <AnimatePresence mode="wait">
        {step === "auth" ? (
          <AuthStep
            key="auth"
            onDone={(user) => {
              setPendingUser(user);
              setStep("interests");
            }}
          />
        ) : (
          <InterestsStep key="interests" user={pendingUser!} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
function Field(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full rounded-[17px] border border-white/[.13] bg-white/[.06] px-[18px] py-[15px] text-[13.5px] text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] allow-select"
    />
  );
}

function AuthStep({ onDone }: { onDone: (user: UserProfile) => void }) {
  const [mode, setMode] = useState<Mode>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const showToast = useUI((s) => s.showToast);

  const submitEmail = () => {
    if (!email.includes("@")) return setError("Enter a valid email address");
    if (password.length < 6)
      return setError("Password needs at least 6 characters");
    if (mode === "signup" && name.trim().length < 2)
      return setError("Tell us your name");

    const displayName =
      mode === "signup"
        ? name.trim()
        : email.split("@")[0].replace(/[^a-zA-Z ]/g, " ").trim();
    const finalName = capitalize(displayName) || "Shi-Aan";
    if (mode === "signup") {
      showToast(`Welcome to the wire, ${finalName.split(" ")[0]}`, "🎉");
    }
    onDone({ name: finalName, email, method: "email" });
  };

  const social = (method: "google" | "apple") => {
    vibrate(6);
    showToast(`Signed in with ${method === "google" ? "Google" : "Apple"}`, "✅");
    onDone({
      name: "Shi-Aan",
      email: `shiaan@${method === "google" ? "gmail" : "icloud"}.com`,
      method,
    });
  };

  return (
    <motion.div
      className="relative mx-auto flex min-h-dvh w-full max-w-md flex-col px-[26px] pb-7 pt-[60px]"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={spring}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo.jpeg"
        alt="IOL Wire"
        className={cn(
          "mx-auto block rounded-[18px]",
          mode === "signin" ? "animate-spring-in h-20 w-20" : "h-16 w-16"
        )}
      />

      {mode === "signin" ? (
        <div className="mt-4 text-center">
          <h1 className="text-[31px] font-black uppercase leading-[1.05] tracking-[-0.5px]">
            News that
            <br />
            <span className="text-[var(--accent)]">hits</span> different
            <span className="text-[var(--accent)]">.</span>
          </h1>
          <p className="mt-2.5 text-[12.5px] font-medium text-white/55">
            Sign in to build a feed that gets you
          </p>
        </div>
      ) : (
        <div className="mt-3.5 text-center">
          <h1 className="text-[27px] font-extrabold tracking-[-0.5px]">
            Join the wire
          </h1>
          <p className="mt-1.5 text-[12.5px] text-white/50">
            Free forever. No paywalls for students.
          </p>
        </div>
      )}

      <div className="mt-[26px] flex flex-col gap-[11px]">
        {mode === "signin" && (
          <>
            <GlassButton onClick={() => social("google")}>
              <GoogleIcon />
              Continue with Google
            </GlassButton>
            <GlassButton onClick={() => social("apple")}>
              <AppleIcon />
              Continue with Apple
            </GlassButton>

            <div className="my-1.5 flex items-center gap-3">
              <div className="h-px flex-1 bg-white/[.12]" />
              <span className="text-[10.5px] font-medium tracking-[2px] text-white/40">
                OR
              </span>
              <div className="h-px flex-1 bg-white/[.12]" />
            </div>
          </>
        )}

        {mode === "signup" && (
          <Field
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
          />
        )}

        <Field
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          inputMode="email"
        />
        <Field
          placeholder={mode === "signup" ? "Create password" : "Password"}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
        />

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            role="alert"
            className="px-1 text-xs font-semibold text-[var(--accent)]"
          >
            {error}
          </motion.p>
        )}

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={submitEmail}
          className="rounded-[17px] bg-[var(--accent)] py-[15px] text-[14px] font-bold text-white shadow-glow"
        >
          {mode === "signin" ? "Sign in" : "Create account"}
        </motion.button>

        {mode === "signin" ? (
          <button
            onClick={() => showToast("Reset link sent — check your inbox", "📧")}
            className="p-1 text-center text-[12px] text-white/55 hover:text-white"
          >
            Forgot password?
          </button>
        ) : (
          <p className="px-3 text-center text-[10.5px] leading-[1.6] text-white/35">
            By continuing you agree to IOL Wire&apos;s Terms of Service and
            Privacy Policy.
          </p>
        )}
      </div>

      <div className="min-h-[18px] flex-1" />

      {mode === "signin" && (
        <button
          onClick={() => onDone({ name: "Guest", email: "", method: "guest" })}
          className="flex items-center justify-center gap-2 rounded-[17px] border border-white/[.18] py-[13px] text-[13px] font-semibold text-white/80 transition-colors hover:bg-white/[.06]"
        >
          Continue as guest
          <ChevronRight size={15} strokeWidth={2} />
        </button>
      )}

      <p className="mt-4 text-center text-[12px] text-white/45">
        {mode === "signin" ? (
          <>
            New to IOL Wire?{" "}
            <button
              className="font-semibold text-[var(--accent)]"
              onClick={() => {
                setMode("signup");
                setError("");
              }}
            >
              Create account
            </button>
          </>
        ) : (
          <>
            Already wired in?{" "}
            <button
              className="font-semibold text-[var(--accent)]"
              onClick={() => {
                setMode("signin");
                setError("");
              }}
            >
              Sign in
            </button>
          </>
        )}
      </p>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
function InterestsStep({ user }: { user: UserProfile }) {
  const [selected, setSelected] = useState<CategoryId[]>([]);
  const completeOnboarding = useSettings((s) => s.completeOnboarding);
  const setPhase = useUI((s) => s.setPhase);
  const showToast = useUI((s) => s.showToast);

  const toggle = (id: CategoryId) => {
    vibrate(4);
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const ready = selected.length >= 3;

  const finish = () => {
    if (!ready) return;
    completeOnboarding(user, selected);
    setPhase("app");
    showToast(`Feed tuned for you, ${user.name.split(" ")[0]}`, "🎯");
  };

  const label = ready
    ? "Build my feed"
    : selected.length === 0
      ? "Pick at least 3 topics"
      : `Pick ${3 - selected.length} more`;

  return (
    <motion.div
      className="relative mx-auto flex min-h-dvh w-full max-w-md flex-col"
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={spring}
    >
      <div className="px-6 pb-3.5 pt-16">
        <p className="text-[10px] font-semibold tracking-[3.5px] text-[var(--accent)]">
          ALMOST THERE
        </p>
        <h1 className="mt-1.5 text-[29px] font-black uppercase leading-[1.02] tracking-[-0.4px]">
          What are
          <br />
          you into<span className="text-[var(--accent)]">?</span>
        </h1>
        <p className="mt-[7px] text-[12.5px] leading-[1.5] text-white/50">
          Pick 3 or more. Your feed shapes itself around this — you can change
          it anytime.
        </p>
      </div>

      <div className="flex flex-1 flex-wrap content-start gap-2.5 px-6 pb-32 pt-2">
        {INTEREST_TOPICS.map((id, i) => {
          const cat = CATEGORY_MAP[id];
          const active = selected.includes(id);
          return (
            <button
              key={id}
              onClick={() => toggle(id)}
              aria-pressed={active}
              className={cn(
                "animate-pop-in rounded-pill border px-[18px] py-[11px] text-[13px] font-semibold transition-all duration-200",
                active
                  ? "scale-105 border-transparent text-[#0B0B0E]"
                  : "border-white/[.16] bg-white/[.07] text-white"
              )}
              style={{
                animationDelay: `${i * 0.03}s`,
                ...(active ? { background: cat.color } : {}),
              }}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      <div
        className="fixed inset-x-0 bottom-0 z-10 mx-auto max-w-md px-6 pb-[30px] pt-[18px]"
        style={{
          background: "linear-gradient(to top, #000 45%, transparent)",
        }}
      >
        <motion.button
          whileTap={ready ? { scale: 0.98 } : undefined}
          disabled={!ready}
          onClick={finish}
          className={cn(
            "w-full rounded-[17px] py-4 text-center text-[14px] font-bold transition-all duration-300",
            ready
              ? "bg-[var(--accent)] text-white shadow-glow"
              : "bg-white/[.08] text-white/40"
          )}
        >
          {label}
        </motion.button>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
function GlassButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="flex w-full items-center justify-center gap-2.5 rounded-[17px] border border-white/[.24] py-3.5 text-[13.5px] font-semibold text-white backdrop-blur-[26px]"
      style={{
        background:
          "linear-gradient(180deg, rgba(255,255,255,.17), rgba(255,255,255,.05))",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,.28), 0 10px 26px rgba(0,0,0,.35)",
      }}
    >
      {children}
    </motion.button>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path fill="#EA4335" d="M12 5.04c1.62 0 3.06.56 4.2 1.64l3.12-3.12C17.4 1.7 14.9.68 12 .68 7.55.68 3.7 3.23 1.82 6.96l3.66 2.84C6.36 7.1 8.96 5.04 12 5.04z"/>
      <path fill="#4285F4" d="M23.5 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.46c-.28 1.48-1.12 2.73-2.38 3.58l3.6 2.79c2.1-1.94 3.82-4.8 3.82-8.61z"/>
      <path fill="#FBBC05" d="M5.48 14.2a7.17 7.17 0 0 1 0-4.4L1.82 6.96a11.36 11.36 0 0 0 0 10.08l3.66-2.84z"/>
      <path fill="#34A853" d="M12 23.32c3.06 0 5.63-1 7.5-2.74l-3.6-2.79c-1 .68-2.3 1.08-3.9 1.08-3.04 0-5.64-2.06-6.52-4.87l-3.66 2.84C3.7 20.77 7.55 23.32 12 23.32z"/>
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.05 20.28c-.98.95-2.05.86-3.08.38-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.38C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.79.79-.16 2.02-.86 3.4-.73 1.66.13 2.91.79 3.73 1.98-3.42 2.05-2.87 6.57.79 8.02-.63 1.35-1.45 2.68-2.99 2.91h-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  );
}

function capitalize(s: string) {
  return s
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
