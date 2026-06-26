import { animate } from "motion/mini";

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealSelector = [
  "[data-motion-reveal]",
  ".section > .section-head",
  ".hero .hero-copy",
  ".hero .hero-media",
  ".hero .portrait-wrap",
  ".case-content > section",
].join(",");
const groupSelector = [
  "[data-motion-group]",
  ".project-grid",
  ".highlight-grid",
  ".module-grid",
  ".platform-grid",
  ".product-grid",
  ".recipe-grid",
  ".journey-grid",
  ".guide-grid",
  ".process-grid",
  ".sweet-grid",
  ".contest-grid",
  ".original-strip",
  ".competencies",
  ".gallery",
  ".showcase-section",
  ".original-section",
].join(",");
const cardSelector = [
  "[data-motion-card]",
  ".project-card",
  ".highlight-grid article",
  ".module-grid article",
  ".platform-grid article",
  ".product-card",
  ".recipe-card",
  ".journey-grid article",
  ".guide-grid article",
  ".process-grid article",
  ".sweet-grid article",
  ".contest-grid article",
  ".original-strip figure",
  ".competencies article",
  ".gallery figure",
  ".showcase-section figure",
  ".original-section figure",
  ".system-card",
].join(",");
const pressSelector = [
  "[data-motion-press]",
  ".project-card",
  ".module-grid article",
  ".platform-grid article",
  ".product-card",
  ".recipe-card",
  ".gallery figure",
  ".showcase-section figure",
  ".original-section figure",
  ".system-card",
  ".brand-logo",
].join(",");
const floatSelector = ".floating-sweets .sweet-orb, .floating-easter .easter-orb";

const setVisible = (elements) => {
  elements.forEach((element) => {
    element.style.opacity = "1";
    element.style.transform = "none";
  });
};

const observeOnce = (element, callback, options = {}) => {
  if (!("IntersectionObserver" in window)) {
    callback();
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      callback();
      observer.unobserve(entry.target);
    });
  }, options);

  observer.observe(element);
};

if (reduceMotion) {
  setVisible(Array.from(document.querySelectorAll(`${revealSelector}, ${cardSelector}`)));
} else {
  const revealItems = Array.from(document.querySelectorAll(revealSelector));
  const cardGroups = Array.from(document.querySelectorAll(groupSelector));
  const pressItems = Array.from(document.querySelectorAll(pressSelector));
  const floatItems = Array.from(document.querySelectorAll(floatSelector));

  revealItems.forEach((element) => {
    element.style.opacity = "0";
    element.style.transform = "translateY(28px)";

    observeOnce(
      element,
      () => {
        animate(
          element,
          { opacity: 1, transform: "translateY(0)" },
          { duration: 0.55, easing: [0.16, 1, 0.3, 1] }
        );
      },
      { rootMargin: "0px 0px -12% 0px" }
    );
  });

  cardGroups.forEach((group) => {
    const cards = Array.from(group.querySelectorAll(cardSelector));
    if (!cards.length) return;

    cards.forEach((card) => {
      card.style.opacity = "0";
      card.style.transform = "translateY(22px) scale(0.985)";
    });

    observeOnce(
      group,
      () => {
        cards.forEach((card, index) => {
          animate(
            card,
            { opacity: 1, transform: "translateY(0) scale(1)" },
            { delay: index * 0.045, duration: 0.45, easing: [0.16, 1, 0.3, 1] }
          );
        });
      },
      { rootMargin: "0px 0px -10% 0px" }
    );
  });

  pressItems.forEach((item) => {
    const enter = () => animate(item, { transform: "translateY(-4px)" }, { duration: 0.18, easing: "ease-out" });
    const leave = () => animate(item, { transform: "translateY(0)" }, { duration: 0.2, easing: "ease-out" });
    const press = () => animate(item, { transform: "translateY(-2px) scale(0.985)" }, { duration: 0.12, easing: "ease-out" });

    item.addEventListener("pointerenter", enter);
    item.addEventListener("pointerleave", leave);
    item.addEventListener("pointerdown", press);
    item.addEventListener("pointerup", enter);
    item.addEventListener("blur", leave);
  });

  floatItems.forEach((item, index) => {
    animate(
      item,
      { transform: ["translate3d(0, 0, 0) rotate(0deg)", "translate3d(0, -18px, 0) rotate(8deg)", "translate3d(0, 0, 0) rotate(0deg)"] },
      { duration: 4.6 + index * 0.7, repeat: Infinity, easing: "ease-in-out" }
    );
  });
}
