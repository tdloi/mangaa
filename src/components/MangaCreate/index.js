import React, { useState, useReducer, useRef } from 'react';

const messageReducer = (state, action) => {
  switch (action.type) {
    case 'success':
      return {
        isSuccess: true,
        isError: false,
        content: action.payload,
      };
    case 'error':
      return {
        isError: true,
        isSuccess: false,
        content: action.payload,
      };
    default:
      return {
        ...state,
      };
  }
};
export default function MangaCreate() {
  const [title, setTitle] = useState('');
  const [altTitles, setAltTitles] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [authors, setAuthors] = useState('');
  const cover = useRef();
  const [message, dispatch] = useReducer(messageReducer, {
    content: '',
    isSuccess: false,
    isError: false,
  });

  const submitForm = async body => {
    const host = process.env.REACT_APP_API || '';
    try {
      const response = await fetch(host + `/manga`, {
        method: 'POST',
        body: body,
      });
      if (response.ok) {
        dispatch({ type: 'success', payload: 'Create new Manga successful' });
      } else {
        const res = await response.json();
        throw res.message;
      }
    } catch (err) {
      dispatch({ type: 'error', payload: err });
    }
  };

  const handleSubmit = event => {
    event.preventDefault();
    const formData = new FormData(event.target);
    submitForm(formData);
  };
  return (
    <form onSubmit={e => handleSubmit(e)}>
      <div>{message.content}</div>
      <div>
        <label>Title: </label>
        <input
          name="title"
          type="text"
          onChange={e => setTitle(e.target.value)}
          value={title}
        />
      </div>
      <div>
        <label>Tags: </label>
        <input
          name="tags"
          type="text"
          onChange={e => setTags(e.target.value)}
          value={tags}
        />
      </div>
      <div>
        <label>Authors: </label>
        <input
          name="authors"
          type="text"
          onChange={e => setAuthors(e.target.value)}
          value={authors}
        />
      </div>
      <div>
        <label>Alt titles:</label>
        <textarea
          name="alt_titles"
          type="text"
          onChange={e => setAltTitles(e.target.value)}
          value={altTitles}
        />
      </div>
      <div>
        <label>Description:</label>
        <textarea
          name="description"
          type="text"
          onChange={e => setDescription(e.target.value)}
          value={description}
        />
      </div>
      <div>
        <label>Cover:</label>
        <input
          name="cover"
          type="file"
          ref={cover}
          accept=".jpg,.jpeg,.png,.webp"
        />
      </div>

      <input type="submit" value="Create" />
    </form>
  );
}
