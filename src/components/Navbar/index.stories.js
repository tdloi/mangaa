import React from 'react';
import { ThemeProvider } from 'styled-components'
import { storiesOf } from '@storybook/react';
import Navbar from './index';
import { theme } from '../../theme';

storiesOf('Navbar', module)
  .add('default', () => (
    <ThemeProvider theme={theme.dark.nav} >
      <Navbar />
    </ThemeProvider>
  ))
