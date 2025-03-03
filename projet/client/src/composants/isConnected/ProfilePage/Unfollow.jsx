import React from 'react';
import axios from 'axios';
import './FollowUnfollow.css';

export default function Unfollow({HandleSwitchFollowButton, handleRelationStatut, user, target}){

    const handleUnfollow=(event)=>{
        axios.put(`http://localhost:5000/users/${user._id}/unfollow/${target._id}`)
        .then(res => {
            handleRelationStatut();
            HandleSwitchFollowButton();
          if (!user.Myfollowings.includes(target._id)) console.log("Unfollowed ! ");
          else console.log("coudn't follow (user still does include target._id in is followings")
        })
        .catch(err => {
          console.log(err);
        });
    }
    return(
        <button id='Follow_render'  onClick={handleUnfollow}>
            Unfollow
        </button>
    );
};