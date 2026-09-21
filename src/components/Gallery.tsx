import Image from "next/image";
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

        <Reveal className="gallery-grid">
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
        </Reveal>

        <p className="gallery-note mono">Reference imagery &middot; project photography to follow</p>
      </div>
    </section>
  );
}
