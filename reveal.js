// Comparsa al primo ingresso nel viewport. Gli elementi già visibili al caricamento
// restano visibili senza animazione, così l'hero non aspetta lo scroll.
(() => {
  if (window.__miraReveal) return;
  window.__miraReveal = true;

  const SEL = [
    "section > h2",
    "section > div > h2",
    "section > p",
    "section > div > a",
    "section > div > figure",
    "section > div > div",
    "main > section",
    "aside"
  ].join(",");

  const css = document.createElement("style");
  css.textContent = `
    [data-reveal]{opacity:0;transform:translateY(22px);
      transition:opacity .7s cubic-bezier(.2,.7,.3,1),transform .7s cubic-bezier(.2,.7,.3,1)}
    [data-reveal].in{opacity:1;transform:none}
    @media (prefers-reduced-motion: reduce){
      [data-reveal]{opacity:1;transform:none;transition:none}
    }`;
  document.head.appendChild(css);

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("in");
      io.unobserve(e.target);
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -8% 0px" });

  const scan = () => {
    document.querySelectorAll(SEL).forEach((el) => {
      if (el.hasAttribute("data-reveal")) return;
      if (el.closest("header")) return;                    // l'hero ha la sua intro
      if (el.getBoundingClientRect().top < innerHeight) return; // già a schermo
      el.setAttribute("data-reveal", "");
      // fratelli sfalsati: le griglie di card entrano una dopo l'altra
      const sibs = el.parentElement ? [...el.parentElement.children] : [];
      const i = sibs.indexOf(el);
      if (sibs.length > 1 && i > 0) el.style.transitionDelay = Math.min(i, 5) * 0.08 + "s";
      io.observe(el);
    });
  };

  // i Design Component montano dopo il parse, e in più streamano:
  // ogni volta che arriva markup nuovo rifacciamo la passata
  let queued = false;
  const schedule = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; scan(); });
  };
  schedule();
  new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true });
  window.addEventListener("load", schedule);
})();
