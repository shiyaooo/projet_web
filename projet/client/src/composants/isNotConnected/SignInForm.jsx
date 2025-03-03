import {useState} from 'react';
import './SignInForm.css';
import logo from '../Icones/SpreadApp.png';
import image from '../Icones/NomApp.png';
import SignUpForm from'./SignUpForm.jsx'
import axios from 'axios';

function SignInForm(props){
    const [username,setUsername]=useState('');
    const [password,setPassword]=useState('');

    const [ToggleInscription,setToggleInscription]=useState(false); // 控制是否显示注册表单

    const handleLogin=async (ev)=>{
        // 阻止表单提交后刷新页面
        ev.preventDefault();

        console.log(username);

        //gestion de la session et de la connexion de l'user
        const res = await axios.get('http://localhost:5000/users/FromPseudo/'+ username)
        .then(res => { 
            if (res.data.pseudo===username && res.data.password===password){
                props.setUser(res.data);
                // alert("Connexion réussie");
                // props.onLogin();
                
                // const id = props.user;
                axios.post('http://localhost:5000/session/login/' + res.data._id)
                .then(res => {
                    // const token=res.data.token;
                    // localStorage.setItem('token', token);
                    alert("Connexion réussie");
                    props.onLogin();
                })
                .catch(error => console.log(error));
                
            
            }else{
                alert("Identifiant ou mot de passe incorrect, merci de réessayer");
            }
        })
        .catch((error) => {
            alert("Identifiant ou mot de passe incorrect, merci de réessayer");
            console.log("Erreur connexion (methode getUserFromPseudo): ",error);
        });

        
    }
    
    return(
        <div className="rendu_SIF">
            <div className="all_SIF">
                <div className="logodiv_SIF">
                    <img src={logo} id="logo_SIF" alt='SpreadAppLogo'/>
                </div>
            {!ToggleInscription && (
                <div className='in_SIF'>
                    <div className="one_SIF">
                        <h1 className="sign-in_SIF">Welcome back !</h1>
                        <form action="" method="post" onSubmit={handleLogin} className="form_SIF">
                            <label htmlFor="id_SIF">Identifiant: </label>
                            <input type="text" id="id_SIF" onChange={(ev)=>setUsername(ev.target.value)} value={username}/>
                            <label htmlFor="mdp_SIF">Mot de Passe: </label>
                            <input type="password" id="mdp_SIF" onChange={(ev)=>setPassword(ev.target.value)} value={password}/>
                        </form>
                        <input className='B_SIF' type="submit" id="bouton_SIF" onClick={handleLogin} value="Connecte-toi"/>
                    </div>

                    <div className="two_SIF">
                        <h2 className='sign-up_SIF'>Tu es nouveau.. ? </h2>
                        <button className='B_SIF' id="boutonbis_SIF"  type="submit" onClick={()=>setToggleInscription(true)}>Inscrit-toi ici </button>
                    </div>
                </div>
            )}

            {ToggleInscription && (
                <SignUpForm goBack={()=>setToggleInscription(false)} onLogin={props.onLogin} user={props.user} setUser={props.setUser} />
            )} 
            
            </div>

            <div className="look_SIF">
                 <img src={image} id="image_SIF" alt='SpreadApp'/>
            </div>
        </div>
        
    );
};

export default SignInForm;