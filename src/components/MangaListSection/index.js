import React from 'react';
import styled from 'styled-components';

import Loading from 'components/Loading';
import Wrapper from 'components/Wrapper';

import { MangaList } from './MangaList';

const StyledMangaListSection = styled.section`
  margin: 1rem auto;
  > h1 {
    color: ${props => props.theme.fg};
    font-size: 2.2rem;
    margin-bottom: 0.5rem;
    margin-left: 1rem;
  }
  > div {
    background: ${({ theme }) => theme.bg};
    padding: 1rem 1.25rem;
    border: 1px solid ${({ theme }) => theme.shadow};
    border-radius: .35rem;
    ${({ isList }) => !isList && `
      background: transparent;
      border: none;
      padding-top: 0;
      padding-bottom: 0;
    `}
    @media (width > 900px) {
      padding-left: 1.55rem;
      padding-right: 1.55rem;
    }
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
        <div>{render}</div>
      </StyledMangaListSection>
    </Wrapper>
  );
}
