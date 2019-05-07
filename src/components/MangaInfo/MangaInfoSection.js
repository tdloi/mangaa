import React from 'react';
import styled from 'styled-components';

const StyledMangaInfoSection = styled.div`
  margin-bottom: 0.5rem;
  display: flex;
  @media (max-width: 650px) {
    flex-direction: column;
    span:first-child {
      margin-bottom: ${props => props.isTags && '0.2rem'};
    }
  }
  > :first-child {
    min-width: 100px;
  }
`;

export function MangaInfoSection({ label, isTags, children }) {
  return (
    <StyledMangaInfoSection isTags={isTags}>
      <span>
        <strong>{label}</strong>
      </span>
      <span>{children}</span>
    </StyledMangaInfoSection>
  );
}
