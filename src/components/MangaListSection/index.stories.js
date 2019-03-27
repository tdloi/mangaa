import React from 'react';
import { storiesOf } from '@storybook/react';
import { ThemeProvider } from 'styled-components';
import MangaListSection from './index';
import MangaItem from '../MangaItem';
import '../../index.css';
import { theme } from '../../theme';

const manga = {
  url: 'https://mdn.dev',
  title: 'Manga title',
  subTitle: 'Manga subtitle',
  src: 'https://source.unsplash.com/1000x1400',
  alt: 'alt text',
};

const mangaList = Array(10).fill(manga);

storiesOf('MangaListSection', module)
  .add('default', () => (
    <MangaListSection
      section="Following"
      lists={mangaList.map(item => (
        <MangaItem key={item.id} {...item} />
      ))}
    />
  ))
  .add('with dark theme', () => (
    <ThemeProvider theme={theme.dark}>
      <MangaListSection
        section="Following"
        lists={mangaList.map(item => (
          <MangaItem key={item.id} {...item} />
        ))}
      />
    </ThemeProvider>
  ))
  .add('with two sections', () => (
    <React.Fragment>
      <MangaListSection
        section="Following"
        lists={mangaList.map(item => (
          <MangaItem key={item.id} {...item} />
        ))}
      />{' '}
      <MangaListSection
        section="New chapter"
        lists={mangaList.map(item => (
          <MangaItem key={item.id} {...item} />
        ))}
      />
    </React.Fragment>
  ));
