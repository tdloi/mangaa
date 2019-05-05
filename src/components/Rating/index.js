import React, { useState } from 'react';
import { useFirebaseIdToken, useFirebaseUser } from '../../hooks';

export default function Rating({ mangaID }) {
  const [value, setValue] = useState('')
  const user = useFirebaseUser();
  const token = useFirebaseIdToken(user);

  const onChange = async (event) => {
    setValue(event.target.value);
    const host = process.env.REACT_APP_API || '';

    const response = await fetch(
      host + `/manga/${mangaID}/rating`, 
      {
        method: 'POST',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating: parseInt(event.target.value),
        })
      }
    );
  }
  return (
    <select onChange={onChange}>
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
      <option value="4">4</option>
      <option value="5">5</option>
      <option value="6">6</option>
      <option value="7">7</option>
      <option value="8">8</option>
      <option value="9">9</option>
      <option value="10">10</option>
    </select>
  );
}
