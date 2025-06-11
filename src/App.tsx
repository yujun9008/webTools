import "./App.css";
import TrackAnalyzer from "./tools/TrackAnalyzer";
function App() {
  console.log(location.href);
  return (
    <>
      {/* <h1>Web Tools</h1> */}
      {/* <div className="tools-container"> */}
        <TrackAnalyzer />
      {/* </div> */}
    </>
  );
}

export default App;
