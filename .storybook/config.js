import React from 'react';
import { addDecorator, addParameters, configure } from '@storybook/react';
import { ThemeProvider } from 'styled-components';
import { theme } from '../src/theme'

const req = require.context('../src/components', true, /\.stories\.js$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

addParameters({
  options: {
    showPanel: false
  }
})

addDecorator(
  storyFn => <ThemeProvider theme={theme.light}>{storyFn()}</ThemeProvider>
)

configure(loadStories, module);
