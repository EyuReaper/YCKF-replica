'use client'; // Marks this as a Client Component

import React from 'react';

interface TrainingImageProps {
  url?: string;
  alt: string;
  title: string;
}

export default function TrainingImage({ url, alt, title }: TrainingImageProps) {
  return (
    <img
      src={url || '/placeholder-image.jpg'} // Fallback image if url is undefined
      alt={alt}
      className="object-cover w-32 h-32 mr-6 rounded-lg"
      onError={(e) => {
        console.error(`Image failed to load for ${title}:`, e);
        (e.target as HTMLImageElement).src = '/placeholder-image.jpg'; // Fallback on error
      }}
    />
  );
}
