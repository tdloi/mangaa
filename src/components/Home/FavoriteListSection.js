import React, { useContext } from 'react';

import { UserIdTokenContext } from 'context/UserIdTokenContext';
import { useFetchDataApi } from 'hooks';

import MangaListSection from 'components/MangaListSection';
import MangaItem from 'components/MangaItem';
import Message from 'components/Message';

export default function FavoriteListSection() {
  const idToken = useContext(UserIdTokenContext);

  return (
    <React.Fragment>
      {idToken && <FavoriteList idToken={idToken} />}
    </React.Fragment>
  );
}

function FavoriteList({ idToken }) {
  const [
    favoriteList,
    isFavoriteListLoading,
    isFavoriteListError,
  ] = useFetchDataApi(
    '/release/following',
    {
      headers: {
        Authorization: idToken,
      },
    },
    idToken
  );

  if (favoriteList && favoriteList.code) {
    return (
      <MangaListSection
        section="favorite realease"
        lists={<Message content={favoriteList.message} />}
      />
    );
  }

  return (
    <React.Fragment>
        <MangaListSection
          isLoading={isFavoriteListLoading}
          isError={isFavoriteListError}
          isRenderListEmpty={favoriteList && favoriteList.length === 0}
          section="Favorite Realease"
          lists={
            favoriteList &&
            favoriteList.map(chapter => (
              <MangaItem
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
    </React.Fragment>
  );
}
