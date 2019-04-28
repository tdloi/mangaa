import React, { useState } from 'react';
import styled from 'styled-components';

const StyledNavbarSwitchTheme = styled.div`
  display: flex;
  input {
    height: 0;
    width: 0;
    visibility: hidden;
    appearance: none;
  }
  label {
    cursor: pointer;
    width: 200px;
    height: 100px;
    background: grey;
    display: block;
    border-radius: 100px;
    position: relative;
  }
  label:after {
    content: '';
    background: white;
    width: 90px;
    height: 90px;
    position: absolute;
    border-radius: 50%;
    top: 5px;
    left: 5px;
    transition: 0.3s;
  }
  input:checked + label {
    background: green;
  }
  input:checked + label:after {
    left: calc(100% - 95px);
    transform: translateX(-100%);
  }
  label:active:after {
    width: 130px;
  }
`;

export default function NavbarSwitchTheme(props) {
  const [checked, setChecked] = useState(false);

  return (
    <StyledNavbarSwitchTheme checked={checked}>
        <input
          type="checkbox"
          name={props.name}
          onChange={event => setChecked(value => !value)}
          checked={checked}
        />
        {props.label}
            <label htmlFor={props.name}>
</label>
    </StyledNavbarSwitchTheme>
  );
}
