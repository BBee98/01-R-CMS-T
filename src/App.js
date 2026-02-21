import './App.css';
import Accordion from "./components/Accordion";

function App() {
  return (
    <div className="App">
      <Accordion elements={[{text: "Hello World"}]} />
    </div>
  );
}

export default App;
