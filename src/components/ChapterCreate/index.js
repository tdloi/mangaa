import React, { useState, useReducer, useRef, useContext } from 'react';

import { UserIdTokenContext } from 'context/UserIdTokenContext';
import { reducerMessage } from 'reducers/reducerMessage';
import InputField from 'common/InputField';
import Wrapper from 'components/Wrapper';

import ChapterCreateImageView from './ChapterCreateImageView';
import ChapterCreatePolling from './ChapterCreatePolling';
import { StyledChapterCreate } from './style';
import { reducerForm } from './reducerForm';

export default function ChapterCreate(props) {
  const mangaID = props.match.params.id;
  const [formValue, dispatch] = useReducer(reducerForm, {
    title: '',
    vol: '',
    chapter: '',
  });
  const files = useRef();
  const userToken = useContext(UserIdTokenContext);
  const [message, dispatchMessage] = useReducer(reducerMessage, {
    content: '',
    isSuccess: false,
    isError: false,
  });
  const [selectedFile, setSelectedFile] = useState([]);
  const [step, setStep] = useState(1);
  const [taskID, setTaskID] = useState('');

  if (step === 2) {
    return <ChapterCreatePolling taskID={taskID} history={props.history} />
  }

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
        setTaskID(response.headers.get('location'));
        setStep(2);
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
    formData.append('manga', mangaID);
    for (const file of files.current.files) {
      const fileOrder = file.name.match(/\d+/)[0]
      formData.append(fileOrder, file)
    }
    delete formData.content;
    submitForm(formData);
  };

  const handleSelectFile = () => {
    setSelectedFile([]);
    const listFiles = Array.from(files.current.files);
    listFiles.sort((prev, next) => {
      const prevName = prev.name.match(/\d+/)[0];
      const nextName = next.name.match(/\d+/)[0];
      return prevName > nextName
    })
    for (const fileObject of listFiles) {
      const reader = new FileReader();
      reader.onload = function() {
        setSelectedFile(files => [...files, reader.result]);
      };
      reader.readAsDataURL(fileObject);
    }
  };

  return (
    <Wrapper>
      <StyledChapterCreate>
        <h2>ADD NEW CHAPTER</h2>
        <div>{message.content}</div>
        <form onSubmit={handleSubmit}>
          <InputField
            label="Title"
            field="title"
            value={formValue.title}
            dispatch={dispatch}
          />
          <div className="vol-chapter">
            <InputField
              label="Vol"
              field="vol"
              value={formValue.vol}
              dispatch={dispatch}
              type="number"
              step="0.1"
            />
            <InputField
              label="Chapter"
              field="chapter"
              value={formValue.chapter}
              dispatch={dispatch}
              type="number"
              step="0.1"
            />
          </div>
          <div className="files">
            <label>
              <span>Select images to upload </span>
              <input
                type="file"
                ref={files}
                accept=".jpg,.jpeg,.png,.webp"
                onChange={handleSelectFile}
                multiple
              />
              <ChapterCreateImageView listImages={selectedFile} />
            </label>
          </div>
          <input type="submit" value="Create" />
        </form>
      </StyledChapterCreate>
    </Wrapper>
  );
}
