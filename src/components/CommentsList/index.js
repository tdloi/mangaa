import React from 'react';
import styled from 'styled-components';
import RichTextEditor from 'react-rte';
import { format } from 'timeago.js';

import Card from 'common/Card';

const StyledCommentItem = styled.div`
  h4 {
    margin: 0.5rem 0;
    margin-right: 0.2rem;
    display: inline-block;
  }
  small {
    color: ${({ theme }) => theme.fgAlt};
  }
  margin: 0.5rem;
`;

const StyledCommentsList = styled.div`
  margin-top: 1rem;
`;

function Comment({ comment }) {
  return (
    <StyledCommentItem>
      <Card>
        <h4>{comment.user}</h4> wrote: <small>{format(comment.created)}</small>
        <RichTextEditor
          value={RichTextEditor.createValueFromString(comment.content, 'html')}
          readOnly={true}
        />
      </Card>
    </StyledCommentItem>
  );
}

export default function CommentsList({ comments }) {
  return (
    <StyledCommentsList>
      {comments &&
        comments.map(comment => <Comment comment={comment} key={comment.id} />)}
    </StyledCommentsList>
  );
}
