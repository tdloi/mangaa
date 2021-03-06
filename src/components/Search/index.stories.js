import React from 'react';
import { storiesOf } from '@storybook/react';
import styled from 'styled-components';
import Search from './index';

const searchItem = {
  thumbnail: '//source.unsplash.com/100x100',
  title: 'Dungeon ni Deai wo Motomeru no wa Machigatteiru Darou ka',
  url: '//web.dev',
};

const searchList = Array(10)
  .fill(searchItem)
  .map((item, index) => {
    item.id = index;
    return item;
  });

const Wrap = styled.div`
  width: 300px;
`

storiesOf('Search', module)
  .add('default', () => <Search lists={searchList} />)
  .add('is focus', () => <Search isFocus={true} lists={searchList} />)
  .add('is loading', () => <Search isLoading={true} lists={searchList} />)
  .add('inside container', () => <Wrap><Search isFocus={true} lists={searchList} /></Wrap>);
