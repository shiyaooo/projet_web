import {useState,useEffect} from 'react';
import "./Message.css"
import ProfilePic from "../ProfilePage/ProfilePic"


function Message({msg, owner}){ 

    const [date,setDate]=useState();

    useEffect(() => {
        let dateObj=new Date(msg.createdAt);

        //dechiffrage de la date
        let year = dateObj.getFullYear();
        let month = dateObj.getMonth() + 1;
        let day = dateObj.getDate();
        let hours = dateObj.getHours();
        let minutes = dateObj.getMinutes();
        
        if (day < 10) day = `0${day}`;
        if (month < 10) month = `0${month}`;
        if (hours < 10) hours = `0${hours}`;
        if (minutes < 10) minutes = `0${minutes}`;

        let formattedDate = `Le ${day}/${month}/2023 à ${hours}:${minutes}`;

        //comparaison avec la date d'aujourd'hui
        let dateAjd=new Date()
        const yearAjd = dateAjd.getFullYear();
        let monthAjd = dateAjd.getMonth() + 1;
        let dayAjd = dateAjd.getDate();

        if (dayAjd < 10) dayAjd = `0${dayAjd}`;
        if (monthAjd < 10) monthAjd = `0${monthAjd}`;

        if (yearAjd===year && monthAjd===month && dayAjd===day){
            formattedDate=`Aujourd'hui à ${hours}:${minutes}`;
        }

        //récupère la date formattée
        setDate(formattedDate);
    }, [date]);

    
    return(
        <div className={owner? "message owner":"message"}>
            <div className='messageInfo'>
            <ProfilePic user={msg.sender} height="50px"  width="50px" />            
                <span id="date_msg">{date}</span>
            </div>
            <div className='messageContent'>
                <p className='content'>{msg.text}</p>
            </div>
        </div>
    )
}

export default Message