import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const MangaInfoTag = styled(Link)`
  padding: 0.1rem 0.2rem;
  border: 1px solid ${props => props.theme.fg};
  border-radius: 2px;
  &,
  :visited {
    font-size: 0.75rem;
    text-decoration: none;
    color: ${props => props.theme.fg};
  }
  :not(:last-child) {
    margin-right: 0.5rem;
  }
  :hover {
    color: ${props => props.theme.fg};
    border: 1px solid ${props => props.theme.fg};
    background: ${props => props.theme.bgAlt};
  }
`;
