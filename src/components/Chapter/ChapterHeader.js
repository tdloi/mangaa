import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import Wrapper from 'components/Wrapper';

const StyledButton = styled.button`
  appearance: none;
  padding: .4rem 2.5rem;
  background: ${props => (props.color ? props.color : '#a9ec8a')}
  outline: none;
  border: 1px solid;
  border-radius: 5px;
  text-align: center;
`;

const StyledSelect = styled.select`
  appearance: none;
  padding: 0.4rem 1.5rem;
  outline: none;
  border: 1px solid;
  border-radius: 5px;
  text-align: center;
  text-align-last: center; // Chrome
  margin: 0 1rem;
`;

const StyledChapterHeader = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin: 0.5rem 1rem;
`;

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
    <Wrapper>
      <StyledChapterHeader>
        <StyledButton onClick={onPrev}>Prev</StyledButton>
        <StyledSelect
          value={selectedValue}
          onChange={event => onSelect(event.target.value)}
        >
          {chapters.map(chapter => {
            const vol = chapter.vol ? `Vol ${chapter.vol} ` : '';
            const title = `${vol}Chapter ${chapter.chapter} - ${chapter.title}`;
            return (
              <option key={chapter.id} value={chapter.id}>
                {title}
              </option>
            );
          })}
        </StyledSelect>
        <StyledButton onClick={onNext}>Next</StyledButton>
      </StyledChapterHeader>
    </Wrapper>
  );
}
