import React, { useState, useEffect } from 'react';
import { NotFound } from '../Error';
import { useFetchGetDataApi, useKeyDown } from '../../hooks';
import ChapterHeader from './ChapterHeader';
import Image from '../Image';

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
      <ChapterHeader
        onPrev={() => goToChapter(prevChapter, chapter)}
        onNext={() => goToChapter(nextChapter, chapter)}
        currentChapter={chapter}
        chapters={chaptersList}
        onSelect={selectedChapterID =>
          props.history.push(`/chapter/${selectedChapterID}`)
        }
      />
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
  );
}
