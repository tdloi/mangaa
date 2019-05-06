import React, { useState } from 'react';
import 'styled-components/macro';

export default function Image({ src, srcWebp, alt }) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <picture css={`margin: 0 auto`}>
      {srcWebp && <source srcSet={srcWebp} type="image/webp" />}
      <img
        src={src}
        alt={alt}
        css={`
          max-width: 100%;
          margin: 0 auto;
          display: block;
          filter: ${isLoading && 'blur(5px)'};
        `}
        onLoad={() => setIsLoading(false)}
      />
    </picture>
  );
}
