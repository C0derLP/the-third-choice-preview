const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu-toggle");
const mainNav = document.querySelector("#main-nav");
const dropdownItem = document.querySelector(".has-dropdown");
const dropdownButton = document.querySelector(".dropdown-toggle");

/* Mobile navigation */

const closeMenu = () => {
  mainNav?.classList.remove("active");
  dropdownItem?.classList.remove("open");
  document.body.classList.remove("menu-open");

  menuButton?.setAttribute("aria-expanded", "false");
  dropdownButton?.setAttribute("aria-expanded", "false");

  const icon = menuButton?.querySelector("i");

  if (icon) {
    icon.className = "bx bx-menu";
  }
};

menuButton?.addEventListener("click", () => {
  if (!mainNav) {
    return;
  }

  const open = mainNav.classList.toggle("active");

  document.body.classList.toggle("menu-open", open);
  menuButton.setAttribute("aria-expanded", String(open));

  const icon = menuButton.querySelector("i");

  if (icon) {
    icon.className = open ? "bx bx-x" : "bx bx-menu";
  }
});

dropdownButton?.addEventListener("click", (event) => {
  event.preventDefault();

  if (!dropdownItem) {
    return;
  }

  const open = dropdownItem.classList.toggle("open");

  dropdownButton.setAttribute(
    "aria-expanded",
    String(open)
  );
});

document.querySelectorAll(".main-nav a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 760) {
    closeMenu();
  }
});

/* Sticky header */

window.addEventListener(
  "scroll",
  () => {
    header?.classList.toggle(
      "scrolled",
      window.scrollY > 10
    );
  },
  { passive: true }
);

/* Current navigation page */

const currentPage = document.body.dataset.page;

if (currentPage) {
  document
    .querySelector(`[data-nav="${currentPage}"]`)
    ?.classList.add("active");
}

/* FAQ accordion */

document
  .querySelectorAll(".faq-list details")
  .forEach((item) => {
    item.addEventListener("toggle", () => {
      if (!item.open) {
        return;
      }

      document
        .querySelectorAll(".faq-list details")
        .forEach((other) => {
          if (other !== item) {
            other.open = false;
          }
        });
    });
  });

/* Page opening transition */

const showPage = () => {
  requestAnimationFrame(() => {
    document.body.classList.add("page-loaded");
  });
};

if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    showPage,
    { once: true }
  );
} else {
  showPage();
}

/* Restore the page after using the browser Back button */

window.addEventListener("pageshow", () => {
  document.body.classList.remove("page-leaving");
  document.body.classList.add("page-loaded");
});

/* Automatically add left-side animations */

document
  .querySelectorAll(`
    .hero-copy,
    .page-hero > div:first-child,
    .schedule-hero > div:first-child,
    .tickets-hero > div:first-child,
    .contact-intro,
    .editorial-intro > div:first-child,
    .section-heading,
    .faq-section > div:first-child,
    .partner-section > div:first-child,
    .bio-body > div:first-child
  `)
  .forEach((element) => {
    element.classList.add("reveal-left");
  });

/* Automatically add right-side animations */

document
  .querySelectorAll(`
    .hero-media,
    .page-hero > div:last-child,
    .schedule-meta,
    .tickets-hero > div:last-child,
    .contact-form,
    .editorial-intro > div:last-child,
    .faq-list,
    .partner-list,
    .bio-body > article
  `)
  .forEach((element) => {
    element.classList.add("reveal-right");
  });

/* Automatically add upward animations */

document
  .querySelectorAll(`
    .outcome-card,
    .portrait-card,
    .pillars article,
    .ticket,
    .schedule-list article,
    .audience,
    .takeaway,
    .final-cta,
    .page-cta,
    .event-details,
    .contact-image-strip,
    .bio-highlights,
    .bio-next,
    .faq-list details
  `)
  .forEach((element) => {
    element.classList.add("reveal");
  });

/* Automatically animate photographs */

document
  .querySelectorAll(`
    .hero-media > img,
    .bio-image img,
    .photo-placeholder
  `)
  .forEach((element) => {
    element.classList.add("photo-reveal");
  });

/* Scroll animations */

const animatedElements = document.querySelectorAll(
  ".reveal, .reveal-left, .reveal-right, .photo-reveal"
);

const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

if ("IntersectionObserver" in window && !reduceMotion) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle(
          "visible",
          entry.isIntersecting
        );
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -35px 0px"
    }
  );

  animatedElements.forEach((element) => {
    revealObserver.observe(element);
  });
} else {
  animatedElements.forEach((element) => {
    element.classList.add("visible");
  });
}

/* Smooth fade between local HTML pages */

document.querySelectorAll("a[href]").forEach((link) => {
  link.addEventListener("click", (event) => {
    const href = link.getAttribute("href");

    if (
      !href ||
      href.startsWith("#") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:") ||
      link.target === "_blank" ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    const destination = new URL(
      link.href,
      window.location.href
    );

    if (destination.origin !== window.location.origin) {
      return;
    }

    event.preventDefault();

    document.body.classList.add("page-leaving");

    window.setTimeout(() => {
      window.location.href = destination.href;
    }, 350);
  });
});

/* Contact form */

const form = document.querySelector("#contact-form");
const formStatus = document.querySelector(".form-status");
const interest = document.querySelector("#interest");

const requestedInterest = new URLSearchParams(
  window.location.search
).get("interest");

if (interest && requestedInterest) {
  interest.value = requestedInterest;
}

form?.addEventListener("submit", (event) => {
  event.preventDefault();

  const button = form.querySelector(
    'button[type="submit"]'
  );

  if (!button) {
    return;
  }

  button.disabled = true;
  button.textContent = "Message Received";

  if (formStatus) {
    formStatus.textContent =
      "Thank you. This demonstration form is working. Connect it to your email service before launch.";
  }

  window.setTimeout(() => {
    form.reset();

    button.disabled = false;
    button.textContent = "Send My Message";

    if (formStatus) {
      formStatus.textContent = "";
    }
  }, 3000);
});