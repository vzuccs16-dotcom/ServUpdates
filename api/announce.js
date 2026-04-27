export default async function handler(req, res) {
  // CORS for same-origin
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-pin");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  // Auth
  const pin = req.headers["x-pin"];
  if (pin !== process.env.CONTROL_PIN) {
    return res.status(401).json({ error: "Invalid PIN" });
  }

  const { type, customMessage } = req.body;

  const roleId = process.env.DISCORD_ROLE_ID;
  const roleMention = roleId ? `<@&${roleId}>` : "";

  const configs = {
    live: {
      color: 0x00e676,
      title: "🟢  Stream Starting Soon!",
      description: `${roleMention}\nI'm going live soon — get ready! https://www.youtube.com/@MrZ-16, https://www.twitch.tv/mrzuchini11`,
      footer: "See you in chat 👋",
    },
    delayed: {
      color: 0xffb300,
      title: "⏳  Stream Delayed",
      description: `${roleMention}\nThe stream is running a little late. Hang tight! https://www.youtube.com/@MrZ-16, https://www.twitch.tv/mrzuchini11`,
      footer: "Thanks for your patience",
    },
    cancelled: {
      color: 0xef5350,
      title: "❌  Stream Cancelled",
      description: `${roleMention}\nNo stream today. Sorry about that!`,
      footer: "See you next time",
    },
    custom: {
      color: 0x7c4dff,
      title: "📢  Stream Update",
      description: `${roleMention}\n${customMessage || "No message provided."}`,
      footer: "Stay tuned",
    },
    _ping: null, // used by frontend to validate PIN only
  };

  if (!(type in configs)) {
    return res.status(400).json({ error: "Unknown announcement type" });
  }

  // PIN check passed — return early for ping
  if (type === "_ping") return res.status(200).json({ ok: true });

  const cfg = configs[type];

  try {
    const response = await fetch(
      `https://discord.com/api/v10/channels/${process.env.DISCORD_CHANNEL_ID}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          embeds: [
            {
              color: cfg.color,
              title: cfg.title,
              description: cfg.description,
              footer: { text: cfg.footer },
              timestamp: new Date().toISOString(),
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const err = await response.json();
      console.error("Discord API error:", err);
      return res.status(500).json({ error: "Discord API error", detail: err });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Fetch error:", err);
    return res.status(500).json({ error: "Failed to send message" });
  }
}
