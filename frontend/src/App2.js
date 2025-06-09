import React from "react";
import Navbars from './components/Navbars'; // adjust the path if needed
import TextForm from "./components/TextForm";
function App2() {
  return (
    <>
      <Navbars/>
      <div className="container">
        <TextForm title="Enter the text to analyze below"/>
      </div>
    </>
  );
}
export default App2;
