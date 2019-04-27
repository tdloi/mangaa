import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Image from '../Image';

const StyledMangaInfoSkeleton = styled.section`
  display: grid;
  grid-template-columns: 1fr 2fr;
  grid-column-gap: 1.5rem;
  padding-left: .5rem;
  padding-right: .5rem;
  background: ${props => props.theme.bg};
  hr: {
    border-color: ${props => props.theme.fg};
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
  margin-bottom: 0.5rem;
  display: flex;
  @media (max-width: 650px) {
    flex-direction: column;
    span:first-child {
      margin-bottom: ${props => props.isTags && '0.2rem'};
    }
  }
  > :first-child {
    min-width: 100px;
  }
`;

const StyledLink = styled(Link)`
  padding: 0.1rem 0.2rem;
  border: 1px solid ${props => props.theme.fg};
  border-radius: 2px;
  &,
  :visited {
    font-size: 0.75rem;
    text-decoration: none;
    color: ${props => props.theme.fg};
  }
  :not(:last-child) {
    margin-right: 0.5rem;
  }
  :hover {
    color: ${props => props.theme.fg};
    border: 1px solid ${props => props.theme.fg};
    background: ${props => props.theme.bgAlt};
  }
`;

export default function MangaInfoSkeleton(props) {
  const manga = props.manga;

  return (
    <React.Fragment>
      <StyledMangaInfoSkeleton>
        <Image src={manga.cover} alt={manga.title} />
        <div>
          <div>
            <h2>{manga.title}</h2>
            <hr />
          </div>

          <MangaInfoSkeletonSection label="Alt titles">
            {manga.alt_titles}
          </MangaInfoSkeletonSection>

          <MangaInfoSkeletonSection label="Tags" isTags={true}>
            {manga.tags &&
              manga.tags.map(tag => (
                <StyledLink to={tag.url} key={tag.id}>
                  #{tag.name}
                </StyledLink>
              ))}
          </MangaInfoSkeletonSection>

          <MangaInfoSkeletonSection label="Authors" isTags={true}>
            {manga.authors &&
              manga.authors.map(author => (
                <StyledLink to={author.url} key={author.id}>
                  {author.name}
                </StyledLink>
              ))}
          </MangaInfoSkeletonSection>

          <MangaInfoSkeletonSection label="Description">
            {manga.description}
          </MangaInfoSkeletonSection>
        </div>
      </StyledMangaInfoSkeleton>
    </React.Fragment>
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
