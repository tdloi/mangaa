import React, { useState, useReducer, useRef } from 'react';
import { useFirebaseUser, useFirebaseIdToken } from '../../hooks';
import { reducerMessage } from '../../reducers/reducerMessage';

export default function ChapterCreate({ match }) {
  const mangaID = match.params.id;
  const [title, setTitle] = useState('');
  const [vol, setVol] = useState('');
  const [chapter, setChapter] = useState('');
  const files = useRef();
  const user = useFirebaseUser();
  const userToken = useFirebaseIdToken();
  const [message, dispatch] = useReducer(reducerMessage, {
    content: '',
    isSuccess: false,
    isError: false,
  });

    const submitForm = async body => {
    const host = process.env.REACT_APP_API || '';
    try {
      const response = await fetch(host + '/chapter', {
        method: 'POST',
        headers: {
          Authorization: userToken,
        },
        body: body,
      });
      if (response.ok) {
        dispatch({ type: 'success', payload: 'Create new Chapter successful' });
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
    formData.append('manga', mangaID);
    submitForm(formData);
  };

  if (!user) return 'You have not logged in';

  return (
    <form onSubmit={handleSubmit} user={user}>
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
        <label>Vol: </label>
        <input
          name="vol"
          type="number"
          step="0.1"
          onChange={e => setVol(e.target.value)}
          value={vol}
        />
      </div>
      <div>
        <label>Chapter: </label>
        <input
          name="chapter"
          type="number"
          step="0.1"
          onChange={e => setChapter(e.target.value)}
          value={chapter}
        />
      </div>
      <div>
        <label>Chapter images:</label>
        <input
          name="content"
          type="file"
          ref={files}
          accept=".jpg,.jpeg,.png,.webp"
          // onChange={e => {
          //   setSelectedFile(Array.from(files.current.files));
          // }}
          multiple
        />
      </div>
      <input type="submit" value="Create" />
    </form>
  );
}
