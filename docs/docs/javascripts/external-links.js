(() => {
  const openExternalReposInNewTab = () => {
    document
      .querySelectorAll('a[href^="https://github.com/"]')
      .forEach((link) => {
        link.setAttribute("target", "_blank");
        link.setAttribute("rel", "noopener noreferrer");
      });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", openExternalReposInNewTab, {
      once: true,
    });
  } else {
    openExternalReposInNewTab();
  }

  if (typeof document$ !== "undefined") {
    document$.subscribe(openExternalReposInNewTab);
  }
})();
