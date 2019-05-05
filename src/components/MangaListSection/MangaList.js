import styled from 'styled-components';

export const MangaList = styled.section`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 10px;
  @media (min-width: 540px) and (max-width: 900px) {
    grid-template-columns: repeat(3, 1fr);
    > :last-child {
      display: none;
    }
  };
  @media (min-width: 900px) {
    grid-template-columns: repeat(5, 1fr);
  }
`;
