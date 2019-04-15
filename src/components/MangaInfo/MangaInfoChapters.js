import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Message from '../Message';

const StyledMangaInfoChapters = styled.section`
  padding: .5rem 1.5rem;
`;

const StyledMangaInfoChaptersItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.2rem;
  > div > span:first-child {
    margin-right: 1rem;
  }
`

export default function MangaInfoChapters(props) {
  const chapters = props.chapters;

  if (!Array.isArray(chapters) || chapters == null) {
    return 'Something went wrong';
  }

  if (chapters.length === 0) {
    return <Message content="This manga has no chapters" />;
  }
  return (
    <StyledMangaInfoChapters>
      {chapters.map(chapter => {
        const vol = chapter.vol ? `Vol ${chapter.vol} ` : '';
        const title = `${vol}Chapter ${chapter.chapter} - ${chapter.title}`;

        return (
          <StyledMangaInfoChaptersItem key={chapter.id}>
            <Link to={chapter.url}>{title}</Link>
            <div>
              <span>{chapter.user}</span>
              <span>{chapter.created}</span>{' '}
            </div>
          </StyledMangaInfoChaptersItem>
        );
      })}
    </StyledMangaInfoChapters>
  );
}
