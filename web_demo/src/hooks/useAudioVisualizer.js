/**
 * useAudioVisualizer — Captures microphone audio and drives a canvas
 * frequency-bar visualizer with gradient colors and rounded bars.
 */
import { useEffect, useRef, useState, useCallback } from 'react';

function ensureSecureContext() {
  const isSecure = window.location.protocol === 'https:';
  const isLocalhost = ['localhost', '127.0.0.1', '::1'].includes(
    window.location.hostname
  );
  if (!isSecure && !isLocalhost) {
    throw new Error('Microphone requires https or localhost.');
  }
}

export function useAudioVisualizer() {
  const canvasRef = useRef(null);
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const rafRef = useRef(null);
  const micStreamRef = useRef(null);

  const [listening, setListening] = useState(false);
  const [voiceError, setVoiceError] = useState('');

  /* Stop everything cleanly */
  const stopMic = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((t) => t.stop());
      micStreamRef.current = null;
    }
    setListening(false);
  }, []);

  /* Start mic capture + wire up analyser */
  const startMic = useCallback(async () => {
    try {
      ensureSecureContext();
      setVoiceError('');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;

      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 1024;
      analyser.smoothingTimeConstant = 0.75;
      audioCtx.createMediaStreamSource(stream).connect(analyser);

      audioCtxRef.current = audioCtx;
      analyserRef.current = analyser;
      dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);

      setListening(true);
    } catch (err) {
      setVoiceError(err.message || 'Microphone start failed');
      setListening(false);
      stopMic();
    }
  }, [stopMic]);

  /* Canvas draw loop — runs while listening */
  useEffect(() => {
    if (!listening) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !analyserRef.current || !dataArrayRef.current) return;

    const draw = () => {
      if (!analyserRef.current || !dataArrayRef.current) return;
      analyserRef.current.getByteFrequencyData(dataArrayRef.current);
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      const bufferLength = analyserRef.current.frequencyBinCount;
      const barWidth = (width / bufferLength) * 2.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArrayRef.current[i] / 255;
        const barHeight = v * height;

        /* Per-bar gradient: violet → blue → cyan → emerald */
        const grad = ctx.createLinearGradient(0, height, 0, height - barHeight);
        grad.addColorStop(0, 'rgba(124, 58, 237, 0.85)');
        grad.addColorStop(0.4, 'rgba(59, 130, 246, 0.65)');
        grad.addColorStop(0.7, 'rgba(6, 182, 212, 0.55)');
        grad.addColorStop(1, 'rgba(16, 185, 129, 0.35)');
        ctx.fillStyle = grad;

        /* Rounded-top bar */
        const r = Math.min(barWidth / 2, 3);
        const bx = x;
        const by = height - barHeight;
        ctx.beginPath();
        ctx.moveTo(bx + r, by);
        ctx.lineTo(bx + barWidth - r, by);
        ctx.quadraticCurveTo(bx + barWidth, by, bx + barWidth, by + r);
        ctx.lineTo(bx + barWidth, height);
        ctx.lineTo(bx, height);
        ctx.lineTo(bx, by + r);
        ctx.quadraticCurveTo(bx, by, bx + r, by);
        ctx.fill();

        x += barWidth + 1;
      }
      rafRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [listening]);

  /* Auto-start on mount */
  useEffect(() => {
    startMic();
    return () => stopMic();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { canvasRef, listening, voiceError, startMic, stopMic };
}
