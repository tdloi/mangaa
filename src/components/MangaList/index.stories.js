import React from 'react';
import { storiesOf } from '@storybook/react';
import MangaList from './index';

const manga = {
  url: 'https://mdn.dev',
  title: 'Manga title',
  subTitle: 'Manga subtitle',
  src: 'https://source.unsplash.com/1000x1400',
  alt: 'alt text',
}

const mangaList = Array(10).fill(manga);

storiesOf('MangaList', module)
  .add('with 320px width', () => (
    <MangaList lists={mangaList} />
  ), { viewport: { defaultViewport: 'iphone5' }})
  .add('with 540px width', () => (
    <MangaList lists={mangaList} />
  ), { viewport: { defaultViewport: 'pixel' }})
  .add('default', () => (
    <MangaList lists={mangaList} />
  ))
