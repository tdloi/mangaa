import React from 'react';
import styled from 'styled-components';

const StyledWrapper = styled.div`
  max-width: 1180px;
  padding: ${props => props.borderless ? 0 : '1.5rem'};
  margin: auto;
`

export default function Wrapper(props) {
  return (
    <StyledWrapper>{props.children}</StyledWrapper>
  )
}
