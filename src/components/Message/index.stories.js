import React from 'react';
import { storiesOf } from '@storybook/react';
import Message from './index';

storiesOf('Message', module)
  .add('default', () => (
    <Message content="Lorem Issump" />
  ))
  .add('with border', () => (
    <div style={{width: '900px', border: '1px solid black'}}>
      <Message content="Lorem Issump" />
    </div>
  ))
