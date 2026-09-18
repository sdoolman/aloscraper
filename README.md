# Alo Moves Stremio Addon

A high-performance [Stremio](https://www.stremio.com) Addon written in TypeScript for streaming [Alo Moves](https://wellnessclub.aloyoga.com) (Alo Wellness Club) programs, series, and workouts on-demand.

---

## Features

- **Dynamic Catalog & Search**: Browse featured series, filter by categories (*Yoga*, *Fitness*, *Mindfulness*, *Skills*), or search by series name and instructor (*Dylan Werner*, *Ashley Galvin*, *Alo in the Wild*, etc.).
- **Rich Graphics & Metadata**: Automatically resolves portrait series posters, 16:9 widescreen hero backdrops, and class thumbnails for every episode.
- **Direct BunnyCDN Streaming**: Passes the signed `.m3u8` master playlist and direct MP4 streams straight to Stremio's native media player (`ExoPlayer` on Android TV, `libmpv` on Desktop).
- **Zero Proxy Bandwidth**: Video chunks stream directly from Alo's BunnyCDN (`video-cdn.alomoves.com` with `Access-Control-Allow-Origin: *`). Your server only serves lightweight JSON metadata (< 10 KB per call).
- **Automated Health CI/CD**: Includes automated GitHub Actions workflow with a daily cron (`0 8 * * *`) that checks Alo's backend and notifies you if endpoints or stream formats change.

---

## Installation & Setup

### 1. Prerequisites
- Node.js 20+ installed
- A free **Alo Access** account on [wellnessclub.aloyoga.com](https://wellnessclub.aloyoga.com)

### 2. Clone & Install
```bash
git clone <your-private-repo-url> alomoves-stremio
cd alomoves-stremio
npm install
```

### 3. Configure Credentials
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Open `wellnessclub.aloyoga.com` in your browser, open Developer Tools (`F12`), go to **Application** -> **Cookies** -> `https://wellnessclub.aloyoga.com`, and copy the value of `remember_token`.

Paste it into `.env`:
```env
PORT=7000
ALO_REMEMBER_TOKEN=your_remember_token_here
```

---

## Running the Addon

### Development Mode (with hot-reload)
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

Once running, the addon manifest will be available at:
```
http://127.0.0.1:7000/manifest.json
```

---

## Installing in Stremio

1. Open Stremio on your PC, Mac, Android TV, or Mobile.
2. Go to the **Add-ons** page.
3. In the search bar at the top, paste your addon manifest URL:
   ```
   http://<YOUR_SERVER_IP>:7000/manifest.json
   ```
   *(Or on the same machine: `http://127.0.0.1:7000/manifest.json`)*
4. Click **Install**.
5. Go to **Discover** -> Select **Alo Moves** to browse and start streaming!

---

## Running Tests & CI/CD

Run the test suite locally:
```bash
npm test
```

### GitHub Actions Secrets
To enable the daily backend health check on GitHub Actions:
1. In your GitHub repository, go to **Settings** -> **Secrets and variables** -> **Actions**.
2. Add a new repository secret named `ALO_REMEMBER_TOKEN` with your `remember_token` value.
3. GitHub Actions will run the test suite on every commit and daily at 08:00 UTC.

---

## License
MIT License
