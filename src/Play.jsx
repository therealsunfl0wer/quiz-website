import "/src/styles/App.css";

function Play() {
  return (
    <>
      <h1 id="quiz-title"></h1>
      <p id="quiz-description"></p>
      <div id="questions"></div>
      <button id="submit-btn">Submit</button>
      <div id="result"></div>
    </>
  );
}
export default Play;