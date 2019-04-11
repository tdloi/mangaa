import React from 'react';
import { storiesOf } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import Logo from './index';

storiesOf('Logo', module)
  .add('mangaa', () => (
    <MemoryRouter>
      <Logo />
    </MemoryRouter>
  ))
