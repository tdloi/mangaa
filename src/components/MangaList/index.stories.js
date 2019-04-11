import React from 'react';
import { storiesOf } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { MangaList } from './index';
import MangaItem from '../MangaItem';

const manga = {
  url: 'https://mdn.dev',
  title: 'Manga title',
  subTitle: 'Manga subtitle',
  src: 'https://source.unsplash.com/1000x1400',
  alt: 'alt text',
};

const mangaList = Array(10).fill(manga);

storiesOf('MangaList', module)
  .addDecorator(storyFn => <MemoryRouter>{storyFn()}</MemoryRouter>)
  .add(
    'with 320px width',
    () => (
      <MangaList>
        {mangaList.map(item => (
          <MangaItem key={item.id} {...item} />
        ))}
      </MangaList>
    ),
    { viewport: { defaultViewport: 'iphone5' } }
  )
  .add(
    'with 540px width',
    () => (
      <MangaList>
        {mangaList.map(item => (
          <MangaItem key={item.id} {...item} />
        ))}
      </MangaList>
    ),
    { viewport: { defaultViewport: 'pixel' } }
  )
  .add('default', () => (
    <MangaList>
      {mangaList.map(item => (
        <MangaItem key={item.id} {...item} />
      ))}
    </MangaList>
  ));
