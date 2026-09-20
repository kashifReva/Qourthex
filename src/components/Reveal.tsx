"use client";

import { createElement, useEffect, useRef, useState, type ReactNode, type ElementType } from "react";

export default function Reveal({
  children,
  className = "",
  as = "div",
  style,
  id,
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  style?: React.CSSProperties;
  id?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return createElement(
    as,
    {
      ref,
      className: `reveal${inView ? " in" : ""}${className ? ` ${className}` : ""}`,
      style,
      id,
    },
    children
  );
}
