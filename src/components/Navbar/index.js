import React from 'react';
import styled from 'styled-components';
import Logo from '../Logo';
import SearchWrapper from '../SearchWrapper';

const Wrapper = styled.div`
  background: ${props => props.theme.bg};
  @media (width <= 900) {
    padding: 0 1rem;
  }
`;

const StyledNavbar = styled.nav`
  background: ${props => props.theme.bg};
  color: ${props => props.theme.fg};
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1270px;
  margin: 0 auto;
  padding: 0 0.5rem;
  div {
    display: flex;
    justify-content: flex-end;
  }
  div:first-child {
    margin-right: 0.2rem;
  }
  div > a {
    width: 100px;
  }
`;

export default function Navbar() {
  return (
    <Wrapper>
      <StyledNavbar>
        <Logo />
        <div>
          <SearchWrapper />
          <a className="button is-primary" href="/login">
            Login
          </a>
        </div>
      </StyledNavbar>
    </Wrapper>
  );
}
