import React from 'react';
import { storiesOf } from '@storybook/react';
import ChapterHeader from './ChapterHeader';

const chapter = {
  chapter: 1,
  created: 1555469113,
  id: 1,
  lists: [],
  manga: {
    cover: 'https://source.unsplash.com/featured/1000x1400?sig=97820',
    id: 1,
    title: 'single morning your write form him eight turn difference article',
    url:
      '/manga/1/single-morning-your-write-form-him-eight-turn-difference-article',
  },
  title: 'abc',
  url: '/chapter/1',
  user: 'abc',
  vol: 1,
};

const chaptersList = [
  {
    chapter: 1,
    created: 1555333700,
    id: 1,
    manga: {
      cover: 'https://source.unsplash.com/featured/1000x1400?sig=97820',
      id: 1,
      title: 'Manga title',
      url: '/manga/1',
    },
    title: 'Chapter 1',
    url: '/chapter/1',
    user: 'abc',
    vol: null,
  },
  {
    chapter: 2,
    created: 1555332889,
    id: 2,
    manga: {
      cover: 'https://source.unsplash.com/featured/1000x1400?sig=97820',
      id: 1,
      title: 'Manga title',
      url: '/manga/1',
    },
    title: 'Chapter 2',
    url: '/chapter/2',
    user: 'abc',
    vol: null,
  },
];
storiesOf('ChapterHeader', module).add('default', () => (
  <ChapterHeader currentChapter={chapter} chapters={chaptersList} />
));
