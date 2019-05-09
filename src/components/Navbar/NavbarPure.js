import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import { Button, ButtonPrimary, ButtonSecondary } from 'common/Button';
import Logo from 'components/Logo';

const Wrapper = styled.div`
  ${({ theme }) => `
    background: ${theme.bg};
  `}

  @media (width < 900) {
    padding: 0 1rem;
  }
`

const StyledNavbar = styled.nav`
  background: transparent;
  color: ${({ theme }) => theme.fg};
  height: 50px;
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

const ButtonAdd = styled(ButtonPrimary)`
  background: #63c2de;
  color: ${({ theme }) => theme.fg};
`

export default function NavbarPure(props) {
  // Workaround storybook bug with core-js v3, which is firebase dependencies
  return (
    <Wrapper>
      <StyledNavbar>
        <div>
          <Logo />
          <ButtonAdd as={Link} to="/manga/new"><FontAwesomeIcon icon={faPlus} />Manga</ButtonAdd>
        </div>
        <div>
          {props.user ? (
            <ButtonSecondary as={Link} to="#" onClick={props.signOut}>
              Sign out
            </ButtonSecondary>
          ) : (
            <ButtonPrimary as={Link} to="/signin">
              Sign in
            </ButtonPrimary>
          )}
        </div>
      </StyledNavbar>
    </Wrapper>
  );
}
