import React from 'react';
import styled from 'styled-components';

import { MangaList } from '../MangaList';
import Loading from '../Loading';
import 'typeface-satisfy';

const StyledMangaListSection = styled.section`
  margin: 1rem auto;
  > h1 {
    color: ${props => props.theme.fg};
    font-family: 'Satisfy', cursive, serif;
    font-size: 2.2rem;
    text-decoration: underline;
    margin-bottom: .5rem;
    margin-left: 1rem;
  }
  > div {
    background: ${props => props.theme.bg};
    padding: 1rem .85rem;
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
  else if (isError) {
    render = 'Something went wrong';
  }
  else if (isRenderListEmpty) {
    render = renderListEmptyMessage;
  }

  return (
    <StyledMangaListSection>
      <h1>{section}</h1>
      <div>{render}</div>
    </StyledMangaListSection>
  );
}
