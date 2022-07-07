import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { charCountState } from "../state/charCountState";
import { textState } from "../state/textState";

function CharacterCounter() {
  return (
    <div>
      <TextInput />
      <CharacterCount />
    </div>
  );
}
export default CharacterCounter;

function TextInput() {
  const [text, setText] = useRecoilState(textState);

  const handleOnChange = (event) => {
    setText(event.target.value);
  };

  return (
    <div>
      <input type="text" value={text} onChange={handleOnChange} />
      <br />
      Echo : {text}
    </div>
  );
}

function CharacterCount() {
  const count = useRecoilValue(charCountState);
  return <>Character Count: {count}</>;
}
