import React from 'react';
import styled from 'styled-components';
import Image from '../Image';
import PropTypes from 'prop-types';

const StyledMangaItem = styled.a`
  display: grid;
  grid-template-rows: repeat(11, 1fr);
  width: ${props => props.width};
  text-decoration: none;
  & > picture {
    grid-column-start: 1;
    grid-row: 1 / 12;
    margin: 0 auto;
  }
  & > a {
    display: flex;
    align-items: center;
    margin: 0;
    padding: 0 0.5rem;
    background: #33757d;
    color: whitesmoke;
    opacity: 0.8;
    text-decoration: none;
    overflow: hidden;
  }
  & > a > span {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  & > a:first-of-type {
    grid-column-start: 1;
    grid-row: 10/11;
    font-weight: bold;
  }
  & > a:last-child {
    grid-column-start: 1;
    grid-row: 11/12;
  }
`;

export default function MangaItem({
  url,
  title,
  titleURL,
  subTitle,
  subTitleURL,
  width,
  ...rest // src, alt, srcWebp
}) {
  return (
    <StyledMangaItem width={width} href={url}>
      <Image {...rest} />
      <a title={title} href={titleURL || url}>
        <span>{title}</span>
      </a>
      <a title={subTitle} href={subTitleURL || url}>
        <span>{subTitle}</span>
      </a>
    </StyledMangaItem>
  );
}

MangaItem.prototype = {
  url: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  subTitle: PropTypes.string.isRequired,
  width: PropTypes.string.isRequired,
};
