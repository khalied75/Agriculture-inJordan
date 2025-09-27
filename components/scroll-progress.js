const SITE_PAGES = [
  "/index.html",
  "/Plant diseases/index.html",
  "/Available or rare crops/index.html",
  "/Available or rare plants/index.html",
  "/Irrigation systems  in Jordan/index.html",
  "/types of agriculture used in Jordan/index.html",
  "/Vertical farming/index.html"
];

function getCurrentPage() {
  return location.pathname.replace(/\\/g, "/");
}

function updateVisitedPages() {
  let visited = JSON.parse(localStorage.getItem("visitedPages") || "[]");
  const current = getCurrentPage();
  if (!visited.includes(current)) {
    visited.push(current);
    localStorage.setItem("visitedPages", JSON.stringify(visited));
  }
  return visited;
}

function getProgressColor(percent) {
  if (percent < 50) {
    const green = 125 + Math.round((255 - 125) * (percent / 50));
    const red = 46 + Math.round((255 - 46) * (percent / 50));
    return `rgb(${red},${green},50)`;
  } else {
    const green = 255 - Math.round(255 * ((percent - 50) / 50));
    return `rgb(255,${green},50)`;
  }
}

function showCompletionPopup() {
  if (document.getElementById("site-popup")) return;

  const popup = document.createElement("div");
  popup.id = "site-popup";
  popup.innerHTML = `
    <div class="popup-content">
      <span class="popup-close" title="Close">&times;</span>
      <div class="emoji">🎉</div>
      <h2>Congratulations!</h2>
      <p>You’ve successfully visited all pages of the site!</p>
      <button class="popup-btn">Awesome 🎊</button>
      <canvas id="confetti"></canvas>
    </div>
  `;
  document.body.appendChild(popup);
  injectPopupStyles();

  // Confetti effect
  startConfetti();

  // Close logic
  popup.querySelector(".popup-close").onclick = () => removePopup();
  popup.querySelector(".popup-btn").onclick = () => removePopup();
  popup.onclick = e => { if (e.target === popup) removePopup(); };

  function removePopup() {
    stopConfetti();
    popup.remove();
  }
}

function injectPopupStyles() {
  if (document.getElementById("site-popup-style")) return;
  const style = document.createElement("style");
  style.id = "site-popup-style";
  style.textContent = `
    #site-popup {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      animation: fadeIn 0.4s ease;
    }

    .popup-content {
      position: relative;
      background: linear-gradient(145deg, #ffffff, #f9f9f9);
      border-radius: 16px;
      padding: 40px 32px 50px;
      box-shadow: 0 12px 40px rgba(0,0,0,0.25);
      text-align: center;
      color: #222;
      animation: popIn 0.4s ease;
      font-family: "Segoe UI", system-ui, sans-serif;
      overflow: hidden;
    }

    .popup-close {
      position: absolute;
      top: 10px;
      right: 16px;
      font-size: 1.6rem;
      color: #999;
      cursor: pointer;
      transition: transform 0.3s, color 0.2s;
    }

    .popup-close:hover {
      color: #d32f2f;
      transform: rotate(90deg);
    }

    .emoji {
      font-size: 2.5rem;
      margin-bottom: 10px;
      animation: bounce 1s infinite alternate;
    }

    .popup-content h2 {
      font-size: 1.8rem;
      margin: 10px 0;
      color: #2e7d32;
    }

    .popup-content p {
      font-size: 1rem;
      color: #555;
      margin-bottom: 24px;
    }

    .popup-btn {
      background: linear-gradient(135deg, #2e7d32, #4caf50);
      border: none;
      border-radius: 30px;
      color: #fff;
      padding: 12px 26px;
      cursor: pointer;
      font-weight: 600;
      transition: transform 0.3s, box-shadow 0.3s;
      box-shadow: 0 4px 12px rgba(46,125,50,0.3);
    }

    .popup-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 18px rgba(46,125,50,0.4);
    }

    #confetti {
      position: absolute;
      top: 0; left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
    }

    @keyframes fadeIn {
      from { opacity: 0; } to { opacity: 1; }
    }

    @keyframes popIn {
      from { transform: scale(0.8); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }

    @keyframes bounce {
      0% { transform: translateY(0); }
      100% { transform: translateY(-8px); }
    }
  `;
  document.head.appendChild(style);
}

// Confetti animation
function startConfetti() {
  const canvas = document.getElementById("confetti");
  const ctx = canvas.getContext("2d");
  let particles = [];
  let animationFrame;

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  window.addEventListener("resize", resize);
  resize();

  function createParticle() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      r: Math.random() * 6 + 2,
      color: `hsl(${Math.random() * 360}, 70%, 60%)`,
      speed: Math.random() * 2 + 1,
      drift: Math.random() * 1 - 0.5
    };
  }

  for (let i = 0; i < 80; i++) particles.push(createParticle());

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
      p.y += p.speed;
      p.x += p.drift;
      if (p.y > canvas.height) Object.assign(p, createParticle());
    }
    animationFrame = requestAnimationFrame(draw);
  }

  draw();

  window.stopConfetti = () => cancelAnimationFrame(animationFrame);
}
function updateSiteProgressBar() {
  const visited = updateVisitedPages();
  const percent = Math.round((visited.length / SITE_PAGES.length) * 100);
  let bar = document.getElementById("site-progress");
  if (!bar) {
    bar = document.createElement("div");
    bar.id = "site-progress";
    document.body.prepend(bar);
  }

  const completed = localStorage.getItem("siteCompleted") === "true";
  if (completed) {
    bar.style.display = "none";
    return;
  }

  bar.style.width = percent + "%";
  bar.title = `Site explored: ${percent}%`;
  bar.style.background = getProgressColor(percent);

  // إظهار الشريط بعد حساب النسبة مباشرة
  bar.classList.remove("visible");
  setTimeout(() => {
    bar.classList.add("visible");
  }, 50);

  if (percent === 100) {
    setTimeout(() => {
      bar.style.display = "none";
      if (!completed) {
        injectPopupStyles();
        showCompletionPopup();
        localStorage.setItem("siteCompleted", "true");
      }
    }, 400);
  } else {
    bar.style.display = "block";
  }
}

document.addEventListener("DOMContentLoaded", updateSiteProgressBar);