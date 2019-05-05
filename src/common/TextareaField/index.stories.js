import React from 'react';
import { storiesOf } from '@storybook/react';
import { ThemeProvider } from 'styled-components';

import { theme } from 'theme';
import Wrapper from 'components/Wrapper';

import TextareaField from './index';

storiesOf('TextareaField', module)
  .add('default', () => (
    <ThemeProvider theme={theme.light}>
      <Wrapper>
        <TextareaField label="title" value="input value" />
      </Wrapper>
    </ThemeProvider>
  ))
  .add('with dark theme', () => (
    <ThemeProvider theme={theme.dark}>
      <Wrapper>
        <TextareaField label="title" value="input value" />
      </Wrapper>
    </ThemeProvider>
  ))
  .add('with two field', () => (
    <ThemeProvider theme={theme.dark}>
      <Wrapper>
        <TextareaField label="Title" value="input value" />
        <TextareaField label="Alt Title" value="input value" />
      </Wrapper>
    </ThemeProvider>
  ));
