import React from 'react';
import { storiesOf } from '@storybook/react';
import { ThemeProvider } from 'styled-components';
import { MemoryRouter } from 'react-router-dom';
import MangaListSection from './index';
import MangaItem from '../MangaItem';
import Message from '../Message';
import Wrapper from '../Wrapper';
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

const RenderMangaList = ({ section }) => (
  <MangaListSection
    section={section}
    lists={mangaList.map((item, index) => (
      <MangaItem key={index} {...item} />
    ))}
  />
);

storiesOf('MangaListSection', module)
  .addDecorator(storyFn => <MemoryRouter>{storyFn()}</MemoryRouter>)
  .add('default', () => <RenderMangaList section="Following" />)
  .add('with two sections', () => (
    <React.Fragment>
      <RenderMangaList section="Following" />
      <RenderMangaList section="New Chapter" />
    </React.Fragment>
  ))
  .add('with only message', () => (
    <React.Fragment>
      <MangaListSection
        section="Following"
        lists={<Message content="There are no new chapters available" />}
      />
    </React.Fragment>
  ))
  .add('with wrapper', () => (
    <Wrapper>
      <RenderMangaList section="Following" />
    </Wrapper>
  ))
  .add('with dark theme wrapper', () => (
    <ThemeProvider theme={theme.dark}>
      <Wrapper>
        <RenderMangaList section="Following" />
      </Wrapper>
    </ThemeProvider>
  ))
  .add('is loading', () => (
    <MangaListSection
      isLoading={true}
      section="Following"
      lists={<Message content="There are no new chapters available" />}
    />
  ))
  .add('is error', () => (
    <MangaListSection
      isError={true}
      section="Following"
      lists={<Message content="There are no new chapters available" />}
    />
  ));
