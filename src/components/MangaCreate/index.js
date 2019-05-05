import React, { useState, useReducer, useRef } from 'react';
import styled from 'styled-components';

import InputField from 'common/InputField';
import TextareaField from 'common/TextareaField';
import Wrapper from 'components/Wrapper';
import { reducerMessage } from 'reducers/reducerMessage';

import { reducerForm } from './reducerForm';

const StyledMangaCreate = styled.div`
  margin: .5rem;;
  padding: 1.5rem;
  padding-top: .5rem;
  color: ${({ theme }) => theme.fg}
  background: ${({ theme }) => theme.bg};
  h2 {
    text-align: center;
    padding-bottom: .5rem;
    border-bottom: 1px solid ${({ theme }) => theme.shadow}
  }
  form {
    display: flex;
    flex-direction: column;
    > div:first-child {
      display: flex;
      flex-direction: row-reverse;
      justify-content: space-between;

      div {
        width: 100%;
      }

      > label {
        width: 300px;
        height: 380px;
        text-align: center;
        padding: 1rem;
      }
      > label > input {
        opacity: 0;
      }
      > label > img {
        width: 100%;
      }
    }
  }
`;

export default function MangaCreate() {
  const [formValue, dispatch] = useReducer(reducerForm, {
    title: '',
    alt_titles: '',
    description: '',
    tags: '',
    authors: '',
  });
  const [message, dispatchMessage] = useReducer(reducerMessage, {
    content: '',
    isSuccess: false,
    isError: false,
  });
  const cover = useRef();
  const [selectedFile, setSelectedFile] = useState('');

  const submitForm = async body => {
    const host = process.env.REACT_APP_API || '';
    try {
      const response = await fetch(host + `/manga`, {
        method: 'POST',
        body: body,
      });
      if (response.ok) {
        dispatchMessage({
          type: 'success',
          payload: 'Added new Manga successful',
        });
        dispatch({ type: 'reset' })
      } else {
        const res = await response.json();
        throw res.message;
      }
    } catch (err) {
      dispatchMessage({ type: 'error', payload: err });
    }
  };

  const handleSubmit = event => {
    event.preventDefault();
    const formData = new FormData(event.target);
    submitForm(formData);
  };

  const handleSelectFile = () => {
    const reader = new FileReader();
    reader.onload = function() {
      setSelectedFile(reader.result);
    }
    reader.readAsDataURL(cover.current.files[0]);
  }

  return (
    <Wrapper>
      <StyledMangaCreate>
        <h2>ADD NEW MANGA</h2>
        <div>{message.content}</div>
        <form onSubmit={e => handleSubmit(e)}>
          <div>
            <div>
              <InputField
                label="Title"
                field="title"
                value={formValue.title}
                dispatch={dispatch}
              />
              <TextareaField
                label="Alt titles"
                field="alt_titles"
                value={formValue.alt_titles}
                minRows={3}
                maxRows={10}
                onChange={e =>
                  dispatch({
                    field: 'alt_titles',
                    value: e.target.value,
                  })
                }
              />
              <InputField
                label="Tags"
                field="tags"
                value={formValue.tags}
                dispatch={dispatch}
              />
              <InputField
                label="Authors"
                field="authors"
                value={formValue.authors}
                dispatch={dispatch}
              />
            </div>
            <label>
              {!selectedFile ? 'Click to upload cover' : 'Click to select another file'}
              <input
                name="cover"
                type="file"
                ref={cover}
                accept=".jpg,.jpeg,.png,.webp"
                onChange={() => handleSelectFile()}
              />
              <img src={selectedFile} alt="" />
            </label>
          </div>
          <TextareaField
            label="Description"
            field="description"
            value={formValue.description}
            minRows={5}
            maxRows={10}
            onChange={e =>
              dispatch({
                field: 'description',
                value: e.target.value,
              })
            }
          />
          <div>
            <input type="submit" value="Add" />
          </div>
        </form>
      </StyledMangaCreate>
    </Wrapper>
  );
}
