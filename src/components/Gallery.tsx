"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Reveal from "./Reveal";

const GALLERY_IMAGES = [
  { src: "/gallery/gallery-01.jpg", alt: "Rooftop court under open sky" },
  { src: "/gallery/gallery-02.jpg", alt: "Elevated court with skyline backdrop" },
  { src: "/gallery/gallery-03.jpg", alt: "Close detail of rackets at the net" },
  { src: "/gallery/gallery-04.jpg", alt: "Court net and ball, low light" },
  { src: "/gallery/gallery-05.jpg", alt: "Indoor court mid-play" },
  { src: "/gallery/gallery-06.jpg", alt: "Court corridor with ambient lighting" },
  { src: "/gallery/gallery-07.jpg", alt: "Indoor court lounge and seating" },
] as const;

export default function Gallery() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const updateEdges = () => {
      setAtStart(el.scrollLeft <= 4);
      setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
    };

    updateEdges();
    el.addEventListener("scroll", updateEdges, { passive: true });
    window.addEventListener("resize", updateEdges);
    return () => {
      el.removeEventListener("scroll", updateEdges);
      window.removeEventListener("resize", updateEdges);
    };
  }, []);

  // Each click advances by exactly one viewport width, i.e. the current
  // batch of visible tiles (3 on desktop, 2 on tablet, 1 on mobile) slides
  // out as the next batch slides in.
  const scrollByScreen = (dir: 1 | -1) => {
    const el = viewportRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth, behavior: "smooth" });
  };

  return (
    <section className="section" id="gallery">
      <div className="wrap">
        <Reveal className="section-head">
          <div className="eyebrow">
            <span className="idx mono">// 07</span>
            <span className="rule"></span>
            <span className="label">The Gallery</span>
          </div>
          <h2>
            A look at the <span className="lime">world</span> we build courts for.
          </h2>
        </Reveal>

        <Reveal className="gallery-slider">
          <div className="gallery-viewport" ref={viewportRef}>
            {GALLERY_IMAGES.map((img, i) => (
              <div className="gallery-tile" key={img.src}>
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="gallery-tile-photo"
                  priority={i === 0}
                />
                <div className="chip mono">{String(i + 1).padStart(2, "0")} / GALLERY</div>
              </div>
            ))}
          </div>

          <button
            type="button"
            className="gallery-nav gallery-nav-prev"
            onClick={() => scrollByScreen(-1)}
            disabled={atStart}
            aria-label="Previous images"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            className="gallery-nav gallery-nav-next"
            onClick={() => scrollByScreen(1)}
            disabled={atEnd}
            aria-label="Next images"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </Reveal>

        <p className="gallery-note mono">Reference imagery &middot; project photography to follow</p>
      </div>
    </section>
  );
}
