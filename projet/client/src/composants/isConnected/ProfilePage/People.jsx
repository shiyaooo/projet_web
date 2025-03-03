import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProfilePic from './ProfilePic';
import './People.css';
import FollowButton from './Follow';
import UnfollowButton from './Unfollow';

export default function People(props){
    console.log("people");
    const [people, setPeople] = useState(props.people);
    const [buttonType, setButtonType] = useState("");
    const [heFollowsMe, setHeFollowsMe]= useState(false);
    const [user, setUser] = useState(props.user);

    const [switchFollowButton, setSwitchFollowButton]= useState((buttonType==='suivi' || buttonType==='friends')); // 表示用户已经关注


    const HandleSwitchFollowButton = () =>{
        setSwitchFollowButton(!switchFollowButton);
        console.log(buttonType);
    };

    const getUser = () => {
        return axios.get(`http://localhost:5000/users/${props.user._id}`)
        .then((res) => {
            setUser(res.data);
        })
        .catch((err) => {
            console.log("can't load the results from the database: ", err);
        });
    };

    const getPeople = () => {
        return axios.get(`http://localhost:5000/users/${props.people._id}`)
        .then((res) => {
            setPeople(res.data);
        })
        .catch((err) => {
            console.log("can't load the results from the database: ", err);
        });
    };

    const handleRelationStatut = () => {
        if (user.Myfollowers.includes(people._id)) setHeFollowsMe(true);
        if (user.Myfriends.includes(people._id)) {
            console.log('friends');
            setButtonType('friends');
            setSwitchFollowButton(true);
        } 
        else if (user.Myfollowings.includes(people._id)) {
            console.log('suivi');
            setButtonType('suivi');
            setSwitchFollowButton(true);
        }
        else{
            console.log('suivre');
            setButtonType('suivre');
            setSwitchFollowButton(false);
        } 
    };

    useEffect(() => {
        Promise.all([getUser(), getPeople()]) // 等所有 Promise 任务完成后
          .then(() => handleRelationStatut())
          .catch(err => console.log('Error in useEffect:', err));
      }, [props.results]);

      

    return (
        <div className='render_people'>
            <div className='pic_people'>
            <ProfilePic user={people._id} height='65px' marginLeft='13px' marginTop='10px' reset='a'/> 
            </div>
            <div className='PseudoETbio_people'>
                <div className='pseudo_people'>
                    <p >{people.pseudo}</p>
                    {buttonType==='friends'?<p id='friends_people_nexttoPseudo'>FRIENDS</p>:null}
                </div>
                <p>{people.bio}</p>
            </div>
            <div className='stats_people'>
                <p id='firstStat'>{people.Myfollowers.length} Followers</p>
                <p id='secondStat'>{people.Myfollowings.length} Followings</p>
            </div>
            {people._id === props.user._id ? 
                <p id='ME_people'>ME</p>:
                <div className='Relationbutton_people'>
                    {(switchFollowButton)?
                        <UnfollowButton HandleSwitchFollowButton={HandleSwitchFollowButton} handleRelationStatut={handleRelationStatut} user={props.user} target={people}/>:
                        <FollowButton HandleSwitchFollowButton={HandleSwitchFollowButton} handleRelationStatut={handleRelationStatut} user={props.user} target={people}/>
                    }
                        
                    {(buttonType==='suivre' && heFollowsMe? 
                        <p id='HeFollowsMe_people'>Cette personne vous suit</p>: null
                    )}
                </div>
            }    
        </div>
    );
}
