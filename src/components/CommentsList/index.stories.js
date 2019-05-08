import React from 'react';
import { storiesOf } from '@storybook/react';
import { ThemeProvider } from 'styled-components';

import { theme } from 'theme';
import 'sanitize.css'

import CommentsList from './index';

const comments = [
  {
    content: '<p>hello world</p>',
    id: 1,
    user: 'abc'
  },
  {
    content: '<p>hello <b>world</b></p>',
    id: 2,
    user: 'abc'
  }
]

storiesOf('CommentsList', module).add('default', () => (
  <ThemeProvider theme={theme.light} >
                    
    <CommentsList comments={comments} />
  </ThemeProvider>
));
