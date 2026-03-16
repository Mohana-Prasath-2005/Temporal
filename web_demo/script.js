const video = document.getElementById('video');
const emotionEl = document.getElementById('emotion');
const statusEl = document.getElementById('status');

async function loadModels() {
  const localPath = './models';
  const remotePath = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights';
  try {
    statusEl.textContent = 'Loading models from ' + localPath + ' ...';
    await faceapi.nets.tinyFaceDetector.loadFromUri(localPath);
    await faceapi.nets.faceExpressionNet.loadFromUri(localPath);
    return;
  } catch (e) {
    console.warn('Local model load failed, trying remote:', e);
  }

  // fallback to remote weights on GitHub
  try {
    statusEl.textContent = 'Local models not found — loading from remote...';
    await faceapi.nets.tinyFaceDetector.loadFromUri(remotePath);
    await faceapi.nets.faceExpressionNet.loadFromUri(remotePath);
    return;
  } catch (e) {
    throw new Error('Failed to load models from both local and remote: ' + e.message);
  }
}

async function startVideo() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
  } catch (err) {
    statusEl.textContent = 'Error opening webcam: ' + err.message;
  }
}

function pickTopOfFive(expressions) {
  // Only consider these five labels and return the highest scoring one
  const keys = ['happy','sad','surprised','neutral','angry'];
  let best = { label: 'No face', score: 0 };
  for (const k of keys) {
    const val = expressions[k] || 0;
    if (val > best.score) { best = { label: k, score: val }; }
  }
  return best.label;
}

video.addEventListener('playing', () => {
  statusEl.textContent = 'Detecting...';
  const options = new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 });

  const loop = async () => {
    if (video.paused || video.ended) return;
    const detection = await faceapi.detectSingleFace(video, options).withFaceExpressions();
    if (!detection || !detection.expressions) {
      emotionEl.textContent = 'No face';
    } else {
      const label = pickTopOfFive(detection.expressions);
      // map 'surprised' to 'surprised' spelled as user requested 'surprise' vs 'surprised'
      const display = label === 'surprised' ? 'surprised' : label;
      emotionEl.textContent = display;
    }
    setTimeout(loop, 200);
  };
  loop();
});

(async () => {
  try {
    await loadModels();
    statusEl.textContent = 'Models loaded — opening webcam';
    await startVideo();
  } catch (e) {
    statusEl.textContent = 'Failed to load models: ' + e.message;
  }
})();
