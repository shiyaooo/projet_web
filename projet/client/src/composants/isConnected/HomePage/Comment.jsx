import {useState, useEffect} from 'react';
import axios from 'axios';
import './Comment.css';
import ProfilePic from'../ProfilePage/ProfilePic';

export default function Comments(props){
    const [commentateur, setCommentateur] = useState(props.comment.user);
    const contenu = props.comment.message;
    const [date,setDate]=useState(props.comment.date);
    const [pseudoCommentateur,setPseudoCommentateur]=useState('');

    const getPseudo = async () => {
        try {
          const res = await axios.get(`http://localhost:5000/users/${commentateur}`);
          setPseudoCommentateur(res.data.pseudo);
        } catch (err) {
          console.log('erreur pour recuperer le pseudo du commentateur', err);
        }
      };
      

    useEffect(()=>{
        getPseudo();
    },[]);

    useEffect(() => {
        let dateObj=new Date(props.comment.date);
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
        <>
            <div className='top_comment'>
                <ProfilePic user={commentateur} height='40px' marginLeft='13px' marginTop='10px'/> 
                <p id="nom_comment">{pseudoCommentateur}</p>
                <p id='time_comment'>{date}</p>
            </div>

            <div className='bottom_comment'>
                <p id='contenu_comment'>{contenu}</p>
            </div>
        </>

    );

};