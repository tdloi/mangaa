import React from 'react';
import styled from 'styled-components';
import firebase from '../../firebase';
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

export default function Navbar({ user }) {
  return (
    <Wrapper>
      <StyledNavbar>
        <Logo />
        <div>
          <SearchWrapper />
          {user ? (
            <span
              className="button is-danger"
              onClick={() => firebase.auth().signOut()}
            >
              Sign out
            </span>
          ) : (
            <a className="button is-primary" href="/signin">
              Sign in
            </a>
          )}
        </div>
      </StyledNavbar>
    </Wrapper>
  );
}
