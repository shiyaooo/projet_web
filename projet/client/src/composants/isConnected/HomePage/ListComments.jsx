import {useState, useEffect} from 'react';
import axios from 'axios';
import './ListComments.css';
import Comment from './Comment'

export default function ListComments(props){
    const [Commentaires,setCommentaires]=useState([]);

    useEffect(()=>{
        axios.get(`http://localhost:5000/posts/comments/${props.post._id}`)
        .then(res =>{
            setCommentaires(res.data);
        })
        .catch(err=>{
            console.log('erreur dans le callback pour récuperer les commentaires du post:', err)
        })
    },[]);

    console.log("list");
    return(
        <div className='commentSection'>  
    
           {Commentaires.map((comment, index) => (
                <div key={index}>
                    <div className='comment'>
                        <Comment comment={comment}/> 
                    </div>
                    <div className='inlinecomments'/>
                </div>
            ))}

        </div>
    );
};