
const canvas = document.getElementById('background');
const ctx = canvas.getContext('2d');

let width, height;
function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

const sunRadius = 60;
const horizonYRatio = 0.75;

const sunColor = '#fff6cc';
const sunGlowColor = 'rgba(255, 246, 204, 0.8)';

let startTime = null;
const dayDuration = 10000;

function drawSun(y) {
  const gradient = ctx.createRadialGradient(width/2, y, sunRadius/2, width/2, y, sunRadius*2);
  gradient.addColorStop(0, sunGlowColor);
  gradient.addColorStop(1, 'rgba(255, 246, 204, 0)');
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(width/2, y, sunRadius*2, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(width/2, y, sunRadius, 0, Math.PI * 2);
  ctx.fillStyle = sunColor;
  ctx.shadowColor = sunColor;
  ctx.shadowBlur = 30;
  ctx.fill();
  ctx.shadowBlur = 0;
}

function drawSky(y) {
  const horizonY = height * horizonYRatio;
  const progress = 1 - Math.abs((y - horizonY) / (horizonY));

  const grad = ctx.createLinearGradient(0, 0, 0, height);
  const topColor = `rgba(0,0,68,${progress * 0.9 + 0.1})`;
  const bottomColor = `rgba(0,0,20,${progress * 0.9 + 0.1})`;
  grad.addColorStop(0, topColor);
  grad.addColorStop(1, bottomColor);

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);
}

function animate(time = 0) {
  if (!startTime) startTime = time;
  const elapsed = (time - startTime) % dayDuration;
  const t = elapsed / dayDuration;
  const horizonY = height * horizonYRatio;
  const sunY = horizonY - Math.sin(t * Math.PI) * horizonY * 0.6;

  drawSky(sunY);
  drawSun(sunY);

  requestAnimationFrame(animate);
}
animate();

const form = document.getElementById('emailForm');
const thankYou = document.getElementById('thankyou');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(form);

  try {
    const response = await fetch(form.action, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    });
    if (response.ok) {
      form.style.display = 'none';
      thankYou.style.display = 'block';
    } else {
      alert('Oops! There was a problem submitting your form');
    }
  } catch (error) {
    alert('Oops! There was a problem submitting your form');
  }
});
