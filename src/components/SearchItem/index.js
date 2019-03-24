import React from 'react';
import styled from 'styled-components';
import Image from '../Image';

const StyledSearchItem = styled.a`
  display: flex;
  align-items: center;
  padding: 0.2rem 0.3rem;
  background: ${props => props.theme.bgAlt};
  color: ${props => props.theme.fgAlt};
  border: 2px solid ${props => props.theme.bgAlt};
  width: 100%;
  height: 100%;
  :hover {
    border: 2px solid ${props => props.theme.fg};
    color: ${props => props.theme.fg};
  }
  > :first-child {
    margin-right: 0.4rem;
  }
`;

export default function SearchItem({ title, url, thumbnail }) {
  return (
    <StyledSearchItem href={url} >
      <Image src={thumbnail} srcWebp={`${thumbnail}.webp`} alt={title} />
      <span>{title}</span>
    </StyledSearchItem>
  );
}
