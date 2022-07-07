# Rocoil

https://recoiljs.org/ko/docs/basic-tutorial/intro

https://tech.osci.kr/2022/06/16/recoil-state-management-of-react/

## installed

```
npm install recoil
```

## Learned

### React의 한계

- 상태공유를 위해 상위 요소까지 끌어올리면 거대한 트리가 재렌더 될 수도 있다..
- Context는 단일 값만을 저장할 수 잇고, 자체 Consumer를 가지는 여러 값의 집합은 담을 수 없다.
- 최상단(state가 존재하는 곳)부터 트리의 잎(state가 사용되는 곳)까지의 코드 분할이 어렵다.

### 주요 개념

[Data Flow Graph]

atoms(상태): 고유한 키를 가짐
|
selectors(순수함수): atoms이나 selector를 입력으로 받음
|
components

### Atom

Atom은 상태(state)의 일부를 나타낸다.
Atoms 는 어떤 컴포넌트에서나 읽고 쓸 수 있다.
atom의 값을 읽는 컴포넌트들은 암묵적으로 atom을<b>구독</b>하고 있다.
따라서 atom에 어떤 변화가 있으면 그 atom을 구독하는 모든 컴포넌트들이 재 렌더링 되는 결과가 발생할 것이다.

```jsx
// state/textState/textState.jsx
const textState = atom({
  key: "textState", // unique ID (with respect to other atoms/selectors)
  default: "", // default value (aka initial value)
});
```

atom안에는 객체가 들어간다.
객체안의 key는 unique한 값이어야 한다.

컴포넌트가 atom을 읽고 쓰게 하기 위해서는 useRecoilState()를 아래와 같이 사용하면 된다.

```jsx
function CharacterCounter() {
  return (
    <div>
      <TextInput />
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
```

### Selector

Selector는 파생된 상태(derived state)의 일부를 나타낸다.
파생된 상태는 상태의 변화다.
즉, “ atom을 원하는 대로 변형해 값을 리턴받는다. ” 라고 생각할 수 있다.

```jsx
export const charCountState = selector({
  key: "charCountState",
  get: ({ get }) => {
    const text = get(textState);
    return text.length;
  },
});
```

selector 의 구조를 살펴보면, atom 과 다른 부분이 있다.
위 코드에서 바로 get 이라는 코드를 살펴볼 수 있는데, selector 은 내부적으로 함수에서 get 을 반환 해주며 get 메서드를 활용해 현재 저장된 atom 이나 다른 selector 의 값을 받아올 수 있다.
이를 통해서 atom 을 input 받고 원하는 결과를 위해 배열을 변형해 output 해준다.

useRecoilValue() 훅을 사용해서 charCountState 값을 읽을 수 있다.

```jsx
function CharacterCount() {
  const count = useRecoilValue(charCountState);
  return <>Character Count: {count}</>;
}
```

## TodoList with Recoil

Atoms는 애플리케이션 상태의 source of truth를 갖는다.
todo 리스트에서 source of truth는 todo 아이템을 나타내는 객체로 이루어진 배열이 될 것이다.

atom 리스트를 todoListState라고 하고, atom() 함수를 이용해 생성해준다.

```jsx
export const todoListState = atom({
  key: "todoListState",
  default: [],
});
```

atom에 고유한 key를 주고 비어있는 배열 값을 default로 설정할 것이다.
이 atom의 항목을 읽기 위해, useRecoilValue() 훅을 TodoList 컴포넌트에서 사용할 수 있다.

```jsx
function TodoList() {
  const todoList = useRecoilValue(todoListState);

  return (
    <>
      <TodoItemCreator />
      {todoList.map((todoItem) => (
        <TodoItem key={todoItem.id} item={todoItem} />
      ))}
    </>
  );
}
export default TodoList;
```

TodoItemCreator 컴포넌트의 setter 함수를 얻기 위해 useSetRecoilState() 훅을 사용한다.

```jsx
function TodoItemCreator() {
  const [inputValue, setInputValue] = useState("");
  const setTodoList = useSetRecoilState(todoListState);

  const addItem = () => {
    setTodoList((oldTodoList) => [
      ...oldTodoList,
      {
        id: getId(),
        text: inputValue,
        isComplete: false,
      },
    ]);
    setInputValue("");
  };

  const onChange = ({ target: { value } }) => {
    setInputValue(value);
  };

  return (
    <div>
      <input type="text" value={inputValue} onChange={onChange} />
      <button onClick={addItem}>Add</button>
    </div>
  );
}
```

기존 todo 리스트를 기반으로 새 todo 리스트를 만들 수 있도록 setter 함수의 updater 형식을 사용한다.
