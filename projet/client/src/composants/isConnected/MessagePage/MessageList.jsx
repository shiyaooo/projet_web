import React, { useState, useEffect,useRef } from "react"
import './MessageList.css'
import axios from "axios"
import Message from "./Message"
import ProfilePic from "../ProfilePage/ProfilePic"


function MessageList(props){
    const [msgs, setMsgs]=useState([])
    const [newMsg,setNewMsg]=useState("")
    const scrollRef = useRef()
    const [user,setUser]=useState([]);
    const [friend, setFriend] = useState();
    
    useEffect(()=>{
        const getMsgs=async()=>{
            try{
                const res=await axios.get("http://localhost:5000/messages/"+props.currentChat._id);
                setMsgs(res.data)
            }catch(err){
                console.log(err);
            }
        };
        getMsgs();
    },[props.currentChat]);

    useEffect(()=>{
        const friendId=props.currentChat.members.find(m=>m!==props.currentUser._id)
        const getUser=async()=>{
            try{
            const res=await axios("http://localhost:5000/users/"+friendId);   
            setUser(res.data)
            setFriend(props.currentChat.members.filter(e=>e!==user._id));
        }catch(err){
        console.log(err);
        }};
        getUser()
    },[props.currentUser, props.currentChat]);

    const changehandle=(e)=>{
        let value=e.target.value;
        setNewMsg(value);
    }

    const handleSubmit= async(e)=>{
        e.preventDefault();
        const msg={
            sender:props.currentUser._id,
            text:newMsg,
            conversationId: props.currentChat._id,
        }; 
        console.log(msg) 
        try {
            const res=await axios.post("http://localhost:5000/messages",msg)
            setMsgs([...msgs,res.data])
            setNewMsg("")
        } catch (err) {
            console.log(err)
        }      
    }


    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
      }, [msgs]);

    // console.log(props.currentChat.members[1])


    return (
        <>
        <div className='dis_entete'>
            <span>{user.nom} {user.prenom}</span>
        </div>
        <div className="messagelist">
            {msgs.map((m)=>(
                <div key={m._id} ref={scrollRef}>
                <Message msg={m} owner={m.sender===props.currentUser._id} user={props.currentUser}/>
                </div>
            ))}
            
        </div>
        <div className="barre_ecrit">
                <input type="text" id="Bar_ecrit"  placeholder="Taper un message" onChange={changehandle} value={newMsg}/>
                <div className="send">
                    <button className="bar_send"  onClick={handleSubmit}>Send</button>
                </div>
        </div>
        </>
    )
}
export default MessageList
 