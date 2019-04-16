import React from 'react';
import { Link } from 'react-router-dom';
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

export default function NavbarPure(props) {
  // Workaround storybook bug with core-js v3, which is firebase dependencies
  return (
    <Wrapper>
      <StyledNavbar>
        <Logo />
        <div>
          <SearchWrapper />
          {props.user ? (
            <span onClick={props.signOut}>
              Sign out
            </span>
          ) : (
            <Link to="/signin">
              Sign in
            </Link>
          )}
        </div>
      </StyledNavbar>
    </Wrapper>
  );
}
