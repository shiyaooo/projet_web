import React, { useState } from "react";
import axios from "axios";
import './RespondSpread.css'

function RespondSpread(props) {
  
  const [response, setResponse] = useState("");

  function handleResponseChange(event) {
    setResponse(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    axios.post(`http://localhost:5000/posts/commenting/${props.post._id}`, {
      author: props.user._id,
      message: response
    }).then(response => {
      console.log(response);
      alert("Commentaire posté")
      setResponse("");
      props.handleNbComm();
    }).catch(error => {
      console.log(error);
    });
  }
  console.log("répondre");
  return (
    <form onSubmit={handleSubmit} className='form_commenting'>
      <textarea id='textareaCommenting' value={response} placeholder="Ajouter un commentaire" onChange={handleResponseChange} />
      <button id='buttonCommenting' type="submit">Répondre</button>
    </form>
  );
}

export default RespondSpread;
