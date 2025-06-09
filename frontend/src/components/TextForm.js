import React, { useState } from "react";

export default function TextForm(props) {
  const [text, setText] = useState("");

  const toUp = () => {
    console.log("You have clicked button to uppercase");
    let newText = text.toUpperCase();
    setText(newText); // updates the text state
  };
const toLow = () => {
    console.log("You have clicked button to uppercase");
    let newText = text.toLowerCase();
    setText(newText); // updates the text state
  };

  const handleOnChange = (event) => {
    console.log("on change");
    setText(event.target.value); // updates state as user types
  };

  return (
    <>
    <div className="py-4 container">
      <div className="form-group mb-3">
        <h1>{props.title}</h1>
        <textarea
          value={text}
          onChange={handleOnChange} // ✅ correctly placed
          className="form-control"
          id="exampleFormControlTextarea1"
          rows="8"
        ></textarea>
      </div>
      <button  onClick={toUp} className="btn mx-2  btn-primary">
        Convert to uppercase
      </button>
      <button onClick={toLow} className="btn btn-primary">
        Convert to lowercase
      </button>
    </div>
    <div className="container my-2">
      <h1>Your text summary</h1>
      <p>{text.split(" ").length} words and {text.length} characters</p>
      <p>{0.008*text.split(" ").length} minutes to read a word</p>
      <h2>Preview</h2>
      <p>{text}</p>
    </div>
    </>
  );
}
