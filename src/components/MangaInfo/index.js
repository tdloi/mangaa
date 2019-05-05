import React, { useState, useEffect, useContext } from 'react';

import { UserIdTokenContext } from 'context/UserIdTokenContext'
import { useFetchDataApi } from 'hooks';

import LoadingAndErrorWrapper from 'components/LoadingAndErrorWrapper';
import Loading from 'components/Loading';
import Comment from 'components/Comment';
import Rating from 'components/Rating';
import { NotFound } from 'components/Error';

import MangaInfoSkeleton from './MangaInfoSkeleton';
import MangaInfoChapters from './MangaInfoChapters';

export default function MangaInfo({ match }) {
  const mangaId = match.params.id;
  const token = useContext(UserIdTokenContext);
  const [favorite, setFavorite] = useState(false);
  const [totalFavorite, setTotalFavorite] = useState(0);
  const [manga, isLoading, isError] = useFetchDataApi(
    `/manga/${mangaId}`,
    null,
    null,
    ''
  );

  const [chapters, isLoadingChapters, isLoadChaptersError] = useFetchDataApi(
    `/manga/${mangaId}/chapters`
  );

  const favoriteManga = async (method='POST') => {
    const host = process.env.REACT_APP_API || '';
    const response = await fetch(
      host + `/manga/${manga.id}/favorite`, 
      {
        method: method,
        headers: {
          Authorization: token,
        },
      }
    );
    const currentFavorite = await response.json();
    setTotalFavorite(currentFavorite.total);
    if (currentFavorite.status !== undefined) {
      setFavorite(currentFavorite.status);
    }
  }

  useEffect(() => {
    favoriteManga('GET');
  })

  return (
    <LoadingAndErrorWrapper
      isLoading={isLoading}
      renderIsLoading={<Loading />}
      isError={isError || manga.code === 404}
      renderIsError={<NotFound />}
    >
      <MangaInfoSkeleton manga={manga} favoriteButtonClick={() => favoriteManga()} favoriteButtonText={favorite ? 'Unfavorite' : 'Favorite'}/>
      <Rating mangaID={mangaId} />
      <hr />
      <LoadingAndErrorWrapper
        isLoading={isLoadingChapters}
        renderIsLoading={<Loading />}
        isError={isLoadChaptersError || (chapters && chapters.code === 404)}
        renderIsError={<NotFound />}
      >
        <MangaInfoChapters chapters={chapters} />
      </LoadingAndErrorWrapper>

      <Comment match={match} />
    </LoadingAndErrorWrapper>
  );
}
