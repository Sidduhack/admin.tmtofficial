import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { z } from "zod";
import crypto from "crypto";

const subscribeSchema = z.object({
  email: z.string().email(),
  notifications: z.object({
    videos: z.boolean().default(true),
    community: z.boolean().default(true),
    announcements: z.boolean().default(false),
  }).default({ videos: true, community: true, announcements: false }),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = subscribeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
    }

    const supabase = supabaseAdmin();

    const token = crypto.randomBytes(32).toString("hex");

    const { data: existing } = await supabase
      .from("notification_subscriptions")
      .select("id, confirmed")
      .eq("email", parsed.data.email)
      .single();

    if (existing) {
      const { error } = await supabase
        .from("notification_subscriptions")
        .update({
          video_alerts: parsed.data.notifications.videos,
          community_alerts: parsed.data.notifications.community,
          announcement_alerts: parsed.data.notifications.announcements,
          token,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id);

      if (error) {
        console.error("Subscription update error:", error);
        return NextResponse.json({ error: "Failed to update subscription" }, { status: 500 });
      }

      if (!existing.confirmed) {
        await sendConfirmationEmail(parsed.data.email, token);
      }

      return NextResponse.json({ success: true, message: "Subscription updated" });
    }

    const { error } = await supabase.from("notification_subscriptions").insert({
      email: parsed.data.email,
      video_alerts: parsed.data.notifications.videos,
      community_alerts: parsed.data.notifications.community,
      announcement_alerts: parsed.data.notifications.announcements,
      confirmed: false,
      token,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Subscription insert error:", error);
      return NextResponse.json({ error: "Failed to create subscription" }, { status: 500 });
    }

    await sendConfirmationEmail(parsed.data.email, token);

    return NextResponse.json({ success: true, message: "Subscription created. Please confirm your email." });
  } catch (error) {
    console.error("Subscribe API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

async function sendConfirmationEmail(email: string, token: string) {
  const confirmUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/subscribe/confirm?token=${token}`;

  try {
    await fetch(`${process.env.CLOUDFLARE_EMAIL_WORKER_URL}/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.CLOUDFLARE_EMAIL_API_TOKEN}` },
      body: JSON.stringify({
        to: email,
        subject: "Confirm your TMT OFFICIAL subscription",
        html: `
          <div style="font-family: 'IBM Plex Sans', sans-serif; background: #030307; color: #F0F0F5; padding: 40px 20px;">
            <div style="max-width: 600px; margin: 0 auto; text-align: center;">
              <h1 style="font-family: 'Space Grotesk', sans-serif; color: #00FFFF; font-size: 2rem; margin-bottom: 1rem;">TMT OFFICIAL</h1>
              <h2 style="color: #F0F0F5; font-size: 1.5rem; margin-bottom: 1.5rem;">Confirm Your Subscription</h2>
              <p style="color: #6B6B7A; line-height: 1.6; margin-bottom: 2rem;">Thanks for joining the abyss! Click below to confirm your email and start receiving notifications.</p>
              <a href="${confirmUrl}" style="display: inline-block; background: linear-gradient(135deg, #00FFFF, #BC13FE); color: #030307; padding: 16px 32px; border-radius: 12px; font-weight: 700; text-decoration: none; font-family: 'Space Grotesk', sans-serif;">CONFIRM EMAIL</a>
              <p style="color: #6B6B7A; font-size: 0.875rem; margin-top: 2rem;">If you didn't request this, please ignore this email.</p>
            </div>
          </div>
        `,
      }),
    });
  } catch (error) {
    console.error("Failed to send confirmation email:", error);
  }
}