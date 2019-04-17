import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { storiesOf } from '@storybook/react';
import { theme } from '../../theme';

import MangaInfoSkeleton from './MangaInfoSkeleton';
import MangaInfoChapters from './MangaInfoChapters';
import Wrapper from '../Wrapper';

const manga = {
  alt_titles:
    'Very window area artist site challenge own physical pay forget night sure.',
  authors: [
    {
      id: 31,
      name: 'Bruce Soto',
      url: '/author/31',
    },
    {
      id: 60,
      name: 'Angelica Underwood',
      url: '/author/60',
    },
  ],
  cover: 'https://source.unsplash.com/featured/1000x1400?sig=36713',
  created: 1552734644,
  description:
    'Same weight instead arrive perhaps ground future player four hit movie article system with until interest list quality air special try accept herself walk agent everybody weight get rise toward soon partner many.',
  id: 3,
  tags: [
    {
      id: 20,
      name: 'edge',
      url: '/tag/edge',
    },
    {
      id: 35,
      name: 'personal',
      url: '/tag/personal',
    },
  ],
  title: 'camera card owner pick learn doctor position',
  url: '/manga/3/camera-card-owner-pick-learn-doctor-position',
};

storiesOf('MangaInfoSkeleton', module)
  .addDecorator(storyFn => <MemoryRouter>{storyFn()}</MemoryRouter>)
  .add('default', () => (
    <ThemeProvider theme={theme.light}>
      <Wrapper>
        <MangaInfoSkeleton manga={manga} />
      </Wrapper>
    </ThemeProvider>
  ))
  .add('with dark theme', () => (
    <ThemeProvider theme={theme.dark}>
      <Wrapper>
        <MangaInfoSkeleton manga={manga} />
      </Wrapper>
    </ThemeProvider>
  ));

const chapter = {
  chapter: 1,
  created: 1552734645,
  id: 1,
  manga: {
    cover: 'https://source.unsplash.com/featured/1000x1400?sig=36713',
    title: 'camera card owner pick learn doctor position',
    url: '/manga/3/camera-card-owner-pick-learn-doctor-position',
  },
  title: 'Show entire project lead medical science amount.',
  url: '/chapter/120',
  user: 'abcdef',
  vol: 1,
};

storiesOf('MangaInfoChapters', module)
  .addDecorator(storyFn => <MemoryRouter>{storyFn()}</MemoryRouter>)
  .add('with no chapters', () => <MangaInfoChapters chapters={[]} />)
  .add('with 10 chapters', () => (
    <MangaInfoChapters chapters={new Array(10).fill(chapter)} />
  ))
  .add('with 100 chapters', () => (
    <MangaInfoChapters chapters={new Array(100).fill(chapter)} />
  ))
  .add('with 1000 chapters', () => (
    <MangaInfoChapters chapters={new Array(1000).fill(chapter)} />
  ));
