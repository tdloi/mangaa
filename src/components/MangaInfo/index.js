import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import {Link} from 'react-router-dom';
import 'styled-components/macro';

import { UserIdTokenContext } from 'context/UserIdTokenContext';
import { useFetchDataApi, useInterval } from 'hooks';

import Card from 'common/Card';
import Wrapper from 'components/Wrapper';
import { ButtonPrimary, ButtonSecondary } from 'common/Button';

import LoadingAndErrorWrapper from 'components/LoadingAndErrorWrapper';
import Loading from 'components/Loading';
import Comment from 'components/Comment';
import CommentsList from 'components/CommentsList';
import { NotFound } from 'components/Error';

import MangaInfoSkeleton from './MangaInfoSkeleton';
import MangaInfoChapters from './MangaInfoChapters';
import Rating from './Rating';
const ButtonAdd = styled(ButtonPrimary)`
  background: #63c2de;
  color: ${({ theme }) => theme.fg};
`
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
  const [comments, setComments] = useState([]);
  const [postCommentMessage, setPostCommentMessage] = useState(null);

  const [chapters, isLoadingChapters, isLoadChaptersError] = useFetchDataApi(
    `/manga/${mangaId}/chapters`
  );
  const loadComments = async () => {
    const host = process.env.REACT_APP_API || '';
    const response = await fetch(host + `/manga/${mangaId}/comments`);
    const commentsList = await response.json();
    setComments(commentsList);
  };
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
    loadComments();
  }, []);

  useInterval(() => {
    setPostCommentMessage(null);
  }, 5000);

  const onCommentSuccess = () => {
    setPostCommentMessage('Post new comment successful')
    loadComments();
  }

  const onCommentFailure = (message) => {
    const errorMessage = 'Something went wrong. Please try again' || message;
    setPostCommentMessage(errorMessage);
  }

  return (
    <LoadingAndErrorWrapper
      isLoading={isLoading}
      renderIsLoading={<Loading />}
      isError={isError || manga.code === 404}
      renderIsError={<NotFound />}
    >
      <MangaInfoSkeleton manga={manga}>
        <div
          css={`
            display: flex;
            button {
              margin-right: 1rem;
            }
          `}
        >
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
          <ButtonAdd as={Link} to={`/manga/new/${mangaId}`}>Thêm chapter</ButtonAdd>
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
            <h3>Comments:</h3>
            <span>{postCommentMessage}</span>
            <Comment
              match={match}
              onSuccess={() => onCommentSuccess()}
              onFailure={(message) => onCommentFailure(message)}
            />
            <CommentsList comments={comments} />
          </Card>
        </Wrapper>
      </LoadingAndErrorWrapper>
    </LoadingAndErrorWrapper>
  );
}
