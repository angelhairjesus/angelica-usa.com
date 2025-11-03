// Simple async form submission with visual feedback
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("signupForm");
  const success = document.getElementById("successMessage");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = form.email.value.trim();

    if (!email || !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    const button = form.querySelector("button");
    button.disabled = true;
    button.textContent = "Sending...";

    try {
      const response = await fetch(form.action, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });

      if (response.ok) {
        success.style.display = "block";
        form.reset();
      } else {
        alert("There was a problem sending your message. Try again later.");
      }
    } catch (err) {
      alert("Network error. Please try again.");
    } finally {
      button.disabled = false;
      button.textContent = "Sign Up";
    }
  });
});
