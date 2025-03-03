import {useState, useEffect} from 'react';
import './ProfilePage.css';
import EditPhoto from './EditPhoto';
import Bio from './Bio';
import ContactsList from './ContactsList';
import axios from 'axios';

export default function ProfilePage(props){
    const [user,setUser] = useState(props.user); 
    const [contacts, setContacts] = useState('');
    const [showContacts,setShowContacts] = useState(false);
    const [picNumber, setPicNumber] = useState(1);
    const [hasPic, setHasPic] = useState(props.user.profileImage);
    const [reset, setReset] = useState(false);
    const [date, setDate] = useState('');
    const listContacts = ['showFriends', 'showFollowers', 'showFollowings'];


    const handleShowContacts=(ev)=>{
        let bouton = ev.target.id;
        setContacts(ev.target.id);
        setShowContacts(true); 
    }


    const getUser=async()=>{
        try{
            const res=  await axios.get(`http://localhost:5000/users/${user._id}`);
            setUser(res.data);
        }catch(err){
            console.log(`can't load user informations from the database`);
        }
    };
    

        
      const verifyPicExistence = async () => {
        try {
          const res = await axios.get(`http://localhost:5000/users/${user._id}`);
          setHasPic(res.data.profileImage);
          return res.data.profileImage;
        } catch (err) {
          console.log("ERROR: can't verify if user has pic", err);
        }
      };


    const getUsersPicNumber= async ()=>{
        try{
            //verification de l'existence d'une pdp chez l'user
            const hasPic = verifyPicExistence();

            if (!hasPic){
                const res = await axios.get(`http://localhost:5000/pics/${user._id}`);
                setPicNumber(res.data.picture);
            }

        }catch (err) {
            console.log("can't get the users pic number: ",err);
        }
    };

    useEffect(()=>{
        const res = getUser();
        if (res) getUsersPicNumber();
    },[]);

    useEffect(() => {
        let dateObj=new Date(props.user.createdAt);

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

        let formattedDate = `le ${day}/${month}/2023`;

        //récupère la date formattée
        setDate(formattedDate);
    }, []);

    useEffect(() => {
        const res = getUser();
        if (res) setReset(!reset)
      }, [showContacts]);

    const handleGoBack=()=>{
        setContacts('');
        setShowContacts(false);
    }


    return(
        <div className='render_ProfilePage'>
            <div className='haut_PP'>
                <EditPhoto user={user} picNumber={picNumber} setPicNumber={setPicNumber} verifyPicExistence={verifyPicExistence} hasPic={hasPic} setHasPic={setHasPic} getUsersPicNumber={getUsersPicNumber}/>
                <div className='infos_PP'>
                    <h2 id='nom_PP'>{user.pseudo}</h2>
                    {user.Myfollowers.length!==1 ?<p id='nbr_followers'>{user.Myfollowers.length} followers</p>:<p id='nbr_followers'>{user.Myfollowers.length} follower</p>}
                    {user.Myfollowings.length!==1 ?<p id='nbr_followings'>{user.Myfollowings.length} followings</p>:<p id='nbr_followings'>{user.Myfollowings.length} following</p>}
                </div>
                
                <div className='bio_PP'>
                    <Bio user={user}/>
                </div>
            </div>

            <div className='bas_PP'>
                {showContacts?
                    <div className='secondPage'>  
                        <button id='goBack' onClick={handleGoBack}>Back</button>
                        <ContactsList user={user} contacts={contacts} reset={reset} setReset={setReset}/>
                        <br/>
                    </div>
                    
                    :
                    <>
                        <button id='showFriends' onClick={handleShowContacts}>See my friends</button>
                        <button id='showFollowers' onClick={handleShowContacts}>See my followers</button>
                        <button id='showFollowings' onClick={handleShowContacts}>See my followings</button>
                    </>
                    

                }
                <h3 id='createdAt_PP'>J'utilise SpreadApp depuis {date}</h3>
            </div>
        </div>
    )
};