"use client";

import { useState } from "react";
import Image from "next/image";

interface ImageFallbackProps {
  src: string;
  alt: string;
  fallbackSrc?: string;
  [key: string]: any;
}

const ImageFallback = ({
  src,
  alt,
  fallbackSrc = "/images/placeholder.jpg",
  ...props
}: ImageFallbackProps) => {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      onError={() => setImgSrc(fallbackSrc)}
    />
  );
};

export default ImageFallback;
