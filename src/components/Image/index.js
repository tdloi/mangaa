import React, { useState } from 'react';
import PropTypes from 'prop-types';
import 'styled-components/macro';

export default function Image({ src, srcWebp, alt }) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <picture>
      {srcWebp && <source srcset={srcWebp} type="image/webp" />}
      <img
        src={src}
        alt={alt}
        css={`
          max-width: 100%;
          filter: ${isLoading && 'blur(5px)'};
        `}
        onLoad={() => setIsLoading(false)}
      />
    </picture>
  );
}

Image.prototype = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
};
