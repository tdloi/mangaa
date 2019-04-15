import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Image from '../Image';
import MangaInfoItems from './MangaInfoItems';

const StyledMangaInfoSkeleton = styled.section`
  display: grid;
  grid-template-columns: 1fr 2fr;
  grid-column-gap: 1.5rem;
  padding: 1.5rem;
  hr: {
    color: ${props => props.theme.fgAlt};
  }
  @media (max-width: 520px) {
    display: block;
  }
  @media (max-width: 650px) {
    grid-template-columns: 0.75fr 1fr;
  }
  @media (max-width: 850px) {
    grid-template-columns: 1fr 1fr;
  }
`;
const StyledMangaInfoSkeletonSection = styled.div`
  margin-bottom: .5rem;
  display: flex;
  > span:first-child {
    min-width: 100px;
  }
  & a {
    font-size: .85rem;
  }
  @media (max-width: 650px) {
    flex-direction: column;
    span:first-child {
      margin-bottom: ${props => props.isTags && '0.2rem'}
    }
  }

`;

export default function MangaInfoSkeleton(props) {
  const manga = props.manga;

  return (
    <StyledMangaInfoSkeleton>
      <Image src={manga.cover} alt={manga.title} />
      <div>
        <div>
          <h3>{manga.title}</h3>
          <hr />
        </div>
        <MangaInfoSkeletonSection label="Alt titles">
          {manga.alt_titles}
        </MangaInfoSkeletonSection>
        <MangaInfoSkeletonSection label="Tags" isTags={true}>
          <MangaInfoItems>
            {manga.tags && manga.tags.map(tag => (
              <Link to={tag.url} key={tag.id}>#{tag.name}</Link>
            ))}
          </MangaInfoItems>
        </MangaInfoSkeletonSection>
        <MangaInfoSkeletonSection label="Authors" isTags={true}>
          <MangaInfoItems>
            {manga.authors && manga.authors.map(author => (
              <Link to={author.url} key={author.id}>{author.name}</Link>
            ))}
          </MangaInfoItems>
        </MangaInfoSkeletonSection>
        <MangaInfoSkeletonSection label="Description">
          {manga.description}
        </MangaInfoSkeletonSection>
      </div>
    </StyledMangaInfoSkeleton>
  );
}

function MangaInfoSkeletonSection({ label, isTags, children }) {
  return (
    <StyledMangaInfoSkeletonSection isTags={isTags}>
      <span>
        <strong>{label}</strong>
      </span>
      <span>{children}</span>
    </StyledMangaInfoSkeletonSection>
  );
}
