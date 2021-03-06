import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import SearchItem from '../SearchItem';

const StyledSearch = styled.div`
  position: relative;
  background: ${props => props.theme.bgAlt};
  color: ${props => props.theme.fgAlt};
  // visibility: hide;
  > :first-child {
    margin-bottom: 0; // margin-bottom of .field
  }
  .results {
    position: absolute;
    width: 100%;
    left: 0;
  }
`;

export default function Search({
  isFocus,
  isLoading,
  value,
  lists,
  onChange,
  onClick,
}) {
  return (
    <StyledSearch>
      <div>
        <div
        >
          <input
            type="text"
            placeholder="Search manga title"
            value={value}
            onChange={onChange}
          />
          <span>
            <FontAwesomeIcon icon={faSearch} />
          </span>
          {isFocus && (
            <span onClick={onClick}>
              <FontAwesomeIcon icon={faTimes} />
            </span>
          )}
        </div>
      </div>
      {isFocus && (
        <div className="results">
          {lists.map(item => (
            <SearchItem key={item.id} {...item} />
          ))}
        </div>
      )}
    </StyledSearch>
  );
}
