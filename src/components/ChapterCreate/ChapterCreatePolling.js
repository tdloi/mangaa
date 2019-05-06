import React, { useState } from 'react';
import styled from 'styled-components';
import LinearProgress from '@material-ui/core/LinearProgress';

import { useInterval } from 'hooks';
import Wrapper from 'components/Wrapper';

import ChapterCreateImageView from './ChapterCreateImageView';

const StyledChapterCreatePolling = styled.div`
  div:first-child {
    margin-bottom: .5rem;
  }
`;

export default function ChapterCreatePolling({ taskID, history }) {
  const [images, setImages] = useState([]);
  const [delay, setDelay] = useState(2000);
  const [next, setNext] = useState('');

  useInterval(async () => {
    const res = await fetch(taskID);
    const response = await res.json();

    if (response.results != null) {
      setImages(response.results);
    }
    if (response.status === 'Completed') {
      setDelay(null);
      setNext(response.location);
    }
  }, delay);

  useInterval(() => {
    if (delay == null) {
      history.push(next);
    }
  }, 3000)

  return (
    <Wrapper>
      <StyledChapterCreatePolling>
        {delay != null ? (
          <div>
            <h2>Uploading your manga...</h2>
            <LinearProgress />
          </div>
        ) : (
          <h2>Upload completed. You will be redirect in 3 seconds</h2>
        )}

        <ChapterCreateImageView listImages={images} />
      </StyledChapterCreatePolling>
    </Wrapper>
  );
}
