import React from 'react';
import styled from 'styled-components';

const StyledInputField = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: .75rem;

  label {
    color: ${({ theme }) => theme.fg}
    margin-top: .4rem;
    margin-bottom: .5rem;
  }
  input {
    appearance: none;
    border: 1px solid ${({ theme }) => theme.fgAlt};
    color: ${({ theme }) => theme.form.fg};
    caret-color: ${({ theme }) => theme.form.fg};
    background: ${({ theme }) => theme.form.bg};
    outline: none;
    padding: .5rem;
    border-radius: 4px;
    max-width: 100%;
    width: 100%;
  }
  input:focus, input:active {
    border-color: ${({ theme }) => theme.blue};
    box-shadow: 0 0 1px 1px ${({ theme }) => theme.blue};
  }
`;

export default function InputField({ label, field, value, dispatch }) {
  return (
    <StyledInputField>
      <label>{label}</label>
      <input
        type="text"
        value={value}
        name={field}
        onChange={e =>
          dispatch({ field: field, value: e.target.value })
        }
      />
    </StyledInputField>
  );
}
