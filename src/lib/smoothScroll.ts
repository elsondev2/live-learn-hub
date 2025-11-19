// Light and fast scroll with minimal easing
export function smoothScrollTo(targetPosition: number, duration: number = 600) {
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  let startTime: number | null = null;

  // Lighter easing function - ease out quad (faster, lighter)
  function easeOutQuad(t: number): number {
    return t * (2 - t);
  }

  function animation(currentTime: number) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    const ease = easeOutQuad(progress);

    window.scrollTo(0, startPosition + distance * ease);

    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    }
  }

  requestAnimationFrame(animation);
}

// Light scroll to element
export function smoothScrollToElement(element: HTMLElement | null, offset: number = 0, duration: number = 600) {
  if (!element) return;
  
  const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - offset;
  smoothScrollTo(targetPosition, duration);
}
