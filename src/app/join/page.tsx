"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { useSound } from "@/lib/sound";
import { Navigation } from "@/components/layout/Navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { toast } from "sonner";
import { Card } from "@/components/ui/Card";
import { useAuth } from "@/app/providers";

const joinSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  notifications: z.object({
    videos: z.boolean().default(true),
    community: z.boolean().default(true),
    announcements: z.boolean().default(false),
  }).default({ videos: true, community: true, announcements: false }),
});

type JoinFormData = z.infer<typeof joinSchema>;

export default function JoinPage() {
  const { playUIHover, playUIClick, playUISuccess, playUIError } = useSound();
  const { user, signUp, loading: authLoading } = useAuth();
  const [step, setStep] = useState<"email" | "preferences" | "success">("email");
  const [submitting, setSubmitting] = useState(false);
  const [email, setEmail] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<JoinFormData>({
    resolver: zodResolver(joinSchema),
    defaultValues: {
      email: "",
      notifications: { videos: true, community: true, announcements: false },
    },
  });

  const watchedEmail = watch("email");

  const onEmailSubmit = async (data: { email: string }) => {
    if (user) {
      setEmail(data.email);
      setStep("preferences");
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await signUp(data.email, "temp_password_123");
      if (error) throw error;

      setEmail(data.email);
      setStep("preferences");
      toast.success("Account created! Check your email to confirm.");
    } catch {
      playUIError();
      toast.error("Failed to create account. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const onPreferencesSubmit = async (data: JoinFormData) => {
    setSubmitting(true);
    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: watchedEmail || email, ...data.notifications }),
      });

      if (!response.ok) throw new Error("Failed to subscribe");

      playUISuccess();
      setStep("success");
      toast.success("Subscribed!", { description: "You'll now receive notifications." });
    } catch {
      playUIError();
      toast.error("Failed to subscribe. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    playUIClick();
    setStep(step === "preferences" ? "email" : "preferences");
  };

  if (user) {
    return (
      <div className="min-h-screen bg-abyss-black">
        <Navigation />
        <section className="relative pt-32 pb-20 px-4 md:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="inline-block px-4 py-1.5 rounded-full glass border-glass-border/50 text-caption text-neon-cyan tracking-widest mb-6">
                ALREADY A MEMBER
              </span>
              <h1 className="text-display-xl md:text-display-xl lg:text-[clamp(3rem,6vw,4.5rem)] font-black tracking-tight text-ghost-white mb-6">
                Welcome back, <span className="text-gradient-cyan">{user.email}</span>
              </h1>
              <p className="text-body-lg text-ghost-muted mb-10">
                You&rsquo;re already part of the abyss. Manage your preferences below.
              </p>
              <Button size="xl" variant="primary" onClick={() => playUIClick()}>
                <span>MANAGE PREFERENCES</span>
              </Button>
            </motion.div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-abyss-black">
      <Navigation />

      <section className="relative pt-32 pb-20 px-4 md:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1.5 rounded-full glass border-glass-border/50 text-caption text-neon-cyan tracking-widest mb-6">
              JOIN THE ABYSS
            </span>
            <h1 className="text-display-xl md:text-display-xl lg:text-[clamp(3.5rem,8vw,6rem)] font-black tracking-tight text-ghost-white mb-6">
              <span className="text-gradient-cyan">BECOME</span> <span className="text-gradient-violet">AN INSIDER</span>
            </h1>
            <p className="text-body-lg text-ghost-muted max-w-2xl mx-auto">
              Get early access to videos, exclusive community updates, and important announcements.
              No spam. Unsubscribe anytime.
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {step === "email" && (
              <motion.div
                key="email"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card variant="glass" padding="xl">
                  <form onSubmit={handleSubmit(onEmailSubmit)} className="space-y-6">
                    <Input
                      label="EMAIL ADDRESS"
                      type="email"
                      placeholder="you@example.com"
                      error={errors.email?.message}
                      {...register("email")}
                      autoComplete="email"
                    />

                    <Button
                      type="submit"
                      size="xl"
                      variant="primary"
                      className="w-full"
                      loading={submitting || authLoading}
                      onMouseEnter={() => playUIHover()}
                      onClick={() => playUIClick()}
                    >
                      <span>CONTINUE</span>
                    </Button>

                    <p className="text-caption text-ghost-muted/50 text-center">
                      By continuing, you agree to our <a href="/privacy" className="text-neon-cyan hover:text-neon-violet underline">Privacy Policy</a> and <a href="/terms" className="text-neon-cyan hover:text-neon-violet underline">Terms of Service</a>.
                    </p>
                  </form>
                </Card>
              </motion.div>
            )}

            {step === "preferences" && (
              <motion.div
                key="preferences"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card variant="glass" padding="xl">
                  <div className="text-center mb-8">
                    <p className="text-body-base text-ghost-muted">We&rsquo;ll send updates to <span className="text-neon-cyan font-medium">{watchedEmail || email}</span></p>
                    <p className="text-body-sm text-ghost-muted mt-1">Choose what you want to hear about:</p>
                  </div>

                  <form onSubmit={handleSubmit(onPreferencesSubmit)} className="space-y-6">
                    <div className="space-y-4">
                      {[
                        { key: "videos", label: "NEW VIDEO ALERTS", description: "Instant notification when a new video drops", icon: "play" },
                        { key: "community", label: "COMMUNITY UPDATES", description: "Events, announcements, and community highlights", icon: "users" },
                        { key: "announcements", label: "IMPORTANT ANNOUNCEMENTS", description: "Major milestones, merch drops, and special news", icon: "megaphone" },
                      ].map((pref) => (
                        <label key={pref.key} className="flex items-center justify-between p-4 glass rounded-xl border-glass-border/50 cursor-pointer hover:border-neon-cyan/30 hover:bg-glass-hover transition-all">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-neon-cyan/10 flex items-center justify-center">
                              {pref.icon === "play" && <svg className="w-5 h-5 text-neon-cyan" fill="currentColor" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3" /></svg>}
                              {pref.icon === "users" && <svg className="w-5 h-5 text-neon-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>}
                              {pref.icon === "megaphone" && <svg className="w-5 h-5 text-neon-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M3 11l18-5 18 5V17l-18 5-18-5V11z" /><path d="M15.54 8H21a2 2 0 0 1 2 2v15a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-5" /></svg>}
                            </div>
                            <div>
                              <p className="font-display font-medium text-body-sm text-ghost-white">{pref.label}</p>
                              <p className="text-caption text-ghost-muted">{pref.description}</p>
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            {...register(`notifications.${pref.key}`)}
                            className="w-5 h-5 rounded border-glass-border bg-abyss-elevated text-neon-cyan focus:ring-neon-cyan accent-neon-cyan cursor-pointer"
                          />
                        </label>
                      ))}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={handleBack}
                        className="flex-1"
                      >
                        BACK
                      </Button>
                      <Button
                        type="submit"
                        size="xl"
                        variant="primary"
                        className="flex-1"
                        loading={submitting}
                        onMouseEnter={() => playUIHover()}
                        onClick={() => playUIClick()}
                      >
                        <span>SUBSCRIBE</span>
                      </Button>
                    </div>

                    <p className="text-caption text-ghost-muted/50 text-center">
                      We respect your inbox. <a href="/privacy" className="text-neon-cyan hover:text-neon-violet underline">Privacy Policy</a> • Unsubscribe anytime in email footer.
                    </p>
                  </form>
                </Card>
              </motion.div>
            )}

            {step === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center"
              >
                <Card variant="glass" padding="xl">
                  <div className="w-24 h-24 rounded-full bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center mx-auto mb-8">
                    <svg className="w-12 h-12 text-neon-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><polyline points="20 6 9 17 4 12" /></svg>
                  </div>
                  <h3 className="font-display font-semibold text-display-md text-ghost-white mb-3">YOU&rsquo;RE IN!</h3>
                  <p className="text-body-lg text-ghost-muted mb-8 max-w-md mx-auto">
                    Welcome to the inner circle. Check your email for a confirmation link.
                    You&rsquo;ll now receive notifications based on your preferences.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button variant="primary" onClick={() => { setStep("email"); reset(); playUIClick(); }}>
                      <span>DONE</span>
                    </Button>
                    <Button variant="ghost" onClick={() => playUIClick()}>
                      <span>WATCH VIDEOS</span>
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}