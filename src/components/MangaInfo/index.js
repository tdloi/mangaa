import React, { useState, useEffect } from 'react';
import { useFetchDataApi, useFirebaseIdToken, useFirebaseUser } from '../../hooks';
import MangaInfoSkeleton from './MangaInfoSkeleton';
import MangaInfoChapters from './MangaInfoChapters';
import LoadingAndErrorWrapper from '../LoadingAndErrorWrapper';
import Loading from '../Loading';
import { NotFound } from '../Error';

export default function MangaInfo({ match }) {
  const mangaId = match.params.id;
  const user = useFirebaseUser();
  const token = useFirebaseIdToken(user);
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
    console.log(favorite);
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
      <MangaInfoSkeleton user={user} manga={manga} favoriteButtonClick={() => favoriteManga()} favoriteButtonText={favorite ? 'Unfavorite' : 'Favorite'}/>
      <hr />
      <LoadingAndErrorWrapper
        isLoading={isLoadingChapters}
        renderIsLoading={<Loading />}
        isError={isLoadChaptersError || (chapters && chapters.code === 404)}
        renderIsError={<NotFound />}
      >
        <MangaInfoChapters chapters={chapters} />
      </LoadingAndErrorWrapper>
    </LoadingAndErrorWrapper>
  );
}
