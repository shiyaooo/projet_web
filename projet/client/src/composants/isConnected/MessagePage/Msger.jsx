import React, { useEffect, useState } from "react";
import "./Msger.css";
import axios from "axios";
import ProfilePic from "../ProfilePage/ProfilePic";

function Msger(props) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const friendId = props.msger.members.find(m => m !== props.currentUser._id);
        if (!friendId) return;  // 避免 friendId 为空时报错

        const getUser = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/users/${friendId}`);
                setUser(res.data);
            } catch (err) {
                console.log("Erreur chargement utilisateur:", err);
            }
        };

        getUser();
    }, [props.currentUser, props.msger]);

    return (
        <div className="messagers">
            <div className="ami_cherche">
                {user ? (
                    <>
                        <ProfilePic user={user._id} height="50px" width="50px" />
                        <div className="ami_info">
                            <span>{user.nom} {user.prenom}</span>
                        </div>
                    </>
                ) : (
                    <span>Chargement...</span> // 加载时显示占位符
                )}
            </div>
        </div>
    );
}

export default Msger;
