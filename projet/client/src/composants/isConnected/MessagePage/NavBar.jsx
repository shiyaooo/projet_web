import React from "react";
import "./NavBar.css"
import ProfilePic from "../ProfilePage/ProfilePic"

function NavBar(props){
    //console.log(proprs)

    return (
        <div className="navbar">
            <span className="logo">Spread</span>
            <div className="user">
            <ProfilePic user={props.user._id} height="50px"  width="50px" />
            <span className="nom_user">{props.user.nom} { props.user.prenom}</span>
            </div>

        </div>
    )
}

export default  NavBar