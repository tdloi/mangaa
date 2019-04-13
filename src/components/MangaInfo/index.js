import React from 'react';
import { useFetchDataApi } from '../../hooks';
import MangaInfoSkeleton from './MangaInfoSkeleton';
import MangaInfoChapters from './MangaInfoChapters';
import LoadingAndErrorWrapper from '../LoadingAndErrorWrapper';
import Loading from '../Loading';
import { NotFound } from '../Error';

export default function MangaInfo({ match }) {
  const mangaId = match.params.id;
  const [manga, isLoading, isError] = useFetchDataApi(
    `/manga/${mangaId}`,
    null,
    null,
    ''
  );

  const [chapters, isLoadingChapters, isLoadChaptersError] = useFetchDataApi(
    `/manga/${mangaId}/chapters`
  );

  return (
    <LoadingAndErrorWrapper
      isLoading={isLoading}
      renderIsLoading={<Loading />}
      isError={isError || manga.code === 404}
      renderIsError={<NotFound />}
    >
      <MangaInfoSkeleton manga={manga} />
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
