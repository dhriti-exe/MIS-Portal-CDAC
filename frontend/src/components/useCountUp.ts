import { useEffect, useRef, useState } from "react";

export function useCountUp(target: string | number, duration = 1200) {
  const [display, setDisplay] = useState<string>(typeof target === 'string' ? target : String(target));
  const raf = useRef<number>();

  useEffect(() => {
    // Only animate if target is a number (possibly with suffix)
    const match = String(target).match(/([\d,.]+)([A-Za-z%+]+)?/);
    if (!match) {
      setDisplay(String(target));
      return;
    }
    const [ , num, suffix = "" ] = match;
    const end = parseFloat(num.replace(/,/g, ""));
    if (isNaN(end)) {
      setDisplay(String(target));
      return;
    }
    let start = 0;
    const startTime = performance.now();
    function animate(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.floor(progress * (end - start) + start);
      // Format with commas if needed
      let formatted = value.toLocaleString();
      if (num.includes(".")) {
        // Show decimals if original had them
        const decimals = num.split(".")[1]?.length || 0;
        formatted = (progress * (end - start) + start).toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
      }
      setDisplay(formatted + suffix);
      if (progress < 1) {
        raf.current = requestAnimationFrame(animate);
      }
    }
    setDisplay("0" + suffix);
    raf.current = requestAnimationFrame(animate);
    return () => raf.current && cancelAnimationFrame(raf.current);
  }, [target, duration]);

  return display;
}
