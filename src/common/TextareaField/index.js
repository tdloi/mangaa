import React from 'react';
import styled from 'styled-components';
import TextareaAutosize from 'react-textarea-autosize';

const StyledTextarea = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 0.75rem;

  label {
    color: ${({ theme }) => theme.fg}
    margin-top: 0.4rem;
    margin-bottom: 0.5rem;
  }

  textarea {
    width: 100%;
    border: 1px solid ${({ theme }) => theme.fgAlt};
    color: ${({ theme }) => theme.form.fg};
    caret-color: ${({ theme }) => theme.form.fg};
    background: ${({ theme }) => theme.form.bg};
    line-height: 1.5rem;
    padding: .5rem;
    :focus,
    :active {
      border-color: ${({ theme }) => theme.blue};
      box-shadow: 0 0 1px 1px ${({ theme }) => theme.blue};
    }
  }
`;

// Simple Textarea field, use slatejs instead for complex one
export default function TextareaField(props) {
  return (
    <StyledTextarea>
      <label>{props.label}</label>
      <TextareaAutosize 
        name={props.field}
        {...props} />
    </StyledTextarea>
  );
}
