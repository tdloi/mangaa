import styled from 'styled-components';

export const StyledChapterCreate = styled.div`
  margin: 0.5rem;
  padding: 1.5rem;
  padding-top: 0.5rem;
  color: ${({ theme }) => theme.fg};
  background: ${({ theme }) => theme.bg};
  h2 {
    text-align: center;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid ${({ theme }) => theme.shadow};
  }
  form {
    display: flex;
    flex-direction: column;
  }
  form > .vol-chapter {
    display: flex;
    justify-content: space-between;
    > div {
      width: 100%;
    }
    > div:first-child {
      margin-right: 2rem;
    }
  }
  form > input[type='submit'] {
    margin-top: 0.75rem;
    margin-bottom: 0.75rem;
    padding: 0.55rem 1rem;
    appearance: none;
    border: 1px solid ${({ theme }) => theme.fg};
    border-radius: 5px;
    :hover {
      border-color: ${({ theme }) => theme.bgAlt};
      box-shadow: 0 0 2px 0 ${({ theme }) => theme.fgAlt};
    }
  }
  form > .files {
    label {
      position: relative;
    }
    input {
      opacity: 0;
    }

  }
`;
