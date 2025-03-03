import React from "react";
import { useState}from "react";
import "./NewCon.css"
import axios from "axios";
import ProfilePic from "../ProfilePage/ProfilePic"


function NewConv(props) {
    const [msger,setMsger]=useState();
    console.log(props.user_att)
    const handleadd= async(e)=>{
        e.preventDefault();
            const conv={
                sender:props.currentUser._id, 
                receiver:props.user_att._id
            }; 
            console.log(props.currentUser._id, props.user_att._id) 
            try {
                const res=await axios.post("http://localhost:5000/conversations/",conv)
                props.addCon(res.data)
                //setNewCon("")
                console.log(res)
            } catch (err) {
                console.log(err)
            } 
           
    }
    
        return (

            <div className="newconversation">  
                <div className="user_info">
                <ProfilePic user={props.user_att._id} height="50px"  width="50px" />            
                <div >
                        <button className="user_send"  onClick={handleadd}> 
                            <span className="user_name">{props.user_att.pseudo}
                            </span>
                        </button>
                    </div>  
                    
                </div>
                
            </div>
        );
}
export default NewConv