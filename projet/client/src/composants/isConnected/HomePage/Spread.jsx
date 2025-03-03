import {useState, useEffect} from 'react';
import './Spread.css';
import axios from 'axios';
import ProfilePic from '../ProfilePage/ProfilePic'
import Like from './Like';
import ListComments from './ListComments';
import Modal from '../../Modal';
import Repondre from './RespondSpread';
import CommentIcone from '../../Icones/CommentIcone.png';
import ReplyIcone from '../../Icones/Reply.png';

export default function Spread(props){

    const [post, setPost]=useState(props.post);
    const user=props.user;
    // const [spreader, setSpreader] = useState(props.user)
    const [date, setDate]=useState('');
    const [poster, setPoster]=useState('');
    const [isOpen,setIsOpen]=useState(false);
    const [loadReply, setLoadReply] = useState(false);

    let image = null;
    // if (post.image) image = require(`../../../../../serveur/uploads/${post.image}`);
    if (post.image) image = `http://localhost:5000/${post.image}`;
    console.log(image);

    const [nbComm, setNbComm] = useState(props.post.commentaires.length);
    const [loadComments, setLoadComments] = useState(false);


    const handleNbComm=()=>{
        setNbComm(nbComm+1);
    }


    const getPoster=async()=>{
        if (post.user===user._id) {
            setPoster(user.pseudo);
        }
        else{
            const userid=post.user;
            const res= await axios.get(`http://localhost:5000/users/${userid}`);

            try{
                setPoster(res.data.pseudo);
                // setSpreader(res);
            }catch(err){
                (console.log("coudn't get the user of the post",post._id,": ", err));
            }
        }
    }

    

    useEffect(()=>{
        getPoster();
    },[poster]);

    

    useEffect(() => {
        let dateObj=new Date(props.post.date);

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

    {console.log("post is " + props.post.contenu)}

    // 用于处理评论区（comments）和回复区（replies）
    const SlideComm = (ev) => {
        if (ev.target.id === "buttonComments_spread"){
            if (loadReply){
                setLoadReply(false);
                setLoadComments(true);
            }else{
                setIsOpen(!isOpen); // 切换展开/折叠状态
                setLoadComments(!loadComments); // 切换评论区的状态
            }
            
        } 
        else{
            if (loadComments){
                setLoadReply(true);
                setLoadComments(false);
            }else{
                setIsOpen(!isOpen);
                setLoadReply(!loadComments);
            }
            
        } 
        
    };

         
    return (
        <div className='render_spread'>
            <div className='entete_spread'>
                <div className='userID_spread'>
                    <ProfilePic user={post.user} height='45px' marginLeft='13px' marginTop='10px' reset='a'/>
                    <p id="nom_spread">{poster}</p>
                    <p id='time_spread'>{date}</p>
                </div>
            </div>
            <div className='contenu_spread'>
                {props.post.contenu}
                {image ? <> 
                            <br/>
                            <br/>
                            <img src={image} alt='Image du spread' id='imageInPost'/>
                        </>:null}
            </div>
            <div className='options_spread'>

                <div className='like_spread'>
                    <Like post={post} user={user}/>
                </div>
                <div className='comments_spread'>
                    <button className="backcomm_spread">
                        <img id="buttonComments_spread" src={CommentIcone} alt="comments" onClick={(ev)=>SlideComm(ev)}  />
                    </button>
                    <p id='nbComments'>{nbComm}</p>           
                </div>
                <div className='respond_spread'>
                    <button className="backreply_spread">
                        <img id="buttonReply_spread" src={ReplyIcone} alt="comments" onClick={(ev)=>SlideComm(ev)}  />
                    </button>
                </div>

                <Modal isOpen={isOpen} onClose={SlideComm}>
                    {loadReply?<Repondre post={post} user={user} handleNbComm={handleNbComm}/>: null}
                    {loadComments?<ListComments post={post}/> : null}
                </Modal>
                
            </div>
        </div>
    );
};