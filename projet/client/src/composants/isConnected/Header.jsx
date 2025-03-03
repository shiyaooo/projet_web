import './Header.css'
import image from '../Icones/NomApp.png'
import deco from '../Icones/deconnexion_bouton.png'
import logo from '../Icones/SpreadApp.png'
import {useState, useEffect} from 'react';
import MessagePage from './MessagePage/MessagePage';
import HomePage from './HomePage/HomePage';
import ProfilePage from './ProfilePage/ProfilePage';
// import axios from 'axios';

function Header(props){
    const [pageType, setPageType]=useState(props.type);
    const [AllPages,setAllPages]=useState([
        {id:'home_page', name:"Page d'accueil"},
        {id:'profile_page', name:"Voir mon profil"},
        {id:'message_page', name:"Lire mes messages"}
    ]);


    

    const handleLogout = (ev) => {
        ev.preventDefault();
        props.onLogout();
    }

    const pageTypeHandler=(event)=>{
        event.preventDefault()
        let pagetype=event.target[event.target.selectedIndex].text;//récupère la valeur selectionnée
        if (pagetype==="Page d'accueil"){
            setPageType('home_page');
        }else if (pagetype==="Voir mon profil"){
            setPageType('profile_page');
        }else{
            setPageType('message_page');
        }
    }

    return(
        <div className='render_Header'>
            <div className='all_Header'>
                <img src={logo} id='logo_Header' alt='logo'/>
                <img src={image} id='image_Header' alt='nomApp'/>
                <div className='deco_Header'>
                    <select onChange={pageTypeHandler} id="menu_Header">
                        {AllPages.map((item, index) => (//'index est généré automatiquement par la méthode map()
                            <option key={index} value={item.id}>
                                {item.name}
                            </option>
                        ))}
                    </select>
                    <button id="signe_button"> <img id="signe_Header" src={deco} alt="Logout" onClick={handleLogout} /></button>
                </div>
            
            </div>
            <div className='down_Header'>
            {pageType==='profile_page'?<ProfilePage user={props.user}/>:(pageType==='message_page'?<MessagePage user={props.user}/>:<HomePage user={props.user}/>)}
            </div>
        </div>
        
    );
};

export default Header;