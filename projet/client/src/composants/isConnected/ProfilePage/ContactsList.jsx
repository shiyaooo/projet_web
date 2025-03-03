import {useState, useEffect} from 'react';
import People from './People';
import axios from 'axios';
import './ContactsList.css';

export default function ContactsList(props){
    const [user, setUser] = useState(props.user);
    const [MyPeople, setMyPeople] = useState([]);
    const [peopleType, setPeopleType] = useState('');


    const getMypeople=async (peopleType)=>{
        const res = await axios.get(`http://localhost:5000/users/${user._id}/${peopleType}`)
        .then((res) => {
            setMyPeople(res.data);
        })
        .catch((err) => {
            console.log("can't load the contacts in the profile page: ", err);
        });
    }

    useEffect(() => {
        if (props.contacts==='showFriends') {
            setPeopleType('Myfriends');
        }else if (props.contacts==='showFollowers'){
            setPeopleType('Myfollowers');
        }else if (props.contacts==='showFollowings'){
            setPeopleType('Myfollowings');
        }
        getMypeople(peopleType);
    }, [props.reset]);

    return(
        <div className='render_contactList'>
            {peopleType==='Myfriends' ?
                <h4 id='type'>My friends</h4>
                :(peopleType ==='Myfollowers' ?
                    <h4 id='type'>My followers</h4>:
                    <h4 id='type'>My followings</h4>)
            }
           
            {MyPeople.length>0 && MyPeople.map((val, index) => (
                <>
                    <div className="trouver_hm" key={index}><People results={props.reset} setResults={props.setReset} user={user} people={val}/></div> 
                    <br/>
                </>
            ))}
        </div>

    );
};

        