import React from 'react';
import styled from 'styled-components';
import MangaItem from '../MangaItem';

const StyledMangaList = styled.section`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 10px;
  @media (min-width: 540px) and (max-width: 900px) {
    grid-template-columns: repeat(3, 1fr);
    > :last-child {
      display: none;
    }
  };
  @media (width > 900px) {
    grid-template-columns: repeat(5, 1fr);
  }
`;

export default function MangaList({ lists }) {
  return (
    <StyledMangaList>
      {lists.map(item => (
        <MangaItem key={item.id} {...item} />
      ))}
    </StyledMangaList>
  );
}
