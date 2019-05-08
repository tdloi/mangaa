import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import RichTextEditor from 'react-rte';

import { ButtonPrimary, ButtonSecondary } from 'common/Button';
import { UserIdTokenContext } from 'context/UserIdTokenContext';

const StyledComment = styled.div`
  margin: 0.75rem auto;
  .public-DraftEditor-content {
    min-height: 160px;
  }
  form > div:last-child {
    display: flex;
    justify-content: space-between;
  }
`;

export default function Comment(props) {
  const oldContent = props.content || RichTextEditor.createEmptyValue();
  const [content, setContent] = useState(oldContent);

  const token = useContext(UserIdTokenContext);
  const mangaID = props.match.params.id;

  async function submitComment(event) {
    event.preventDefault();
    const host = process.env.REACT_APP_API || '';
    try {
      await fetch(host + `/manga/${mangaID}/comment`, {
        method: 'POST',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: content.toString('html'),
        }),
      });
      props.onSuccess();
      setContent(oldContent);
    } catch (err) {
      props.onFailure();
    }
  }

  const onChange = value => setContent(value);

  return (
    <StyledComment>
      <form onSubmit={submitComment}>
        <RichTextEditor value={content} onChange={onChange} />
        <div>
          <ButtonPrimary type="submit">Post comment</ButtonPrimary>
          <ButtonSecondary onClick={() => setContent(oldContent)}>
            Reset
          </ButtonSecondary>
        </div>
      </form>
    </StyledComment>
  );
}
