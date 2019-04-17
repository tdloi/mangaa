import React from 'react';
import { MangaList } from '../MangaList';
import Loading from '../Loading';
import styled from 'styled-components';
import 'typeface-satisfy';

const StyledMangaListSection = styled.section`
  padding: 0.5rem 10px;
  padding-bottom: 1rem;
  background: ${props => props.theme.bg};
  > h1 {
    color: ${props => props.theme.fg};
    font-family: 'Satisfy', cursive, serif;
    font-size: 2.2rem;
  }
`;

export default function MangaListSection({
  section,
  lists,
  isRenderListEmpty,
  renderListEmptyMessage = 'This list is empty',
  isLoading,
  isError,
}) {
  let render = Array.isArray(lists) ? (
    <MangaList>{lists}</MangaList>
  ) : (
    <span>{lists}</span>
  );
  if (isLoading) {
    render = <Loading />;
  }
  if (isError) {
    render = 'Something went wrong';
  }
  if (isRenderListEmpty) {
    render = renderListEmptyMessage;
  }
  return (
    <StyledMangaListSection>
      <h1>{section}</h1>
      {render}
    </StyledMangaListSection>
  );
}
