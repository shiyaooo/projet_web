import {useState} from 'react';
import './MessagePage.css'
import BarreDeRecherche from './MessageSearch';


export default function MessagePage(props){
    const [user,setUser] = useState(props.user); 

    return(
        <div className='render_MessagePage'>
           <div className="container">
                <BarreDeRecherche  user={user} />
            </div> 
        </div>
    )
};