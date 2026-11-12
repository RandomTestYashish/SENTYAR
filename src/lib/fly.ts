// Animate a ghost of `from` travelling to `to` (cause → effect feedback).
// Skipped under reduced motion; callers always update state regardless.

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

export function flyTo(from: Element | null, to: Element | null, opts: { color?: string; label?: string } = {}) {
  if (!from || !to || prefersReducedMotion()) return Promise.resolve();
  const a = from.getBoundingClientRect();
  const b = to.getBoundingClientRect();
  const ghost = document.createElement("div");
  ghost.className = "fly-ghost";
  ghost.setAttribute("aria-hidden", "true");
  if (opts.color) ghost.style.setProperty("--fly-color", opts.color);
  ghost.textContent = opts.label ?? "";
  const size = 40;
  Object.assign(ghost.style, {
    left: `${a.left + a.width / 2 - size / 2}px`,
    top: `${a.top + a.height / 2 - size / 2}px`,
    width: `${size}px`,
    height: `${size}px`,
  });
  document.body.appendChild(ghost);
  const dx = b.left + b.width / 2 - (a.left + a.width / 2);
  const dy = b.top + b.height / 2 - (a.top + a.height / 2);
  const anim = ghost.animate(
    [
      { transform: "translate(0,0) scale(1)", opacity: 0.95 },
      { transform: `translate(${dx * 0.5}px, ${dy * 0.5 - 80}px) scale(1.1)`, opacity: 1, offset: 0.5 },
      { transform: `translate(${dx}px, ${dy}px) scale(0.5)`, opacity: 0.2 },
    ],
    { duration: 720, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
  );
  return anim.finished.catch(() => undefined).finally(() => {
    ghost.remove();
    to.animate([{ transform: "scale(1)" }, { transform: "scale(1.06)" }, { transform: "scale(1)" }], { duration: 260 });
  });
}
