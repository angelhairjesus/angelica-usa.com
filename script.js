document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("overlay");
  const mediaModal = document.getElementById("mediaModal");
  const contactModal = document.getElementById("contactModal");
  const infoModal = document.getElementById("infoModal");
  const ytplayer = document.getElementById("ytplayer");
  const form = document.getElementById("contactForm");
  const formMsg = document.getElementById("formMsg");

  // Vibration helper
  function vibrate(ms = 50) {
    if (navigator.vibrate) navigator.vibrate(ms);
  }

  function show(modal) {
    overlay.classList.remove("hidden");
    modal.classList.remove("hidden");
  }

  function hideAll() {
    overlay.classList.add("hidden");
    [mediaModal, contactModal, infoModal].forEach((m) =>
      m.classList.add("hidden")
    );
    ytplayer.src = ""; // Stop video
  }

  overlay.addEventListener("click", hideAll);
  document.querySelectorAll("[data-close]").forEach((btn) =>
    btn.addEventListener("click", hideAll)
  );

  // MEDIA
  document.getElementById("mediaBtn").addEventListener("click", () => {
    vibrate();
    ytplayer.src = "https://www.youtube.com/embed/X6Z3k9eo5qA?rel=0&playsinline=1";
    show(mediaModal);
  });

  // CONTACT
  document.getElementById("contactBtn").addEventListener("click", () => {
    vibrate();
    show(contactModal);
  });

  // NEWS / ABOUT
  document.getElementById("newsBtn").addEventListener("click", () => {
    vibrate();
    show(infoModal);
  });
  document.getElementById("aboutBtn").addEventListener("click", () => {
    vibrate();
    show(infoModal);
  });

  // FORM SUBMIT
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    formMsg.textContent = "Sending...";
    try {
      const data = new FormData(form);
      const resp = await fetch(form.action, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (resp.ok) {
        formMsg.textContent = "Thanks — check your inbox!";
        form.reset();
      } else {
        formMsg.textContent = "Something went wrong.";
      }
    } catch {
      formMsg.textContent = "Network error.";
    }
  });
});
