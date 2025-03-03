import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import './HomePageSearch.css';
import Spread from './Spread';
import People from '../ProfilePage/People';
import Search from '../../Icones/Search.png';

function HomePageSearch(props){

    const[recherche,setRecherche]=useState("");
    const[results, setResults]=useState([]);
    const[filtre, setFiltre]=useState('people');
    const [PH, setPH] = useState('Rechercher un spreader');


    const handleInputChange=(ev)=>{
        let value=ev.target.value
        setRecherche(value);
    };

    const handleSubmit=(ev)=>{
        ev.preventDefault();
    }

    const filtreHandler=(ev)=>{
        let searchType=ev.target[ev.target.selectedIndex].text;
        if (searchType==='Spread'){
            setFiltre('spread');
            setPH('Rechercher un spread');
        } else{
            setFiltre('people');
            setPH('Rechercher un spreader');
        } 
    }

    const handleSearching=async()=>{
        let res=[];
        try{
            if (filtre==='people'){
                res=  await axios.get(`http://localhost:5000/users`);
            }else{
                res= await axios.get(`http://localhost:5000/posts`);
            }
            setResults(res.data);
        }catch(err){
            console.log("can't load the results from the database: ", err)
        }
    }

    useEffect( ()=>{
        if (recherche==="") return;
        handleSearching();
    },[recherche]);


    return (
        <div className='HomePageSearchRender'>
            <div >
                <form action="" onSubmit={handleSubmit} className="barresearchHP">
                    <input type="text" id="textareaSearchHP" placeholder={PH} onChange={handleInputChange}/>
                    <select onChange={filtreHandler}  id='filtreHP'>
                        <option className='optionsHP' key='People'>People</option>
                        <option  className='optionsHP' key='Spread'>Spread</option>
                    </select>
                    <button id='ButtonSearchHP'>
                        <img src={Search} alt='SearchIcone' id='SearchIconeHP'/>
                    </button>
                </form>
            </div>
            <div className="hm_trouve">
            {recherche !== "" ? (
                    filtre === 'people' ? 
                    (results.filter((val) => 
                        val.pseudo && val.pseudo.toLowerCase().includes(recherche.toLowerCase())
                        )
                        .map((val, index) => (
                        <>
                            <div className="trouver_hm" key={index}><People results={results} setResults={setResults} user={props.user} people={val}/></div>
                            <br/>
                        </>
                        )))
                    :
                    (results.filter((val) => 
                        val.contenu && val.contenu.toLowerCase().includes(recherche.toLowerCase())
                        )
                        .map((val, index) => (
                            <>
                            {console.log(val)}
                            <div className="trouver_hm" key={index}><Spread post={val} user={props.user}/></div>
                            <br/>
                        </>
                    )))
                    )
                :
                null
            }

           </div>
        </div>
    );
};

export default HomePageSearch;