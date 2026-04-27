# Stream Announcement Bot — Vercel Setup Guide

## What you'll need
- A free [Vercel](https://vercel.com) account
- A free [GitHub](https://github.com) account
- About 15 minutes

---

## Step 1 — Create your Discord Bot

1. Go to https://discord.com/developers/applications
2. Click **New Application** → give it a name (e.g. `Stream Bot`)
3. Go to the **Bot** tab on the left
4. Click **Reset Token** → copy and save that token (`DISCORD_TOKEN`)
5. Scroll down, enable **Server Members Intent** and **Message Content Intent**
6. Go to **OAuth2 → URL Generator**
   - Under *Scopes*, check: `bot`
   - Under *Bot Permissions*, check: `Send Messages`, `Embed Links`, `Mention Everyone`
7. Copy the generated URL → open in browser → pick your server → authorize

> ⚠️ Note: With Vercel's serverless approach, the bot doesn't need to be "online" in Discord's member list. It just fires REST calls when you press a button. That's totally fine for announcements.

---

## Step 2 — Set up your Discord Server

1. Enable Developer Mode: **User Settings → Advanced → Developer Mode**
2. Create a role called **Streamer Updates** (or whatever you like)
3. Right-click the role → **Copy Role ID** → save it (`DISCORD_ROLE_ID`)
4. Create or pick a channel for announcements (e.g. `#stream-updates`)
5. Right-click the channel → **Copy Channel ID** → save it (`DISCORD_CHANNEL_ID`)
6. Make sure the bot has **Send Messages** and **Embed Links** permission in that channel

---

## Step 3 — Push to GitHub

```bash
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/YOURUSERNAME/stream-bot.git
git push -u origin main
```

---

## Step 4 — Deploy to Vercel

1. Go to https://vercel.com → **Add New Project**
2. Import your GitHub repo
3. Leave all build settings as default (Vercel auto-detects it)
4. Click **Deploy**

---

## Step 5 — Add Environment Variables

1. In your Vercel project, go to **Settings → Environment Variables**
2. Add these one by one:

| Name | Value |
|------|-------|
| `DISCORD_TOKEN` | your bot token |
| `DISCORD_CHANNEL_ID` | your channel ID |
| `DISCORD_ROLE_ID` | your role ID |
| `CONTROL_PIN` | a 4-digit PIN you choose |

3. Go to **Deployments** → click the three dots on your latest deploy → **Redeploy**
   (so the new env vars take effect)

---

## Step 6 — Use it!

1. Open your Vercel URL (e.g. `https://stream-bot-abc123.vercel.app`)
2. Enter your PIN
3. Press a button — your Discord channel gets pinged instantly ✅

---

## Running locally (optional)

```bash
npm install -g vercel
cp .env.example .env
# fill in your values
vercel dev
```

Then open http://localhost:3000
