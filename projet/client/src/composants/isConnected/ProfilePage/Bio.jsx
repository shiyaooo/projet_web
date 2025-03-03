import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Bio.css';

export default function Bio(props) {
  const [bio, setBio] = useState('');
  const [nbchar, setNbchar] = useState(props.user.bio.length);

  const fetchBio = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/users/${props.user._id}`);
      setBio(response.data.bio);
      setNbchar(bio.length);
    } catch (error) {
      console.error(error);
    }
  };

  const updateBio = async () => {
    try {
      const response = await axios.put(`http://localhost:5000/users/${props.user._id}/changeBio`, { bio });
      console.log(response);
      alert('nouvelle bio sauvegardé')
    } catch (error) {
      console.error(error);
    }
  };



  const handleBioChange = (event) => {
    if (event.target.value.length < nbchar){
        setNbchar(event.target.value.length);
    }  
    if(nbchar===55) return;
    setBio(event.target.value);
    setNbchar(event.target.value.length);
  };


  useEffect(() => {
    fetchBio();
  }, [props.userId]);

  useEffect(() => {
    fetchBio();
  }, []);

  return (
    <div >
      <textarea
        id="bioTextArea"
        value={bio}
        onChange={handleBioChange}
      ></textarea>
      <div className='down_bio'>
        <p id='nb_caracteres'>{nbchar}/55 caractères</p>
        <button id='bioButton' onClick={updateBio}>Enregistrer ma nouvelle bio</button>
      </div>
      
    </div>
  );
}
