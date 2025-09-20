// Smooth scroll functionality for non-home pages
(function () {
  "use strict";

  let hasScrolled = false; // Prevent multiple scrolls

  // Function to check if current page is not the home page
  function isNotHomePage() {
    const currentPage = window.location.pathname;
    const fileName = currentPage.split("/").pop();
    return fileName !== "index.html" && fileName !== "" && fileName !== "index";
  }

  // Function to smoothly scroll to main content
  function scrollToMainContent() {
    if (hasScrolled) return; // Prevent multiple executions
    hasScrolled = true;

    const mainContent = document.getElementById("main-content");
    if (mainContent) {
      // Calculate the position to scroll to (just past the header)
      const header = document.querySelector("header");
      const headerHeight = header ? header.offsetHeight : 0;
      const scrollPosition = headerHeight + 50; // Add 50px padding for better spacing

      // Add fade-in effect
      mainContent.classList.add("fade-in");

      // Use native smooth scrolling with a slight delay for better effect
      setTimeout(() => {
        window.scrollTo({
          top: scrollPosition,
          behavior: 'smooth'
        });
      }, 200);
    }
  }

  // Function to initialize smooth scrolling
  function initSmoothScroll() {
    // Only apply to non-home pages
    if (isNotHomePage()) {
      // Wait for page to load completely
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", function () {
          setTimeout(scrollToMainContent, 300);
        });
      } else {
        // Page is already loaded
        setTimeout(scrollToMainContent, 300);
      }
    }
  }

  // Initialize when script loads
  initSmoothScroll();
})();
