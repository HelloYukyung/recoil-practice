import { useState } from "react";
import { useSetRecoilState } from "recoil";
import { todoListState } from "../state/todoListState";

function TodoItemCreator() {
  const [inputValue, setInputValue] = useState("");
  const setTodoList = useSetRecoilState(todoListState);

  const addItem = () => {
    setTodoList((oldTodoList) => [
      ...oldTodoList,
      { id: getId(), text: inputValue, isComplete: false },
    ]);
  };

  const handleOnChange = ({ target: { value } }) => {
    setInputValue(value);
  };

  return (
    <div>
      <input type="text" value={inputValue} onChange={handleOnChange} />
      <button onClick={addItem}>Add</button>
    </div>
  );
}

export default TodoItemCreator;

let id = 0;
function getId() {
  return id++;
}
