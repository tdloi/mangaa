import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const StyledLogo = styled.span`
  display: inline-block;
  text-align: center;
  cursor: pointer;
  font-weight: bold;
  font-size: 1.25rem;
  padding: 0.2rem 0.5rem;
`;

export default function Logo() {
  return (
    <Link to="/">
      <StyledLogo>
        Mangaa
      </StyledLogo>
    </Link>
  );
}
