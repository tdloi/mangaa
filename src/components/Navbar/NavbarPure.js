import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import Logo from 'components/Logo';

const Wrapper = styled.div`
  ${({ theme }) => `
    background: ${theme.nav.bg};
    border-bottom: 2px solid ${theme.shadow};
  `}

  @media (width < 900) {
    padding: 0 1rem;
  }
`

const StyledNavbar = styled.nav`
  background: transparent;
  color: ${({ theme }) => theme.fg};
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1180px;
  margin: 0 auto;
  padding: 0 0.5rem;

  div {
    display: flex;
    justify-content: flex-end;
  }
  div:first-child {
    margin-right: 0.2rem;
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  padding: .5rem 1rem;
  border: 1px solid #1abc9c;
  border-radius: 5px;
  background: #1abc9c;
  color: #ecf0f1;
  :hover {
    box-shadow: 0 0 2px 0 ${({ theme }) => theme.fgAlt};
  }
`

const SignOutLink = styled(StyledLink)`
  background: tomato;
  border: 1px solid tomato;
  color: #333;
`

export default function NavbarPure(props) {
  // Workaround storybook bug with core-js v3, which is firebase dependencies
  return (
    <Wrapper>
      <StyledNavbar>
        <Logo />
        <div>
          {props.user ? (
            <SignOutLink to="#" onClick={props.signOut}>
              Sign out
            </SignOutLink>
          ) : (
            <StyledLink to="/signin">
              Sign in
            </StyledLink>
          )}
        </div>
      </StyledNavbar>
    </Wrapper>
  );
}
