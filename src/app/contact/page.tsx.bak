"use client";

import React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useSound } from "@/lib/sound";
import { Navigation } from "@/components/layout/Navigation";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { toast } from "sonner";
import { Card } from "@/components/ui/Card";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(20, "Message must be at least 20 characters"),
  honeypot: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const { playUIHover, playUIClick, playUISuccess, playUIError } = useSound();
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: { honeypot: "" },
  });

  const onSubmit = async (data: ContactFormData) => {
    if (data.honeypot) return;

    setSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to submit");

      playUISuccess();
      setSubmitStatus("success");
      reset();
      toast.success("Message sent!", { description: "We'll get back to you within 24 hours." });
    } catch {
      playUIError();
      setSubmitStatus("error");
      toast.error("Failed to send", { description: "Please try again later." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-abyss-black">
      <Navigation />

      <section className="relative pt-32 pb-20 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <span className="inline-block px-4 py-1.5 rounded-full glass border-glass-border/50 text-caption text-neon-cyan tracking-widest mb-6">
              GET IN TOUCH
            </span>
            <h1 className="text-display-xl md:text-display-xl lg:text-[clamp(3.5rem,8vw,6rem)] font-black tracking-tight text-ghost-white mb-6">
              <span className="text-gradient-cyan">CONTACT</span> <span className="text-gradient-violet">US</span>
            </h1>
            <p className="text-body-lg text-ghost-muted">
              Have a business inquiry? Want to collaborate? Found a bug?
              We read every message.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-1"
            >
              <Card variant="glass" padding="xl" className="h-full">
                <h2 className="font-display font-semibold text-display-sm text-ghost-white mb-6">CONTACT INFO</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-neon-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                    </div>
                    <div>
                      <h3 className="font-display font-medium text-body-base text-ghost-white">EMAIL</h3>
                      <p className="text-body-base text-ghost-muted mt-1">contact@tmtofficial.com</p>
                      <p className="text-body-sm text-ghost-muted">Business inquiries & partnerships</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-neon-violet/10 border border-neon-violet/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-neon-violet" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                    </div>
                    <div>
                      <h3 className="font-display font-medium text-body-base text-ghost-white">DISCORD</h3>
                      <p className="text-body-base text-ghost-muted mt-1">discord.gg/tmt</p>
                      <p className="text-body-sm text-ghost-muted">Community support & chat</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-neon-gold/10 border border-neon-gold/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-neon-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
                    </div>
                    <div>
                      <h3 className="font-display font-medium text-body-base text-ghost-white">SOCIAL</h3>
                      <p className="text-body-base text-ghost-muted mt-1">@TMT_OFFICIAL-y2x</p>
                      <p className="text-body-sm text-ghost-muted">Twitter, Instagram, TikTok</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-glass-border">
                  <h3 className="font-display font-medium text-body-base text-ghost-white mb-4">RESPONSE TIME</h3>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-4 glass rounded-xl">
                      <p className="font-display font-bold text-display-sm text-neon-cyan"><24h</p>
                      <p className="text-caption text-ghost-muted">Business Inquiries</p>
                    </div>
                    <div className="p-4 glass rounded-xl">
                      <p className="font-display font-bold text-display-sm text-neon-violet"><48h</p>
                      <p className="text-caption text-ghost-muted">General Contact</p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-2"
            >
              <Card variant="glass" padding="xl">
                <h2 className="font-display font-semibold text-display-sm text-ghost-white mb-8">SEND A MESSAGE</h2>

                <AnimatePresence mode="wait">
                  {submitStatus === "success" ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="text-center py-16"
                    >
                      <div className="w-20 h-20 rounded-full bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-neon-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><polyline points="20 6 9 17 4 12" /></svg>
                      </div>
                      <h3 className="font-display font-semibold text-display-sm text-ghost-white mb-2">Message Sent!</h3>
                      <p className="text-body-base text-ghost-muted mb-6">Thanks for reaching out. We&rsquo;ll get back to you soon.</p>
                      <Button variant="secondary" onClick={() => { setSubmitStatus("idle"); playUIClick(); }}>
                        SEND ANOTHER
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      onSubmit={handleSubmit(onSubmit)}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                          label="YOUR NAME"
                          placeholder="John Doe"
                          error={errors.name?.message}
                          {...register("name")}
                        />
                        <Input
                          label="EMAIL ADDRESS"
                          type="email"
                          placeholder="john@example.com"
                          error={errors.email?.message}
                          {...register("email")}
                        />
                      </div>

                      <Input
                        label="SUBJECT"
                        placeholder="Business Inquiry / Collaboration / Bug Report / Other"
                        error={errors.subject?.message}
                        {...register("subject")}
                      />

                      <Textarea
                        label="MESSAGE"
                        placeholder="Tell us what's on your mind..."
                        rows={6}
                        error={errors.message?.message}
                        {...register("message")}
                      />

                      <input type="hidden" {...register("honeypot")} tabIndex={-1} autoComplete="off" />

                      <Button
                        type="submit"
                        size="xl"
                        variant="primary"
                        className="w-full sm:w-auto"
                        loading={submitting}
                        onMouseEnter={() => playUIHover()}
                        onClick={() => playUIClick()}
                      >
                        <span>SEND MESSAGE</span>
                      </Button>

                      <p className="text-caption text-ghost-muted/50 text-center">
                        By submitting, you agree to our <a href="/privacy" className="text-neon-cyan hover:text-neon-violet underline">Privacy Policy</a>.
                        We never share your data. No spam. Ever.
                      </p>
                    </motion.form>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
        }
