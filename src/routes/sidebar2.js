const sidebar = document.getElementById("sidebar");
const main = document.getElementById("main");
const toggle = document.getElementById("sidebarToggle");
const backdrop = document.getElementById("backdrop");

const DESKTOP_QUERY = window.matchMedia("(min-width: 1024px)");

const state = {
  isDesktop: DESKTOP_QUERY.matches,
  sidebarOpen: DESKTOP_QUERY.matches // open by default on desktop
};

/* -----------------------------
   Layout Application
-------------------------------- */
function applyLayout({ animate = true } = {}) {
  const duration = animate ? "260ms" : "0ms";

  sidebar.style.transitionDuration = duration;
  main.style.transitionDuration = duration;
  backdrop.style.transitionDuration = duration;

  if (state.sidebarOpen) {
    openSidebar();
  } else {
    closeSidebar();
  }

  toggle.setAttribute("aria-expanded", String(state.sidebarOpen));
}

function openSidebar() {
  sidebar.style.transform = "translateX(0)";

  if (state.isDesktop) {
    main.style.transform = "translateX(16rem)";
    hideBackdrop();
  } else {
    main.style.transform = "translateX(0)";
    showBackdrop();
  }
}

function closeSidebar() {
  sidebar.style.transform = "translateX(-100%)";
  main.style.transform = "translateX(0)";
  hideBackdrop();
}

/* -----------------------------
   Backdrop helpers
-------------------------------- */
function showBackdrop() {
  backdrop.classList.remove("opacity-0", "pointer-events-none");
}

function hideBackdrop() {
  backdrop.classList.add("opacity-0", "pointer-events-none");
}

/* -----------------------------
   Event Handlers
-------------------------------- */
toggle.addEventListener("click", () => {
  state.sidebarOpen = !state.sidebarOpen;
  applyLayout();
});

backdrop.addEventListener("click", () => {
  state.sidebarOpen = false;
  applyLayout();
});

DESKTOP_QUERY.addEventListener("change", (e) => {
  state.isDesktop = e.matches;
  state.sidebarOpen = e.matches; // reset default per breakpoint
  applyLayout({ animate: false });
});

/* -----------------------------
   Initial Render
-------------------------------- */
applyLayout({ animate: false });
