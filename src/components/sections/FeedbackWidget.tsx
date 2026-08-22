"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useSound } from "@/lib/sound";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { trackFeedbackSubmit } from "@/lib/analytics";
import { toast } from "sonner";

const feedbackSchema = z.object({
  rating: z.number().min(1, "Please select a rating").max(5),
  category: z.enum(["website", "videos", "projects", "bug", "suggestion", "other"]),
  message: z.string().min(20, "Message must be at least 20 characters").max(3000),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
});

type FeedbackFormData = z.infer<typeof feedbackSchema>;

interface FeedbackWidgetProps {
  trigger?: "button" | "auto";
  pageUrl?: string;
}

export function FeedbackWidget({ trigger = "button", pageUrl }: FeedbackWidgetProps) {
  const { playUIHover, playUIClick, playUISuccess, playUIError } = useSound();
  const [open, setOpen] = useState(trigger === "auto");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: { rating: 0, category: "website", message: "", email: "" },
  });

  const rating = watch("rating");

  const onSubmit = async (data: FeedbackFormData) => {
    setSubmitting(true);
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, page_url: pageUrl || window.location.pathname }),
      });

      if (!response.ok) throw new Error("Failed to submit");

      playUISuccess();
      setSubmitted(true);
      trackFeedbackSubmit(data.rating, data.category);
      toast.success("Feedback sent!", { description: "Thank you for helping us improve." });
    } catch {
      playUIError();
      toast.error("Failed to send", { description: "Please try again later." });
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    playUIClick();
    if (submitted) {
      setOpen(false);
      setSubmitted(false);
      reset();
    } else {
      setOpen(false);
    }
  };

  if (trigger === "button" && !open) {
    return (
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => { playUIClick(); setOpen(true); }}
        className="fixed bottom-6 right-6 z-[layer-2] p-4 rounded-2xl glass border-glass-border/50 shadow-depth-2 hover:border-neon-cyan/50 hover:shadow-glow-cyan transition-all"
        aria-label="Open feedback"
      >
        <svg className="w-6 h-6 text-neon-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </motion.button>
    );
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[layer-5] flex items-center justify-center p-4 bg-abyss-black/90 backdrop-blur-lg"
          onClick={handleClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="feedback-title"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md"
          >
            <Card variant="glass-strong" padding="xl">
              <div className="flex items-start justify-between mb-8">
                <div>
                  <h2 id="feedback-title" className="font-display font-bold text-display-sm text-ghost-white">
                    {submitted ? "THANK YOU!" : "HOW WAS YOUR EXPERIENCE?"}
                  </h2>
                  <p className="text-body-sm text-ghost-muted mt-1">
                    {submitted ? "Your feedback helps us make the abyss better." : "Tell us what you think. We read every message."}
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 rounded-lg glass hover:bg-glass-hover hover:border-neon-cyan/50 transition-all"
                  aria-label="Close feedback"
                >
                  <svg className="w-5 h-5 text-ghost-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="text-center py-8"
                  >
                    <div className="w-20 h-20 rounded-full bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center mx-auto mb-6">
                      <svg className="w-10 h-10 text-neon-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <h3 className="font-display font-semibold text-body-lg text-ghost-white mb-2">Feedback Received</h3>
                    <p className="text-body-sm text-ghost-muted">We appreciate you taking the time to share your thoughts.</p>
                    <Button variant="secondary" className="mt-6 w-full" onClick={handleClose}>
                      CLOSE
                    </Button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <fieldset className="space-y-4">
                      <legend className="label-text">YOUR RATING</legend>
                      <div className="flex items-center justify-center gap-2" role="radiogroup" aria-label="Rating">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            role="radio"
                            aria-checked={rating === star}
                            onClick={() => { playUIHover(); setValue("rating", star); }}
                            className={cn(
                              "p-2 rounded-lg transition-all",
                              rating >= star
                                ? "text-neon-gold"
                                : "text-ghost-muted/50 hover:text-neon-gold/50"
                            )}
                          >
                            <svg className="w-8 h-8" fill={rating >= star ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                          </button>
                        ))}
                      </div>
                      {errors.rating && <p className="text-sm text-red-400 text-center">{errors.rating.message}</p>}
                    </fieldset>

                    <div className="space-y-2">
                      <label className="label-text">CATEGORY</label>
                      <select
                        {...register("category")}
                        className="input-field appearance-none bg-abyss-elevated"
                      >
                        <option value="website">Website Experience</option>
                        <option value="videos">Video Content</option>
                        <option value="projects">Projects & Features</option>
                        <option value="bug">Bug Report</option>
                        <option value="suggestion">Suggestion</option>
                        <option value="other">Other</option>
                      </select>
                      {errors.category && <p className="text-sm text-red-400">{errors.category.message}</p>}
                    </div>

                    <Textarea
                      label="YOUR MESSAGE"
                      placeholder="What did you like? What could be better? Be specific..."
                      error={errors.message?.message}
                      {...register("message")}
                    />

                    <Input
                      label="EMAIL (OPTIONAL)"
                      type="email"
                      placeholder="you@example.com"
                      error={errors.email?.message}
                      {...register("email")}
                    />

                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={handleClose}
                        className="flex-1"
                      >
                        CANCEL
                      </Button>
                      <Button
                        type="submit"
                        size="lg"
                        variant="primary"
                        className="flex-1"
                        loading={submitting}
                        onMouseEnter={() => playUIHover()}
                        onClick={() => playUIClick()}
                      >
                        <span>SEND FEEDBACK</span>
                      </Button>
                    </div>

                    <p className="text-caption text-ghost-muted/50 text-center">
                      By submitting, you agree to our <a href="/privacy" className="text-neon-cyan hover:text-neon-violet underline">Privacy Policy</a>.
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}