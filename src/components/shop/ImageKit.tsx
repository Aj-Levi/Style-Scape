"use client";

import React from "react";
import { ImageKitProvider, IKImage } from "imagekitio-next";

const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT;

interface ImageKitProps {
  src: string;
  height: number;
  width: number;
  alt: string;
}

const ImageKit = ({ src, height, width, alt }: ImageKitProps) => {
  return (
    <ImageKitProvider urlEndpoint={urlEndpoint}>
      <IKImage src={src} width={width} height={height} alt={alt} />
    </ImageKitProvider>
  );
};

export default ImageKit;
