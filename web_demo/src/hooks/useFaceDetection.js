/**
 * useFaceDetection — Encapsulates face-api.js model loading, webcam capture,
 * real-time emotion detection with frame-smoothing, and an emotion history log.
 */
import { useEffect, useRef, useState, useCallback } from 'react';
import * as faceapi from 'face-api.js';

const LOCAL_MODEL_PATH = '/models';
const REMOTE_MODEL_PATH = atob(
  'aHR0cHM6Ly9qdXN0YWR1ZGV3aG9oYWNrcy5naXRodWIuaW8vZmFjZS1hcGkuanMvbW9kZWxz'
);
const EMOTION_KEYS = ['happy', 'neutral', 'sad', 'angry'];
const detectorOptions = new faceapi.TinyFaceDetectorOptions({
  inputSize: 320,
  scoreThreshold: 0.5,
});

/* ── helpers ─────────────────────────────────── */

function ensureSecureContext() {
  const isSecure = window.location.protocol === 'https:';
  const isLocalhost = ['localhost', '127.0.0.1', '::1'].includes(
    window.location.hostname
  );
  if (!isSecure && !isLocalhost) {
    throw new Error('Camera requires https or localhost.');
  }
}

function pickTopEmotion(expressions = {}) {
  let best = { label: 'No face', score: 0 };
  for (const key of EMOTION_KEYS) {
    const score = expressions[key] ?? 0;
    if (score > best.score) best = { label: key, score };
  }
  return best.label;
}

function averageExpressions(buffer = []) {
  if (!buffer.length) return null;
  const totals = {};
  for (const key of EMOTION_KEYS) totals[key] = 0;
  for (const expr of buffer) {
    for (const key of EMOTION_KEYS) totals[key] += expr[key] ?? 0;
  }
  const count = buffer.length;
  for (const key of EMOTION_KEYS) totals[key] /= count;
  return totals;
}

function stopStream(videoEl) {
  if (!videoEl || !videoEl.srcObject) return;
  videoEl.srcObject.getTracks().forEach((t) => t.stop());
  videoEl.srcObject = null;
}

/* ── hook ────────────────────────────────────── */

export function useFaceDetection() {
  const videoRef = useRef(null);
  const loopRef = useRef(null);
  const exprBufferRef = useRef([]);
  const prevEmotionRef = useRef('');

  const [status, setStatus] = useState('Initializing…');
  const [emotion, setEmotion] = useState('—');
  const [error, setError] = useState('');
  const [logs, setLogs] = useState([]);

  const pushEmotionLog = useCallback((label) => {
    if (!label || label === '—') return;
    setLogs((prev) => [
      ...prev.slice(-14),
      { id: Date.now() + Math.random(), label, time: new Date().toLocaleTimeString() },
    ]);
  }, []);

  /* Main lifecycle — load models → start cam → run detection loop */
  useEffect(() => {
    let canceled = false;

    const detectLoop = async () => {
      if (canceled || !videoRef.current || videoRef.current.paused || videoRef.current.ended) return;
      try {
        const detection = await faceapi
          .detectSingleFace(videoRef.current, detectorOptions)
          .withFaceExpressions();

        if (!detection || !detection.expressions) {
          setEmotion('sad');
          exprBufferRef.current = [];
        } else {
          const expr = EMOTION_KEYS.reduce((acc, key) => {
            acc[key] = detection.expressions[key] ?? 0;
            return acc;
          }, {});
          exprBufferRef.current.push(expr);
          if (exprBufferRef.current.length > 16) exprBufferRef.current.shift();

          const useAvg = exprBufferRef.current.length >= 8;
          const averaged = useAvg ? averageExpressions(exprBufferRef.current) : expr;
          setEmotion(pickTopEmotion(averaged));
        }
      } catch (err) {
        console.error(err);
        setError(err.message || 'Detection error');
      }
      loopRef.current = setTimeout(detectLoop, 220);
    };

    const startCamera = async () => {
      try {
        ensureSecureContext();
        setStatus('Requesting camera…');
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 960, height: 720, facingMode: 'user' },
        });
        if (canceled) {
          stopStream({ srcObject: stream });
          return;
        }
        videoRef.current.srcObject = stream;
        await new Promise((resolve) => {
          if (videoRef.current.readyState >= 1) return resolve();
          videoRef.current.onloadedmetadata = () => resolve();
        });
        await videoRef.current.play();
        setStatus('Active');
        detectLoop();
      } catch (err) {
        setError('Webcam blocked or unavailable: ' + err.message);
        setStatus('Error');
      }
    };

    const loadModels = async () => {
      try {
        setStatus('Loading AI models…');
        await faceapi.nets.tinyFaceDetector.loadFromUri(LOCAL_MODEL_PATH);
        await faceapi.nets.faceExpressionNet.loadFromUri(LOCAL_MODEL_PATH);
        setStatus('Models ready');
      } catch {
        setStatus('Fetching models from CDN…');
        await faceapi.nets.tinyFaceDetector.loadFromUri(REMOTE_MODEL_PATH);
        await faceapi.nets.faceExpressionNet.loadFromUri(REMOTE_MODEL_PATH);
        setStatus('Models ready');
      }
    };

    (async () => {
      try {
        await loadModels();
        if (canceled) return;
        await startCamera();
      } catch (err) {
        setError(err.message || 'Failed to initialize');
        setStatus('Error');
      }
    })();

    return () => {
      canceled = true;
      clearTimeout(loopRef.current);
      stopStream(videoRef.current);
    };
  }, []);

  /* Push to history whenever emotion changes */
  useEffect(() => {
    if (emotion && emotion !== prevEmotionRef.current) {
      prevEmotionRef.current = emotion;
      pushEmotionLog(emotion);
    }
  }, [emotion, pushEmotionLog]);

  return { videoRef, status, emotion, error, logs };
}
