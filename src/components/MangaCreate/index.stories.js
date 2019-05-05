import React from 'react';
import { storiesOf } from '@storybook/react';
import { ThemeProvider } from 'styled-components';

import { theme } from 'theme';

import MangaCreate from './index';

storiesOf('MangaCreate', module)
  .add('default', () => (
    <ThemeProvider theme={theme.light}>
        <MangaCreate />
    </ThemeProvider>
  ))
  .add('with dark theme', () => (
    <ThemeProvider theme={theme.dark}>
        <MangaCreate />
    </ThemeProvider>
  ))
