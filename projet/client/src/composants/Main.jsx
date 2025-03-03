import {useState,useEffect} from 'react';
import SignInForm from './isNotConnected/SignInForm.jsx';
import Header from './isConnected/Header.jsx';
import axios from 'axios';

function Main(){
    const[page,setPage]=useState("welcome_page");
    const [isConnected, setConnected] = useState(false);
    const [user, setUser]=useState([]);

    //faire un useEffect
    function handleLogout(){
        //gestion de la session
        axios.get('http://localhost:5000/session/logout')
        .then(res => console.log(res.data))
        .catch(error => console.log(error));

        setConnected(false);
        setPage("welcome_page");
        console.log(page);
    }

    function handleLogin(){
        setConnected(true);
        setPage("home_page");
        console.log(page);
    }

    return(
        <div className="Main">
            {page==="welcome_page"?<SignInForm onLogin={handleLogin} user={user} setUser={setUser} />:<Header type={page} onLogout={handleLogout} user={user} setUser={setUser}/>}
    </div>
    );
};

export default Main;