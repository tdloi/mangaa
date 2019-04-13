import React from 'react';
import styled from 'styled-components';

const StyledMangaInfoItems = styled.div`
  span {
    padding: 0.1rem 0.2rem;
    border: 1px solid ${props => props.theme.fg};
    border-radius: 2px;
  }
  span:not(:last-child) {
    margin-right: 0.5rem;
  }
`;

export default function MangaInfoItems(props) {
  return (
    <StyledMangaInfoItems>
      {props.children && props.children.map(child => (
        <span>{child}</span>
      ))}
    </StyledMangaInfoItems>
  );
}
