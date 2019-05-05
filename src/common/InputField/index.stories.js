import React from 'react';
import { storiesOf } from '@storybook/react';
import { ThemeProvider } from 'styled-components';

import { theme } from 'theme';
import Wrapper from 'components/Wrapper';

import InputField from './index';

storiesOf('InputField', module)
  .add('default', () => (
    <ThemeProvider theme={theme.light}>
      <Wrapper>
        <InputField label="title" value="input value" />
      </Wrapper>
    </ThemeProvider>
  ))
  .add('with dark theme', () => (
    <ThemeProvider theme={theme.dark}>
      <Wrapper>
        <InputField label="title" value="input value" />
      </Wrapper>
    </ThemeProvider>
  ))
  .add('with two field', () => (
    <ThemeProvider theme={theme.dark}>
      <Wrapper>
        <InputField label="Title" value="input value" />
        <InputField label="Alt Title" value="input value" />
      </Wrapper>
    </ThemeProvider>
  ));
