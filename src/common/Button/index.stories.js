import React from 'react';
import { storiesOf } from '@storybook/react';
import { ThemeProvider } from 'styled-components';
import { MemoryRouter, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

import { theme } from 'theme';
import 'sanitize.css'

import { Button, ButtonPrimary, ButtonSecondary } from './index';

storiesOf('Button', module).add('default', () => (
  <ThemeProvider theme={theme.light}>
    <MemoryRouter>
      <Button>Base button</Button>
      <Button as={Link}>Link button</Button>
      <ButtonPrimary>Primary</ButtonPrimary>
      <ButtonSecondary>Secondary</ButtonSecondary>
      <Button><FontAwesomeIcon icon={faTimes} /> Icon</Button>
                    

    </MemoryRouter>
  </ThemeProvider>
));
