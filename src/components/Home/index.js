import React, { useContext } from 'react';

import { UserContext } from 'context/UserContext';
import { useFetchDataApi } from 'hooks';

import MangaListSection from 'components/MangaListSection';
import MangaItem from 'components/MangaItem';

import FavoriteListSection from './FavoriteListSection';


export default function Home() {
  const user = useContext(UserContext);

  const [
    newChapterList,
    isNewChapterListLoading,
    isNewChapterListError,
  ] = useFetchDataApi('/release/chapters');

  const [
    newMangaList,
    isNewMangaListLoading,
    isNewMangaListError,
  ] = useFetchDataApi('/release/manga');

  return (
    <React.Fragment>
      <FavoriteListSection user={user} />
      <MangaListSection
        isLoading={isNewChapterListLoading}
        isError={isNewChapterListError}
        isRenderListEmpty={newChapterList && newChapterList.length === 0}
        section="new chapters"
        lists={
          newChapterList &&
          newChapterList.map(chapter => (
            <MangaItem
              key={chapter.id}
              url={chapter.url}
              title={chapter.manga.title}
              titleURL={chapter.manga.url}
              subTitle={chapter.title}
              src={chapter.manga.cover}
              alt={chapter.title}
            />
          ))
        }
      />
      <MangaListSection
        isLoading={isNewMangaListLoading}
        isError={isNewMangaListError}
        isRenderListEmpty={newMangaList && newMangaList.length === 0}
        section="new manga"
        lists={
          newMangaList &&
          newMangaList.map(manga => (
            <MangaItem
              key={manga.id}
              url={manga.url}
              title={manga.title}
              titleURL={manga.url}
              src={manga.cover}
              alt={manga.title}
            />
          ))
        }
      />
    </React.Fragment>
  );
}
