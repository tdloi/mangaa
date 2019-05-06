import React from 'react';
import styled from 'styled-components';

const StyledChapterCreateImageView = styled.div`
  border: 2px dashed ${({ theme }) => theme.fg};
  padding: 1rem;
  min-height: 200px;
  div {
    margin: auto;
  }
  img {
    width: 100%;
    max-width: 250px;
  }
  img:not(:last-child) {
    margin-right: 1rem;
    margin-top: 0.5rem;
  }
`;

export default function ChapterCreateImageView({ listImages }) {
  return (
    <StyledChapterCreateImageView>
      <div>
        {listImages.map(image => (
          <img src={image} alt="upload file" />
        ))}
      </div>
    </StyledChapterCreateImageView>
  );
}
