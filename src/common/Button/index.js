import styled from 'styled-components';

export const Button = styled.button`
  appearance: none;
  text-decoration: none;
  outline: none;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: .5rem 1rem;
  display: flex;
  border: 1px solid ${({ theme }) => theme.border};
  color: 1px solid ${({ theme }) => theme.fg};
  border-radius: .25rem;
  margin: .25rem;

  :focus, :active, :visited {
    color: inherit;
    outline: none;
  }
  
  svg {
    margin-right: 8px;
  }
`

export const ButtonPrimary = styled(Button)`
  background: #1abc9c;
  border: 1px solid #1abc9c;
  color: #ecf0f1;
  :hover {
    box-shadow: 0 0 2px 0 ${({ theme }) => theme.fgAlt};
  }
  :focus, :active, :visited {
    color: #ecf0f1;
  }
`

export const ButtonSecondary = styled(Button)`
  background: #f86c6b;
  border: 1px solid #f86c6b;
  color: #fcffff;
  :hover {
    box-shadow: 0 0 2px 0 ${({ theme }) => theme.fgAlt};
  }
  :focus, :active, :visited {
    color: #fcffff;
  }
`
