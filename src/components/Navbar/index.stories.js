import React from 'react';
import { ThemeProvider } from 'styled-components';
import { storiesOf } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';

import { theme } from 'theme';

import NavbarPure from './NavbarPure';

storiesOf('Navbar', module)
  .add('default', () => (
    <ThemeProvider theme={theme.dark.nav}>
      <MemoryRouter>
        <NavbarPure />
      </MemoryRouter>
    </ThemeProvider>
  ))
  .add('with dark theme', () => (
    <ThemeProvider theme={theme.dark.nav}>
      <MemoryRouter>
        <NavbarPure />
      </MemoryRouter>
    </ThemeProvider>
  ));
