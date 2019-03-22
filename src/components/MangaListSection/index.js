import React from 'react';
import MangaList from '../MangaList';
import styled from 'styled-components';


const StyledMangaListSection = styled.section`
  padding: 1rem 10px;
  padding-bottom: 2rem;
  background: ${props => props.theme.background}
  > h1 {
    color: ${props => props.theme.foreground}
  }
`;

export default function MangaListSection({ section, lists }) {
  return (
    <StyledMangaListSection>
      <h1>{section}</h1>
      <MangaList lists={lists} />
    </StyledMangaListSection>
  );
}
