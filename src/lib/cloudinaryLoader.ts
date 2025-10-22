// lib/cloudinaryLoader.ts
export const cloudinaryLoader = ({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) => {
  const q = quality || 75;
  return `${src}?w=${width}&q=${q}&auto=format`;
};
