import './App.css';
import Accordion from "./components/Accordion";
import Button from "./components/Button";

function App() {
  return (
    <div className="App">
      <Accordion elements={[{text: "Hello World"}]} />
        <Button />
    </div>
  );
}

export default App;
