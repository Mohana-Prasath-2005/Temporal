Emotion-only face-api.js demo — now as a React + Vite app.

What you get
- React UI with webcam preview and a single dominant emotion label (happy, surprised, neutral, sad, angry).
- Uses `face-api.js` tiny face detector + expression net. Tries local weights first, then falls back to CDN.
- Vite dev server for fast reloads plus production build.

Prereqs
- Node.js 18+ recommended.

Install & run (dev)
```bash
cd web_demo
npm install
npm run dev
# open the printed localhost URL and allow camera access
```

Build for production
```bash
npm run build
npm run preview  # serves the dist build locally
```

Model weights
- Put weights in `web_demo/public/models` to load locally (e.g., `tiny_face_detector_model-*`, `face_expression_model-*`).
- If that folder is empty, the app automatically downloads the same models from jsDelivr CDN.

Notes
- Browsers block camera on file://; always run via `npm run dev` or any HTTP server.
- Good lighting and a single face in frame improve accuracy.
