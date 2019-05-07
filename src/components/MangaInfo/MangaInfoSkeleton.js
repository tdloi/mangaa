import React from 'react';
import styled from 'styled-components';

import Card from 'common/Card';
import Wrapper from 'components/Wrapper';
import Image from 'components/Image';

import { MangaInfoTag } from './MangaInfoTag';
import { MangaInfoSection } from './MangaInfoSection';
import { MangaInfoAction } from './MangaInfoAction';

const StyledMangaInfoSkeleton = styled.section`
  display: grid;
  grid-template-columns: 1fr 2fr;
  grid-column-gap: 1.5rem;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
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

export default function MangaInfoSkeleton(props) {
  const manga = props.manga;

  return (
    <Wrapper>
      <Card>
        <StyledMangaInfoSkeleton>
          <Image src={manga.cover} alt={manga.title} />
          <div>
            <div>
              <h2>{manga.title}</h2>
              <hr />
            </div>

            <MangaInfoSection label="Alt titles">
              {manga.alt_titles}
            </MangaInfoSection>

            <MangaInfoSection label="Tags" isTags={true}>
              {manga.tags &&
                manga.tags.map(tag => (
                  <MangaInfoTag to={tag.url} key={tag.id}>
                    #{tag.name}
                  </MangaInfoTag>
                ))}
            </MangaInfoSection>

            <MangaInfoSection label="Authors" isTags={true}>
              {manga.authors &&
                manga.authors.map(author => (
                  <MangaInfoTag to={author.url} key={author.id}>
                    {author.name}
                  </MangaInfoTag>
                ))}
            </MangaInfoSection>

            <MangaInfoSection label="Description">
              {manga.description}
            </MangaInfoSection>
            
            {props.children}
          </div>
        </StyledMangaInfoSkeleton>
      </Card>
    </Wrapper>
  );
}
