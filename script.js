// Rotary dial with modal popups (loads content on open). Uses your provided links.
document.addEventListener('DOMContentLoaded', () => {
  const dial = document.getElementById('dial');
  const holes = Array.from(document.querySelectorAll('.hole'));
  const backdrop = document.getElementById('backdrop');

  // Modal elements
  const mediaModal = document.getElementById('media-modal');
  const contactModal = document.getElementById('contact-modal');
  const genericModal = document.getElementById('generic-modal');
  const mediaContent = document.getElementById('mediaContent');
  const contactForm = document.getElementById('contactForm');
  const formMessage = document.getElementById('formMessage');

  // Config: mapping index -> action
  // 0 = Media, 1 = News (placeholder), 2 = About (placeholder), 3 = Contact
  function handleAction(index){
    if (index === 0) openMedia();
    else if (index === 3) openContact();
    else openGeneric();
  }

  // Haptic helper
  function vibrate(ms = 40){
    if (navigator.vibrate) navigator.vibrate(ms);
  }

  // Load & open media modal (only when opened)
  function openMedia(){
    vibrate(60);
    // clear previous content then inject iframe
    mediaContent.innerHTML = '';
    const iframe = document.createElement('iframe');
    // embed your YouTube link — using the provided URL converted to embed
    iframe.src = "https://www.youtube.com/embed/X6Z3k9eo5qA?rel=0";
    iframe.title = "Angelica video";
    iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
    iframe.allowFullscreen = true;
    mediaContent.appendChild(iframe);
    showModal(mediaModal);
  }

  // Open contact modal (form already present). Reset messages.
  function openContact(){
    vibrate(60);
    formMessage.textContent = '';
    showModal(contactModal);
  }

  // Generic placeholder modal
  function openGeneric(){
    vibrate(40);
    showModal(genericModal);
  }

  // Show modal helper
  function showModal(modalEl){
    backdrop.classList.remove('hidden');
    modalEl.classList.remove('hidden');
    modalEl.setAttribute('aria-hidden', 'false');
  }

  // Close modal helper
  function closeModal(modalEl){
    modalEl.classList.add('hidden');
    modalEl.setAttribute('aria-hidden','true');
    // remove iframe for media to stop playback when closed
    if(modalEl === mediaModal){
      mediaContent.innerHTML = '';
    }
    // hide backdrop if no other modal shown
    if (!document.querySelector('.modal:not(.hidden)')) {
      backdrop.classList.add('hidden');
    }
  }

  // Attach close buttons (data-close)
  document.querySelectorAll('[data-close]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const parentModal = e.target.closest('.modal');
      if (parentModal) closeModal(parentModal);
    });
  });

  // Close when clicking backdrop
  backdrop.addEventListener('click', () => {
    document.querySelectorAll('.modal:not(.hidden)').forEach(m => closeModal(m));
  });

  // Simple form submit via fetch to Formspree with UX
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(contactForm);
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    try {
      const resp = await fetch(contactForm.action, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: formData
      });
      if (resp.ok) {
        formMessage.textContent = 'Thanks — check your inbox!';
        contactForm.reset();
      } else {
        const data = await resp.json();
        formMessage.textContent = data?.error || 'Submission failed. Try again.';
      }
    } catch (err) {
      formMessage.textContent = 'Network error. Try again.';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit';
    }
  });

  // ROTATION LOGIC (drag / snap / click)
  let currentAngle = 0;
  let startAngle = null;
  let dragging = false;

  function angleFromEvent(evt){
    const rect = dial.getBoundingClientRect();
    const cx = rect.left + rect.width/2;
    const cy = rect.top + rect.height/2;
    const x = (evt.clientX !== undefined) ? evt.clientX : evt.touches[0].clientX;
    const y = (evt.clientY !== undefined) ? evt.clientY : evt.touches[0].clientY;
    return Math.atan2(y - cy, x - cx) * 180 / Math.PI;
  }

  function snapToQuadrant(angle){
    let a = angle % 360;
    if (a < 0) a += 360;
    const sector = Math.round(a / 90) % 4;
    return sector * 90;
  }

  function setRotation(angle){
    currentAngle = angle;
    dial.style.transform = `rotate(${angle}deg)`;
  }

  function pointerDown(e){
    e.preventDefault();
    dragging = true;
    startAngle = angleFromEvent(e);
    vibrate(10);
  }
  function pointerMove(e){
    if(!dragging) return;
    const a = angleFromEvent(e);
    const diff = a - startAngle;
    setRotation(currentAngle + diff);
    startAngle = a;
  }
  function pointerUp(e){
    if(!dragging) return;
    dragging = false;
    const snapped = snapToQuadrant(currentAngle);
    setRotation(snapped);
    // Determine index. Map angles to indices:
    // 0deg -> index 0 (Media), 90deg -> index 1, 180deg -> index 2, 270deg -> index 3
    let idx = Math.round(((snapped % 360) + 360) % 360 / 90) % 4;
    handleAction(idx);
  }

  // Pointer events
  dial.addEventListener('pointerdown', pointerDown);
  window.addEventListener('pointermove', pointerMove);
  window.addEventListener('pointerup', pointerUp);

  // Touch fallback
  dial.addEventListener('touchstart', pointerDown, {passive:false});
  window.addEventListener('touchmove', pointerMove, {passive:false});
  window.addEventListener('touchend', pointerUp);

  // Clicking holes directly triggers action and rotates dial
  holes.forEach((h, idx) => {
    h.addEventListener('click', (e) => {
      e.stopPropagation();
      const targetAngle = idx * 90;
      setRotation(targetAngle);
      vibrate(40);
      handleAction(idx);
    });
    h.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter' || ev.key === ' ') h.click();
    });
  });

  // Start at Media by default
  setRotation(0);
});

