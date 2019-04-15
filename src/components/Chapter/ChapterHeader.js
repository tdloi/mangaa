import React, { useState, useEffect } from 'react';

export default function ChapterHeader({
  onPrev,
  onNext,
  currentChapter,
  chapters,
  onSelect,
}) {
  const [selectedValue, setSelectedValue] = useState(currentChapter.id);

  useEffect(() => {
    if (currentChapter) {
      setSelectedValue(currentChapter.id);
    }
  }, [currentChapter]);

  return (
    <div>
      <button onClick={onPrev}>Prev</button>
      <select
        value={selectedValue}
        onChange={event => onSelect(event.target.value)}
      >
        {chapters.map(chapter => {
          const vol = chapter.vol ? `Vol ${chapter.vol} ` : '';
          const title = `${vol}Chapter ${chapter.chapter} - ${chapter.title}`;
          return <option key={chapter.id} value={chapter.id}>{title}</option>;
        })}
      </select>
      <button onClick={onNext}>Next</button>
    </div>
  );
}
