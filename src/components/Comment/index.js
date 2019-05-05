import React, { useState } from 'react';
import { useFirebaseUser, useFirebaseIdToken } from '../../hooks'

export default function Comment(props) {
  const oldContent = props.content;
  const [content, setContent] = useState(props.content);
  const user = useFirebaseUser();
  const token = useFirebaseIdToken(user);
  const mangaID = props.match.params.id;

  async function submitComment(event) {
    event.preventDefault();
    const host = process.env.REACT_APP_API || '';
    const response = await fetch(
      host + `/manga/${mangaID}/comment`, 
      {
        method: 'POST',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: content,
        })
      }
    );
    console.log(await response.json())
  }

  return(
    <React.Fragment>
      <form onSubmit={submitComment}>
        <input onChange={(event) => setContent(event.target.value)} value={content} disabled={props.readOnly} />
        <input type="submit" value="Post comment" />
      </form>
      <button onClick={() => setContent(oldContent)}>Reset</button>
    </React.Fragment>
  )
}
