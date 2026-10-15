import { MediaFrame } from "@/src/features/landing/components/media-frame";

interface ProductMediaProps {
  imageUrl: string | null;
  name: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}

export function ProductMedia({ imageUrl, name, sizes, priority = false, className = "" }: ProductMediaProps) {
  return (
    <div className={`bezel ${className}`}>
      <MediaFrame
        src={imageUrl}
        alt={`Foto de ${name}`}
        hint={`Foto de producto: ${name}`}
        sizes={sizes}
        priority={priority}
        className="bezel-core lit aspect-[4/5] w-full [--lift:16px]"
      />
    </div>
  );
}
