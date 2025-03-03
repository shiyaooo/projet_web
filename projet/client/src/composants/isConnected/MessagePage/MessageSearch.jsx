import React from 'react';
import { useState, useEffect } from 'react';
import "./MessageSearch.css"
import axios from 'axios';
import NavBar from "./NavBar"
import Plus from "../../Icones/plus.png";
import Msger from "./Msger"
import MessageList from './MessageList'
import NewConv from './NewConv';


function MessageSearch(props){
    const [recherche,setRecherche]=useState("");
    const [msgers,setMsgers]=useState([]);
    const [currentChat, setCurrentChat]=useState(null)
    const [allUsers, setAllUsers]=useState([])
    const [topping, setTopping]=useState(false)
    
    
    useEffect(()=>{
        const getUsers=async()=>{
            try {
                const res=await axios.get("http://localhost:5000/users/")
                setAllUsers(res.data)
            } catch (err) {
                console.log(err)   
            }
        };
        getUsers()
    },[])
    
    function remove_currentUser(i){
        const newUsers=allUsers.filter((user)=>user._id!==props.user._id && user._id!==i._id);
        setAllUsers(newUsers);
    }

    

   const newUsers=allUsers.filter((user)=>user._id!==props.user._id);


    //chercher ts les conversation qui'ilexiste deja
    useEffect(()=>{
        const getMsgers=async()=>{
            try{
            const res=await axios.get("http://localhost:5000/conversations/"+props.user._id);
            setMsgers(res.data);
            //console.log(res.data)
            }catch(err){
                console.log(err)
            }};
            getMsgers();
    },[props.user._id])


    const getTopping=()=>{
        setTopping(!topping)
    }
    
    //console.log(topping)

    const handleInputChange=(ev)=>{
        let value=ev.target.value
        //console.log(value);
        setRecherche(value);
    };
    //console.log(recherche)

    const handleSubmit=(ev)=>{
        alert("Le terme a été soumis : "+this.recherche);
        ev.preventDefault();
    }
    
    const updateCons = (newCons) => {
        setMsgers([...msgers,newCons]);
      };

    
    
    return (
        <>
        <div className='messagesearch'>
            <NavBar user={props.user}/>
            <div className='msg_search'>
                My Chat 
                <button id="btn_img" onClick={getTopping} ><img className='ajout' src={Plus} alt=''/> </button>
            </div>
            <div className="msg_trouve">
            {topping?
                <>
                <div className='ami_search'>
                    <form action="" onSubmit={handleSubmit}>
                        <input type="text" id="searchmsg" name="searchmsg" placeholder="Recherche un spreader" onChange={handleInputChange} />
                    </form>
                </div>
                <div>
                { newUsers.filter((val)=>
                            { return  val.nom.toLowerCase().includes(recherche.toLowerCase()) || val.prenom.toLowerCase().includes(recherche.toLowerCase())
                                }).map((user) => (
                                <div key={user._id} ><NewConv user_att={user} currentUser={props.user} addCon={updateCons} /></div>
                    ))}
                </div>
                </>:
            
                <>
                {msgers.map((c) => (  
                    <div key={c._id } onClick={()=>setCurrentChat(c)} >
                        <Msger msger={c} currentUser={props.user}/>
                    </div>
                ))}
                </>
            }
            </div>
        </div>
        <div className="discussion">
            {currentChat?
            <>
            <MessageList currentUser={props.user} currentChat={currentChat} />
            </>:<div className='no_Con'><span className='noConversation'>Open a conversation to start a chat</span></div>}
        </div>
        </>
    );
};
export default MessageSearch