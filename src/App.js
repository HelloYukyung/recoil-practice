import logo from "./logo.svg";
import "./App.css";
import CharacterCounter from "./components/CharacterCounter";
import { RecoilRoot } from "recoil";
import TodoList from "./components/TodoList";

function App() {
  return (
    <div className="App">
      <RecoilRoot>
        <TodoList />
        {/* <CharacterCounter /> */}
      </RecoilRoot>
    </div>
  );
}

export default App;
