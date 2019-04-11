import React from 'react';
import { storiesOf } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import MangaItem from './index';

const mangaItemProps = {
  url: 'https://mdn.dev',
  title: 'Manga title',
  titleURL: 'https://github.com',
  subTitle: 'New Manga chapter',
  src: 'https://source.unsplash.com/1000x1400',
  width: '300px',
};

storiesOf('MangaItem', module)
  .addDecorator(storyFn => <MemoryRouter>{storyFn()}</MemoryRouter>)
  .add('default', () => <MangaItem {...mangaItemProps} />)
  .add('width long text', () => (
    <MangaItem
      {...mangaItemProps}
      title="this is a super long long long long long title"
      subTitle="this is a super long long long long long subTitle"
    />
  ))
  .add('with small image', () => (
    <MangaItem
      {...mangaItemProps}
      src="https://source.unsplash.com/200x300"
      width="250px"
    />
  ));
