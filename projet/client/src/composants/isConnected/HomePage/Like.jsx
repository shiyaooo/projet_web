import { useState, useEffect } from 'react';
import axios from 'axios';
import './Like.css'
import CoeurBlanc from '../../Icones/WhiteLike.png';
import CoeurRouge from '../../Icones/RedLike.png';

function Like(props) {
    const [liked, setLiked] = useState(props.post.likes.includes(props.user._id));
    const [nbLike, setnbLike] = useState(props.post.likes.length);

    function handleLikeClick() {
      if (liked){
        axios.put(`http://localhost:5000/posts/${props.user._id}/unlike/${props.post._id}`)
        .then(res => {
          setnbLike(nbLike-1);
        })
        .catch(err => {
          console.log(err);
        });

      } else {
        axios.put(`http://localhost:5000/posts/${props.user._id}/like/${props.post._id}`)
        .then(res => {
          setnbLike(nbLike+1);
        })
        .catch(err => {
          console.log(err);
        });
      }

      setLiked(!liked);

    }
    

  useEffect(()=>{
        setnbLike(props.post.likes.length);
  },[]);

  
  
  return (
    <>
         <button  className='behind_Like'>
            { liked===true?
            <img id="like_button" src={CoeurRouge} alt="Logout" onClick={handleLikeClick}  />
            :
            <img id="like_button" src={CoeurBlanc} alt="Logout" onClick={handleLikeClick} />
            }
             <p id='nblike'>{nbLike}</p>
        </button>
    </> 
  );
}

export default Like;
