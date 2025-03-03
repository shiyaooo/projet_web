import {useState, useEffect} from 'react';
import ProfilePic from './ProfilePic';
import './EditPhoto.css';
import LeftPP from '../../Icones/LeftPP.png';
import RightPP from '../../Icones/RightPP.png';
import axios from 'axios';

export default function EditPhoto(props){
   
    const [user, setUser] = useState(props.user);
    const [reset, setReset] = useState(false);
    const [firstRow, setFirstRow] = useState(true);
    
    const changeUserPic=async ()=>{
        try{
            //verification de l'existence d'une pdp chez l'user
            const hasPic = props.verifyPicExistence();

            if (hasPic){
                const res = await axios.put(`http://localhost:5000/pics/change/${props.user._id}/${props.picNumber}`);
            }

        }catch (err) {
            console.log("can't change the user pic: ",err);
        }
    };

    const handleClickPic=(ev)=>{
        const type=ev.target.id;
        if (type==='left'){
            if(props.picNumber===14) props.setPicNumber(1);
            else props.setPicNumber(props.picNumber+1);
        }else if (type==='right'){
            if (props.picNumber===1) props.setPicNumber(14);
            else props.setPicNumber(props.picNumber-1);
        }
    }


    useEffect(()=>{
        const getUsersPicNumberPromise = new Promise((resolve, reject) => {
            props.getUsersPicNumber();
            resolve();  // 表示这个异步操作已经完成
        });
        let resetPromise = null;
        if (firstRow){        //uniquement quand on charge la page (non modification de la photo)
             resetPromise = new Promise((resolve, reject) => {
                getUsersPicNumberPromise.then(() => {
                    props.getUsersPicNumber();
                    resolve();
                });
            });
            setFirstRow(!firstRow);
        }else{
            const changeUserPicPromise = new Promise((resolve, reject) => {
                getUsersPicNumberPromise.then(() => {
                    changeUserPic();  //requete PUT
                    resolve();
                });
            });
        
             resetPromise = new Promise((resolve, reject) => {
                changeUserPicPromise.then(() => {
                    props.getUsersPicNumber();   //requete GET
                    resolve();
                });
            });
        }

        resetPromise.then(() => {
            setReset(!reset);
        });
    }, [props.picNumber]);   

    const handleAddPic=async()=>{
        try {
            await axios.post(`http://localhost:5000/pics/add/${props.user._id}/${props.picNumber}`);
            props.setHasPic(!props.hasPic);
        } catch (err) {
            console.log("can't add a pic", err);
        }
    };

    const handleDeletePic=async()=>{
        try {
            await axios.delete(`http://localhost:5000/pics/${props.user._id}`);
            props.verifyPicExistence();
        } catch (err) {
            console.log("can't delete the pic", err);
        }
    };



    return(
        <div className='editphoto_render'>
            {props.hasPic?
                <>
                    <button id='leftButton' onClick={handleClickPic}><img src={LeftPP} id='left' alt='left'></img></button>
                    <ProfilePic user={user._id} height='190px' marginLeft='13px' marginTop='10px' reset={reset}/>
                    <button id='rightButton' onClick={handleClickPic}><img src={RightPP} id='right' alt='right'></img></button>
                    <button id='deletePic' onClick={handleDeletePic}>Supprimer la photo</button>
                </>
                :
                <div className='nopicsection'>
                    <ProfilePic user={user._id} height='190px' marginLeft='13px' marginTop='10px' reset='a'/>
                    <button id='addPicButton' onClick={handleAddPic}>Ajouter une photo</button>
                </div>
            }
            
        </div>
    );
};

