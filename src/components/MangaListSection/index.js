import React from 'react';
import { MangaList } from '../MangaList';
import Loading from '../Loading';
import styled from 'styled-components';

const StyledMangaListSection = styled.section`
  padding: 1rem 10px;
  padding-bottom: 2rem;
  background: ${props => props.theme.bg} > h1 {
    color: ${props => props.theme.fg};
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
  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return 'Something went wrong';
  }
  if (isRenderListEmpty) {
    return renderListEmptyMessage;
  }
  return (
    <StyledMangaListSection>
      <h1>{section}</h1>
      {Array.isArray(lists) ? <MangaList>{lists}</MangaList> : <span>{ lists }</span>}
    </StyledMangaListSection>
  );
}
