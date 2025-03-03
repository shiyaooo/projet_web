import {useState} from 'react';
import './SignUpForm.css';
import axios from 'axios';
import Modal from '../Modal';
import 'font-awesome/css/font-awesome.min.css';  // 引入 FontAwesome 图标库

export default function SignUpForm(props){
    const [username,setUsername]=useState('');
    const [password,setPassword]=useState('');
    const [password2,setPassword2]=useState('');
    const [nom,setNom]=useState('');
    const [prenom,setPrenom]=useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);

    const Popup = () => {
        console.log('ouvert');
        setIsOpen(!isOpen);
    };

    // 切换密码显示/隐藏
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const togglePassword2Visibility = () => {
        setShowPassword2(!showPassword2);
    };

    async function checkPseudoExistence(pseudo) {
        return axios.get(`http://localhost:5000/users/FromPseudo/${pseudo}`)
            .then(res => {
                console.log(res.data);
                return (res.data.pseudo === pseudo);
            })
            .catch(error => {
                console.log("Erreur connexion (methode getUserFromPseudo): ", error);
                return false;
            });
    };

    function handleSignup(ev) {
        ev.preventDefault();
        if (ev.target.id !== "bouton_SUF") return;

        // Vérification de l'existence du pseudo
        const checkPseudoPromise = checkPseudoExistence(username);

        // Vérification des critères du mot de passe
        const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[a-zA-Z]).{5,}$/;
        const checkPasswordCriteria = !regex.test(password);

        // Vérification de la correspondance des mots de passe
        const checkPasswordMatch = password !== password2;

        // Attente de la résolution des promesses
        Promise.all([checkPseudoPromise])
        .then(([pseudoExists]) => {
            if (pseudoExists) {
                alert("Il semblerait que vous ayez déjà un compte, merci de vous reconnecter.");
                return;
            }
            if (checkPasswordCriteria) {
                alert('Mot de passe invalide, revoyez les critères en cliquant le bouton `?`');
                return;
            }
            if (checkPasswordMatch) {
                alert("Attention, le deuxième mot de passe est différent du premier");
                return;
            }
      
            axios.post('http://localhost:5000/users/signup/', {
                prenom: prenom,
                nom: nom,
                pseudo: username,
                password: password
            })
            .then(response => {
                console.log('Utilisateur créé avec succès !');
                alert('Inscription réussie ! ');
                
                //gestion de la session et de l'inscription
                const ress= axios.get('http://localhost:5000/users/FromPseudo/'+ username)
                .then(res => { 
                    console.log(res.data);
                    props.setUser(res.data);  
                    console.log('USER: ', props.user);              
                })
                .catch((error) => {
                    console.log("Erreur pour stocker nouvel user: ",error);
                });
                
                if (ress){
                    const id = props.user._id;
                    axios.post('http://localhost:5000/session/login/' + id)
                    .then(res => {
                        console.log(res.data);
                        // const token=res.data.token;
                        // localStorage.setItem('token', token);

                        props.onLogin();

                    })
                    .catch(error => console.log(error));
                    
                }
                
            })
            .catch(error => {
                console.error('Erreur lors de la création de l\'utilisateur : ', error);
            });
        })
        .catch(error => {
            console.error('Erreur lors de la vérification de l\'existence du pseudo : ', error);
        });
}

    


    return(
        <div className='in_SIF'>
            <div className="one_SIF">
                <h1 className="sign-up_SUF">Inscription</h1>
                <form action="" method="post" onSubmit={handleSignup} className="form_SIF">
                    <div className="nompre_SUF">
                        <label htmlFor="nom_SUF">Nom </label>
                        <label htmlFor="prenom_SUF">Prénom </label>
                        <input type="text" id="nom_SUF" onChange={(ev)=>setNom(ev.target.value)} value={nom}/>
                        <input type="text" id="prenom_SUF" onChange={(ev)=>setPrenom(ev.target.value)} value={prenom}/>
                    </div>
                    <br/>
                    <label htmlFor="id_SUF">Choisir un identifiant: </label>
                    <input type="text" id="id_SUF" onChange={(ev)=>setUsername(ev.target.value)} value={username}/>
                    <label htmlFor="mdp_SUF">Mot de Passe: </label>
                    <div className='infoMdp'>
                        <input type={showPassword ? "text" : "password"} id="mdp_SUF" onChange={(ev)=>setPassword(ev.target.value)} value={password} className="password-input"/>  
                    
                        {/* 切换密码显示/隐藏的按钮 */}
                        <button onClick={togglePasswordVisibility} className="password-toggle-button" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>   
                        {showPassword ? (
                            <i className="fa fa-eye" style={{ fontSize: '15px' }}></i>  // 关闭眼睛图标
                            ) : (<i className="fa fa-eye-slash" style={{ fontSize: '15px' }}></i>  // 打开眼睛图标
                        )}
                        </button>                
                        
                        <button className="query" onClick={Popup}>?</button>      
                        <Modal isOpen={isOpen} onClose={Popup}>
                            <p className='popup'>Le mot de passe doit contenir:</p>
                            <ul className='popup'>
                                <li>Au moins 5 caractères</li>
                                <li>Au moins un chiffre</li>
                                <li>Au moins une lettre en majuscule</li>
                            </ul>
                            
                        </Modal>
                    </div>
                    <label htmlFor="mdp_SUF">Confirmer le mot de Passe: </label>
                    {/* <input type="password" id="mdp2_SUF" onChange={(ev)=>setPassword2(ev.target.value)} value={password2}/> */}
                    <div className='confir_info'>
                    <input type={showPassword2 ? "text" : "password"} id="mdp2_SUF" onChange={(ev)=>setPassword2(ev.target.value)} value={password2} className='password2-input'/>  
                    
                        {/* 切换密码显示/隐藏的按钮 */}
                        <button onClick={togglePassword2Visibility} className="password2-toggle-button" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>   
                        {showPassword2 ? (
                            <i className="fa fa-eye" style={{ fontSize: '15px' }}></i>  // 关闭眼睛图标
                            ) : (<i className="fa fa-eye-slash" style={{ fontSize: '15px' }}></i>  // 打开眼睛图标
                        )}
                        </button>  
                    </div>
                </form>
                <input className="goBack" type="button" onClick={()=>props.goBack()} value="<< Se Connecter"/>
                <input className='B_SIF' type="submit" id="bouton_SUF"  onClick={handleSignup} value="Valider l'inscription"/>
            </div>

                    
        </div>
    );
};