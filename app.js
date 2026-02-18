/* ══════════════════════════════════════════════════
   AyurAI — App Logic & Animation Engine
   ══════════════════════════════════════════════════ */

// ─── Screen Navigation ───
let currentScreen = 'dashboard';

function navigateTo(screenId) {
  if (screenId === currentScreen) return;

  const current = document.getElementById(`screen-${currentScreen}`);
  const next = document.getElementById(`screen-${screenId}`);

  if (!current || !next) return;

  // Exit current
  current.classList.remove('active');
  current.classList.add('exit-left');

  // Enter next
  next.classList.add('active');

  // Update nav
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.screen === screenId);
  });

  // Clean up after transition
  setTimeout(() => {
    current.classList.remove('exit-left');
  }, 500);

  currentScreen = screenId;

  // Scroll to top
  const scroll = next.querySelector('.screen-scroll');
  if (scroll) scroll.scrollTop = 0;

  // Trigger screen-specific animations
  setTimeout(() => {
    triggerScreenAnimations(screenId);
  }, 100);
}

// ─── Trigger Animations per Screen ───
function triggerScreenAnimations(screenId) {
  switch (screenId) {
    case 'dashboard':
      animateAgniRing();
      animateCountUp('.agni-number');
      animateProgressBars();
      break;
    case 'prakriti':
      animateProgressBars();
      break;
    case 'results':
      animateDoshaCircles();
      break;
    case 'insights':
      animateVitalityArc();
      animateCountUp('.vitality-number');
      break;
  }
  // Float cards
  observeFloatCards();
}

// ─── Agni Score Ring Animation ───
function animateAgniRing() {
  const ring = document.querySelector('.agni-progress');
  if (!ring) return;

  const circumference = 2 * Math.PI * 85; // r=85
  const target = 82; // score out of 100
  const offset = circumference - (target / 100) * circumference;

  ring.style.strokeDasharray = circumference;
  ring.style.strokeDashoffset = circumference;

  requestAnimationFrame(() => {
    setTimeout(() => {
      ring.style.transition = 'stroke-dashoffset 2s cubic-bezier(0.22, 1, 0.36, 1)';
      ring.style.strokeDashoffset = offset;
    }, 300);
  });
}

// ─── Vitality Arc Animation ───
function animateVitalityArc() {
  const arc = document.querySelector('.vitality-progress');
  if (!arc) return;

  const totalLength = 251; // approximate arc length
  const target = 88;
  const offset = totalLength - (target / 100) * totalLength;

  arc.style.strokeDasharray = totalLength;
  arc.style.strokeDashoffset = totalLength;

  requestAnimationFrame(() => {
    setTimeout(() => {
      arc.style.transition = 'stroke-dashoffset 2s cubic-bezier(0.22, 1, 0.36, 1)';
      arc.style.strokeDashoffset = offset;
    }, 300);
  });
}

// ─── Count Up Animation ───
function animateCountUp(selector) {
  const el = document.querySelector(selector);
  if (!el) return;

  const target = parseInt(el.dataset.target);
  const duration = 2000;
  const start = performance.now();
  el.textContent = '0';

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);
    el.textContent = current;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

// ─── Progress Bars Animation ───
function animateProgressBars() {
  document.querySelectorAll('.progress-fill[data-width]').forEach(bar => {
    const screen = bar.closest('.screen');
    if (!screen || !screen.classList.contains('active')) return;
    bar.style.width = '0%';
    setTimeout(() => {
      bar.style.width = bar.dataset.width + '%';
    }, 200);
  });
}

// ─── Dosha Circles Animation (Results) ───
function animateDoshaCircles() {
  const chart = document.querySelector('.dosha-chart');
  if (!chart) return;

  const circles = chart.querySelectorAll('.dosha-circle');
  circles.forEach((circle, i) => {
    const targetR = circle.dataset.targetR;
    circle.setAttribute('r', '0');
    setTimeout(() => {
      circle.style.transition = `r 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 0.2}s`;
      circle.setAttribute('r', targetR);
    }, 300);
  });

  // Show labels after circles expand
  setTimeout(() => {
    chart.classList.add('animated');
  }, 800);
}

// ─── Floating Card Observer ───
function observeFloatCards() {
  const cards = document.querySelectorAll('.float-card');

  cards.forEach((card, index) => {
    const screen = card.closest('.screen');
    if (!screen || !screen.classList.contains('active')) return;

    // Staggered appearance
    card.classList.remove('visible');
    setTimeout(() => {
      card.classList.add('visible');
    }, 100 + index * 80);
  });
}

// ─── Quiz Option Selection ───
function selectOption(el) {
  const container = el.closest('.quiz-options');
  container.querySelectorAll('.quiz-option').forEach(opt => {
    opt.classList.remove('selected');
    const radio = opt.querySelector('.option-radio');
    radio.innerHTML = '';
  });

  el.classList.add('selected');
  const radio = el.querySelector('.option-radio');
  radio.innerHTML = '<div class="radio-inner"></div>';
}

// ─── Day Pill Selection ───
document.querySelectorAll('.day-pill').forEach(pill => {
  pill.addEventListener('click', () => {
    document.querySelectorAll('.day-pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
  });
});

// ─── Goal Toggle ───
document.querySelectorAll('.goal-toggle').forEach(toggle => {
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
  });
});

// ─── Trend Card Intersection Observer ───
const trendObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.trend-card').forEach(card => {
  trendObserver.observe(card);
});

// ─── Initial Load ───
document.addEventListener('DOMContentLoaded', () => {
  // Small delay for smooth entrance
  setTimeout(() => {
    triggerScreenAnimations('dashboard');
  }, 400);
});

// ─── Parallax on scroll ───
document.querySelectorAll('.screen-scroll').forEach(scroll => {
  scroll.addEventListener('scroll', () => {
    const scrollTop = scroll.scrollTop;
    const header = scroll.querySelector('.dash-header, .quiz-header, .results-header, .planner-header, .insights-header');
    if (header) {
      header.style.transform = `translateY(${scrollTop * 0.08}px)`;
      header.style.opacity = Math.max(0.3, 1 - scrollTop / 400);
    }
  });
});
