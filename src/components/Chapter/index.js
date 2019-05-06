import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'styled-components/macro';

import { useFetchGetDataApi, useKeyDown } from 'hooks';
import Image from 'components/Image';
import { NotFound } from 'components/Error';
import Wrapper from 'components/Wrapper';

import ChapterHeader from './ChapterHeader';

export default function Chapter(props) {
  const chapterID = props.match.params.id;
  const chapter = useFetchGetDataApi(`/chapter/${chapterID}`, '', '', '');

  const [chaptersList, setChaptersList] = useState([]);
  useEffect(() => {
    if (!chapter) return;
    // I wish I can use useFetch here
    const fetchChaptersList = async () => {
      const host = process.env.REACT_APP_API || '';
      const response = await fetch(
        host + `/manga/${chapter.manga.id}/chapters`
      );
      setChaptersList(await response.json());
    };
    fetchChaptersList();
  }, [chapter]);

  const nextChapter = useFetchGetDataApi(
    `/chapter/${chapterID}/next`,
    null,
    null,
    ''
  );
  const prevChapter = useFetchGetDataApi(
    `/chapter/${chapterID}/prev`,
    null,
    null,
    ''
  );

  const goToChapter = (destinationChapter, currentChapter) => {
    if (destinationChapter.id == null) {
      const manga = currentChapter.manga || '';
      props.history.push(`/manga/${manga.id}`);
      return;
    }
    props.history.push(`/chapter/${destinationChapter.id}`);
  };

  useKeyDown(['ArrowRight'], () => goToChapter(nextChapter, chapter));
  useKeyDown(['ArrowLeft'], () => goToChapter(prevChapter, chapter));

  if (chapter && chapter.lists == null) {
    return <NotFound />;
  }

  return (
    <div>
      <Wrapper>
        <div
          css={`
            margin-left: 1rem;
          `}
        >
          {chapter && chapter.manga && (
            <Link
              css={`
                text-decoration: none;
              `}
              to={chapter.manga.url}
            >
              &lt;&lt; Back to manga {chapter.manga.title} page{' '}
            </Link>
          )}
        </div>
      </Wrapper>
      <ChapterHeader
        onPrev={() => goToChapter(prevChapter, chapter)}
        onNext={() => goToChapter(nextChapter, chapter)}
        currentChapter={chapter}
        chapters={chaptersList}
        onSelect={selectedChapterID =>
          props.history.push(`/chapter/${selectedChapterID}`)
        }
      />
      <div
        css={`
          background: ${props => props.theme.bgAlt};
        `}
      >
        {chapter && chapter.lists && chapter.lists.length !== 0
          ? chapter.lists.map(img => (
              <Image
                src={img.url}
                alt={chapter.title}
                srcWebp={`${img.url}.webp`}
                key={img.url}
              />
            ))
          : 'This chapter is empty'}
      </div>
    </div>
  );
}
