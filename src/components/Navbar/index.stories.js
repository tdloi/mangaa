import React from 'react';
import { ThemeProvider } from 'styled-components';
import { storiesOf } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import NavbarPure from './NavbarPure';
import { theme } from '../../theme';

storiesOf('Navbar', module).add('default', () => (
  <ThemeProvider theme={theme.dark.nav}>
    <MemoryRouter>
      <NavbarPure />
    </MemoryRouter>
  </ThemeProvider>
));
