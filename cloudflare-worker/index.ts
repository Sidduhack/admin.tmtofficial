export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
}

export interface Env {
  EMAIL_API_TOKEN: string;
  EMAIL_FROM: string;
  EMAIL_FROM_NAME: string;
  SENDGRID_API_KEY?: string;
  RESEND_API_KEY?: string;
}

async function sendViaSendGrid(payload: EmailPayload, apiKey: string): Promise<Response> {
  const sgPayload = {
    personalizations: [{ to: [{ email: payload.to }], subject: payload.subject }],
    from: { email: payload.from || "noreply@tmtofficial.com", name: "TMT OFFICIAL" },
    content: [
      { type: "text/html", value: payload.html },
      { type: "text/plain", value: payload.text || payload.html.replace(/<[^>]*>/g, "") },
    ],
  };

  return fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(sgPayload),
  });
}

async function sendViaResend(payload: EmailPayload, apiKey: string): Promise<Response> {
  const resendPayload = {
    from: payload.from || "TMT OFFICIAL <noreply@tmtofficial.com>",
    to: [payload.to],
    subject: payload.subject,
    html: payload.html,
    text: payload.text,
    reply_to: payload.replyTo,
  };

  return fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(resendPayload),
  });
}

async function sendViaMailgun(payload: EmailPayload, domain: string, apiKey: string): Promise<Response> {
  const formData = new FormData();
  formData.append("from", payload.from || `TMT OFFICIAL <noreply@${domain}>`);
  formData.append("to", payload.to);
  formData.append("subject", payload.subject);
  formData.append("html", payload.html);
  if (payload.text) formData.append("text", payload.text);
  if (payload.replyTo) formData.append("h:Reply-To", payload.replyTo);

  return fetch(`https://api.mailgun.net/v3/${domain}/messages`, {
    method: "POST",
    headers: { Authorization: `Basic ${btoa(`api:${apiKey}`)}` },
    body: formData,
  });
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    const authHeader = request.headers.get("Authorization");
    if (authHeader !== `Bearer ${env.EMAIL_API_TOKEN}`) {
      return new Response("Unauthorized", { status: 401 });
    }

    try {
      const payload: EmailPayload = await request.json();

      if (!payload.to || !payload.subject || !payload.html) {
        return new Response(JSON.stringify({ error: "Missing required fields: to, subject, html" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      const finalPayload: EmailPayload = {
        ...payload,
        from: payload.from || `${env.EMAIL_FROM_NAME} <${env.EMAIL_FROM}>`,
      };

      let response: Response;

      if (env.SENDGRID_API_KEY) {
        response = await sendViaSendGrid(finalPayload, env.SENDGRID_API_KEY);
      } else if (env.RESEND_API_KEY) {
        response = await sendViaResend(finalPayload, env.RESEND_API_KEY);
      } else {
        return new Response(JSON.stringify({ error: "No email provider configured" }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Email send failed:", errorText);
        return new Response(JSON.stringify({ error: "Failed to send email", details: errorText }), {
          status: 502,
          headers: { "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Email worker error:", error);
      return new Response(JSON.stringify({ error: "Internal server error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  },
};