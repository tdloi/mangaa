import React from 'react';
import MangaListSection from '../MangaListSection';
import MangaItem from '../MangaItem';
import Message from '../Message';
import { useFetchDataApi, useFirebaseIdToken } from '../../hooks';

export default function FavoriteListSection({ user }) {
  const idToken = useFirebaseIdToken(user);
  // there is a time lag when current user is loaded so idtoken is null
  // at that time
  return (
    <React.Fragment>
      {idToken && <FavoriteList user={user} idToken={idToken} />}
    </React.Fragment>
  );
}

function FavoriteList({ user, idToken }) {
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
        section="Favorite Realease"
        lists={<Message content={favoriteList.message} />}
      />
    );
  }

  return (
    <React.Fragment>
      {user && (
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
      )}
    </React.Fragment>
  );
}
