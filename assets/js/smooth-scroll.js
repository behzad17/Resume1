// Smooth scroll functionality for non-home pages
(function () {
  "use strict";

  // Function to smoothly scroll to main content
  function scrollToMainContent() {
    const mainContent = document.getElementById("main-content");
    if (mainContent) {
      // Calculate the position to scroll to (just past the header)
      const header = document.querySelector("header");
      const headerHeight = header ? header.offsetHeight : 0;
      const scrollPosition = headerHeight + 30; // Add 30px padding for better spacing

      // Add fade-in effect
      mainContent.classList.add("fade-in");

      // Smooth scroll to the calculated position with custom timing
      const startPosition = window.pageYOffset;
      const distance = scrollPosition - startPosition;
      const duration = 1200; // 1.2 seconds for slow, smooth scroll
      let start = null;

      function easeInOutCubic(t) {
        return t < 0.5
          ? 4 * t * t * t
          : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
      }

      function animation(currentTime) {
        if (start === null) start = currentTime;
        const timeElapsed = currentTime - start;
        const progress = Math.min(timeElapsed / duration, 1);
        const ease = easeInOutCubic(progress);

        window.scrollTo(0, startPosition + distance * ease);

        if (timeElapsed < duration) {
          requestAnimationFrame(animation);
        }
      }

      requestAnimationFrame(animation);
    }
  }

  // Function to check if current page is not the home page
  function isNotHomePage() {
    const currentPage = window.location.pathname;
    const fileName = currentPage.split("/").pop();
    return fileName !== "index.html" && fileName !== "" && fileName !== "index";
  }

  // Function to initialize smooth scrolling
  function initSmoothScroll() {
    // Only apply to non-home pages
    if (isNotHomePage()) {
      // Wait for page to load completely
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", function () {
          // Small delay to ensure everything is rendered
          setTimeout(scrollToMainContent, 150);
        });
      } else {
        // Page is already loaded
        setTimeout(scrollToMainContent, 150);
      }
    }
  }

  // Initialize when script loads
  initSmoothScroll();

  // Also handle cases where page loads after script
  window.addEventListener("load", function () {
    if (isNotHomePage()) {
      setTimeout(scrollToMainContent, 100);
    }
  });
})();
