import React from 'react';
import styled from 'styled-components';

const StyledCard = styled.div`
  flex: 1 1 auto;
  padding: 1.25rem;
  position: relative;
  background-color: ${({ theme }) => theme.bg};
  border-radius: .25rem;
  border: 1px solid ${({ theme }) => theme.border};

  ${({ borderless }) => borderless && `
    border: none;
  `}
`


export default function Card(props) {
  return(
    <StyledCard>
      {props.children}
    </StyledCard>
  )
}
