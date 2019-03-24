import React from 'react';
import { storiesOf } from '@storybook/react';
import { ThemeProvider } from 'styled-components';
import SearchItem from './index';
import { theme } from '../../theme';

storiesOf('SearchItem', module)
  .add('with light theme', () => (
    <ThemeProvider theme={theme.light}>
      <SearchItem
        thumbnail="//source.unsplash.com/100x100"
        title="Dungeon ni Deai wo Motomeru no wa Machigatteiru Darou ka"
        url="//web.dev"
      />
    </ThemeProvider>
  ))
  .add('with dark theme', () => (
    <ThemeProvider theme={theme.dark}>
      <SearchItem
        thumbnail="//source.unsplash.com/100x100"
        title="Dungeon ni Deai wo Motomeru no wa Machigatteiru Darou ka"
        url="//web.dev"
      />
    </ThemeProvider>
  ));
