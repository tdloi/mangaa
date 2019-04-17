import React from 'react';
import styled from 'styled-components';

const StyledMessage = styled.div`
  color: ${props => props.theme.fg};
  display: flex;
  justify-content: center;
  padding: 1.5rem;
`

export default function Message(props){
  return(
    <StyledMessage>
      <span>{props.content}</span>
    </StyledMessage>
  )
}
