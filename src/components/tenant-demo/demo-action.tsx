"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * A prototype action of the OWNER demo (download an invoice / a document): it never fetches a file and never pretends one was
 * sent — a short toast says it is a prototype. The real cabinet replaces it with the signed file link from the document store.
 */
export function DemoAction({ children, className = "", message = "Прототип: в демо файл не формируется." }: { children: ReactNode; className?: string; message?: string }) {
  const [on, setOn] = useState(false);
  const timer = useRef<number | null>(null);
  useEffect(() => () => { if (timer.current) window.clearTimeout(timer.current); }, []);
  return (
    <>
      <button
        type="button"
        className={className}
        onClick={() => {
          setOn(true);
          if (timer.current) window.clearTimeout(timer.current);
          timer.current = window.setTimeout(() => setOn(false), 2600);
        }}
      >
        {children}
      </button>
      <span className="tc-toast" role="status" aria-live="polite" data-on={on ? "true" : "false"}>{on ? message : ""}</span>
    </>
  );
}
