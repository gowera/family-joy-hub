import type { ComponentProps, ReactNode } from "react";
import { galleryPhotos, type GalleryPhotoSlot } from "@/lib/galleryPhotos";
import { cn } from "@/lib/utils";

type PhotoProps = Omit<ComponentProps<"img">, "src"> & { photo: GalleryPhotoSlot };

export const GalleryPhoto = ({ photo, alt, className, loading = "lazy", ...props }: PhotoProps) => (
  <img
    {...props}
    src={galleryPhotos[photo].url}
    alt={alt ?? galleryPhotos[photo].alt}
    loading={loading}
    decoding="async"
    data-gallery-photo={photo}
    className={cn("block w-full max-w-full object-cover", className)}
  />
);

type SectionProps = ComponentProps<"section"> & {
  photo: GalleryPhotoSlot;
  backdrop?: boolean;
  priority?: boolean;
  children: ReactNode;
};

export const PhotoSection = ({ photo, backdrop = false, priority = false, className, children, ...props }: SectionProps) => (
  <section {...props} className={cn(backdrop && "gallery-photo-section", className)}>
    {backdrop ? (
      <>
        <GalleryPhoto photo={photo} alt="" loading={priority ? "eager" : "lazy"} className="gallery-photo-backdrop" />
        <div className="gallery-photo-shade" aria-hidden="true" />
        <div className="gallery-photo-content">{children}</div>
      </>
    ) : (
      <>
        <div className="container mx-auto px-4 mb-10">
          <GalleryPhoto photo={photo} className="aspect-[4/3] sm:aspect-[16/7] max-h-[420px] max-w-5xl mx-auto rounded-lg" />
        </div>
        {children}
      </>
    )}
  </section>
);