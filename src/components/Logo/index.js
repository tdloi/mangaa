import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const StyledLogo = styled(Link)`
  cursor: pointer;
  display: inline-block;
  text-align: center;
  text-decoration: none;
  font-weight: bold;
  font-size: 1.25rem;
  padding: 0.2rem 0.5rem;
  &, :active, :focus {
    color: ${props => props.theme.fg};
    text-shadow: 2px 1px 3px ${props => props.theme.fgAlt};
    outline: none;
  }
`;

export default function Logo() {
  return (
    <StyledLogo to="/">
      Mangaa
    </StyledLogo>
  );
}
