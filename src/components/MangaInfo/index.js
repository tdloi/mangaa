import React, { useState, useEffect, useContext } from 'react';
import 'styled-components/macro';

import { UserIdTokenContext } from 'context/UserIdTokenContext';
import { useFetchDataApi } from 'hooks';

import Card from 'common/Card';
import Wrapper from 'components/Wrapper';
import { ButtonPrimary, ButtonSecondary } from 'common/Button';

import LoadingAndErrorWrapper from 'components/LoadingAndErrorWrapper';
import Loading from 'components/Loading';
import Comment from 'components/Comment';
import { NotFound } from 'components/Error';

import MangaInfoSkeleton from './MangaInfoSkeleton';
import MangaInfoChapters from './MangaInfoChapters';
import Rating from './Rating';

export default function MangaInfo({ match }) {
  const mangaId = match.params.id;
  const token = useContext(UserIdTokenContext);

  const [favorite, setFavorite] = useState(false);
  const [manga, isLoading, isError] = useFetchDataApi(
    `/manga/${mangaId}`,
    null,
    null,
    ''
  );

  const [chapters, isLoadingChapters, isLoadChaptersError] = useFetchDataApi(
    `/manga/${mangaId}/chapters`
  );

  const loadFavorite = async (method = 'POST') => {
    const host = process.env.REACT_APP_API || '';
    const response = await fetch(host + `/manga/${mangaId}/favorite`, {
      method: method,
      headers: {
        Authorization: token,
      },
    });
    const currentFavorite = await response.json();
    if (currentFavorite.status !== undefined) {
      setFavorite(currentFavorite.status);
    }
  };

  useEffect(() => {
    loadFavorite('GET');
  });

  return (
    <LoadingAndErrorWrapper
      isLoading={isLoading}
      renderIsLoading={<Loading />}
      isError={isError || manga.code === 404}
      renderIsError={<NotFound />}
    >
      <MangaInfoSkeleton manga={manga}>
        <div css={`display: flex; button { margin-right: 1rem;}`}>
          {!favorite ? (
            <ButtonPrimary onClick={() => loadFavorite()}>
              Favorite
            </ButtonPrimary>
          ) : (
            <ButtonSecondary onClick={() => loadFavorite()}>
              Unfavorite
            </ButtonSecondary>
          )}
          <Rating />
        </div>
      </MangaInfoSkeleton>

      <LoadingAndErrorWrapper
        isLoading={isLoadingChapters}
        renderIsLoading={<Loading />}
        isError={isLoadChaptersError || (chapters && chapters.code === 404)}
        renderIsError={<NotFound />}
      >
        <Wrapper>
          <Card>
            <MangaInfoChapters chapters={chapters} />
            <hr />
            <Comment match={match} />
          </Card>
        </Wrapper>
      </LoadingAndErrorWrapper>
    </LoadingAndErrorWrapper>
  );
}
