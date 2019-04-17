import React from 'react';
import styled from 'styled-components';
import 'styled-components/macro';

const StyledWrapper = styled.div`
  max-width: 1180px;
  padding: ${props => props.borderless ? 0 : '.5rem'};
  margin: auto;
`

export default function Wrapper(props) {
  return (
    <div css={`background: ${props => props.theme.bgAlt}`}>
      <StyledWrapper>{props.children}</StyledWrapper>
    </div>
  )
}
