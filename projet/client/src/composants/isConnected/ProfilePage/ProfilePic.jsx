import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import './ProfilePics/1.jpg'
import './ProfilePics/2.jpg'
import './ProfilePics/3.jpg'
import './ProfilePics/4.jpg'
import './ProfilePics/5.jpg'
import './ProfilePics/6.jpg'
import './ProfilePics/7.jpg'
import './ProfilePics/8.jpg'
import './ProfilePics/9.jpg'
import './ProfilePics/10.jpg'
import './ProfilePics/11.jpg'
import './ProfilePics/12.jpg'
import './ProfilePics/13.jpg'
import './ProfilePics/14.jpg'
import nopic from'./ProfilePics/nopic.jpg';


export default function ProfilePic(props){
    const [photo, setPhoto]=useState('');
    
     // 使用 import.meta.glob 动态导入图片
     const images = import.meta.glob('./ProfilePics/*.jpg', { eager: true });

    const getPicture=()=>{
      axios.get(`http://localhost:5000/pics/${props.user}`)
        .then(res => {
          // const profilePicPath = require('./ProfilePics/' + res.data.picture.toString() + '.jpg');
          const profilePicPath = `./ProfilePics/${res.data.picture}.jpg`;
          // setPhoto(profilePicPath);
          setPhoto(images[profilePicPath]?.default);
        })
      .catch(error => {
        console.log(error);
      });
    }

    useEffect(() => {
        getPicture();
    }, [photo, props.reset]);


    return(
        <div className="render_PP">
          {photo===''?
            <img src={nopic} alt='Ma photo' height={props.height} width={props.height}  style={{ borderRadius: '55%', marginLeft: props.marginLeft, marginTop: props.marginTop }}/>
            :
            <img src={photo} alt='Ma photo' height={props.height} width={props.height} style={{ borderRadius: '55%', marginLeft: props.marginLeft, marginTop: props.marginTop }}/>

          }
        </div>
    )
}; 
