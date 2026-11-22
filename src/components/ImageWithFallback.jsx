import { useState } from 'react';
import placeholder from '../assets/placeholder.svg';

export default function ImageWithFallback({ src, alt, className = '', ...rest }) {
  const [failed, setFailed] = useState(false);
  return (
    <img
      src={failed || !src ? placeholder : src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className={className}
      {...rest}
    />
  );
}
