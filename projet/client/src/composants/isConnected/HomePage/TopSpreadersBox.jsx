import {useState, useEffect} from 'react';
import axios from 'axios';
import './TopSpreadersBox.css';


export default function TopSpreadersBox(){
    const [allUsers, setAllUsers] = useState([]);
    const [topThreeUsers, setTopthreeUsers] = useState([]);
    const [allPosts, setAllPosts] = useState([]);

    const getAllUsers=async ()=>{
        //chargement des users
        try{
            const res= await axios.get(`http://localhost:5000/users`);
            setAllUsers(res.data.sort((a, b) => b.Myfollowers.length - a.Myfollowers.length));
        }catch(err){
            console.log("can't load the results from the database: ", err)
        }

        //chargement des posts
        try{
            const ress= await axios.get(`http://localhost:5000/posts`);
            setAllPosts(ress.data);
        }catch(err){
            console.log("can't load the results from the database: ", err)
        }
    }


    useEffect( ()=>{
        getAllUsers();
    },[]);

    useEffect(() => {
        setTopthreeUsers(allUsers.slice(0, 3));
    }, [allUsers]);    
      

    return(
        <div className='render_YellowBox'>
            <h3 id='facts'>##FACTS##</h3>
            <div className='statsYellowBox'>
                <p id='number'>{allUsers.length}</p>
                <p id='next_nbr'>spreaders</p>
                <p id='number'>{allPosts.length}</p>
                <p id='next_nbr'>spreads</p>
            </div>
            
            <div className='topthree'>
                <p id='topspreadersflag'>#Top3Spreaders#</p>
                { topThreeUsers.map(spreaders => (
                        <div className='infotopSpreaders'>
                                <p id='eachTopuser'>
                                    {spreaders.pseudo}
                                </p>
                                {spreaders.Myfollowers.length >1? <p id='number_followers'>{spreaders.Myfollowers.length} followers</p>: <p id='number_followers'>{spreaders.Myfollowers.length} follower</p>}
                        </div>
                        ))}
            </div>
        </div>
    );
};