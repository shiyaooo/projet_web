import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FollowUnfollow.css';

export default function Follow({HandleSwitchFollowButton, handleRelationStatut, user, target}){

    const handleFollow=(event)=>{
        console.log(user._id);
        console.log(target._id);
        axios.put(`http://localhost:5000/users/${user._id}/follow/${target._id}`)
        .then(res => {
           handleRelationStatut();
           HandleSwitchFollowButton();  // 更新按钮的状态，通常是切换“关注/取消关注”按钮的显示
          if (user.Myfollowings.includes(target._id)) console.log("Followed ! ");
          else console.log("coudn't follow (user doesn't include target._id in is followings")
        })
        .catch(err => {
          console.log(err);
        });
    }
    return(
        <button id='Follow_render'  onClick={handleFollow}>
            Follow
        </button>
    );
};