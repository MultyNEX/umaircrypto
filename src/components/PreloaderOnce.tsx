"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const Preloader = dynamic(() => import("@/components/Preloader"), {
  ssr: false,
});

export default function PreloaderOnce() {
  const [shouldShow, setShouldShow] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem("preloader_done")) {
        // Already played — remove gate immediately, skip preloader
        const gate = document.getElementById("preloader-gate");
        if (gate) gate.remove();
        setShouldShow(false);
      } else {
        // First visit — show preloader, mark as done when it finishes
        setShouldShow(true);

        // Watch for gate removal (means preloader finished)
        const observer = new MutationObserver(() => {
          if (!document.getElementById("preloader-gate")) {
            sessionStorage.setItem("preloader_done", "1");
            observer.disconnect();
          }
        });
        observer.observe(document.body, { childList: true, subtree: true });
      }
    } catch {
      // sessionStorage not available — always show preloader
      setShouldShow(true);
    }
    setChecked(true);
  }, []);

  if (!checked || !shouldShow) return null;
  return <Preloader />;
}
