import React from 'react';
import styled from 'styled-components';

import Card from 'common/Card';
import Loading from 'components/Loading';
import Wrapper from 'components/Wrapper';

import { MangaList } from './MangaList';

const StyledMangaListSection = styled.section`
  margin: .8rem auto;
  > h1 {
    color: ${props => props.theme.fg};
    font-size: 2.2rem;
    margin-bottom: 0.75rem;
    margin-left: 1rem;
  }
  > div {
    ${({ isList }) =>
      !isList &&
      `
      background: transparent;
      border: none;
      padding-top: 0;
      padding-bottom: 0;
    `}
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
  let [render, isList] = Array.isArray(lists)
    ? [<MangaList>{lists}</MangaList>, true]
    : [<span>{lists}</span>, false];

  if (isLoading) {
    render = <Loading />;
  } else if (isError) {
    render = 'Something went wrong';
  } else if (isRenderListEmpty) {
    render = renderListEmptyMessage;
  }

  return (
    <Wrapper>
      <StyledMangaListSection isList={isList}>
        <h1>{section}</h1>
        <Card>
          <div>{render}</div>
        </Card>
      </StyledMangaListSection>
    </Wrapper>
  );
}
