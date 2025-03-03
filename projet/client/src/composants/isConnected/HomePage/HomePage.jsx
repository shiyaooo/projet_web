import {useState, useEffect} from 'react';
import axios from 'axios';
import './HomePage.css';
import BarreDeRecherche from './HomePageSearch';
import SpreadPost from './Spread';
import NewPost from './NewSpread.jsx';
import YellowBox from './TopSpreadersBox';

export default function HomePage(props){
    const [user,setUser] = useState(props.user); 
    const [reset, setReset] = useState(false); // 决定是否需要 重置搜索框
    const [spreads, setSpreads] = useState([]);


    const getReset=()=>{
        setReset(!reset);
        console.log(reset);
    }

    const handleSpreadList = async () => {
        try {
            // 获取我的所有spreads
            const MySpreads = await getSpreadList(user._id);
            setSpreads(MySpreads);

            //récupération des spreads de mes followings, 获取当前用户关注的人
            const res = await axios.get(`http://localhost:5000/users/${user._id}/Myfollowings`);
            const Myfollows = res.data;
            console.log("my followings " + Myfollows.map(f => f._id).join(", "));

            let stock = [];
            if (Myfollows) {
                for (let i = 0; i < Myfollows.length; i++) {
                    const followSpreads = await getSpreadList(Myfollows[i]._id);
                    stock = stock.concat(followSpreads);
                }
            }

            // récupération tous les spreads(user + ses followings )
            const allSpreads = MySpreads.concat(stock);
            setSpreads(allSpreads);

            // 获取所有spreads对应的用户信息
            // const spreadsIds = allSpreads.map(spread => spread.user);
            // getSpreader(spreadsIds);
        
        } catch (error) {
            console.log("Erreur chargement des spreads: ", error);
        }
    };

    /*const handleSpreadList = async () => {
        try {
            //recupération de mes spreads
            const MySpreads = await getSpreadList(user._id);
            setSpreads(MySpreads);

            //récupération des spreads de mes followings, 获取当前用户关注的人
            const res = await axios.get(`http://localhost:5000/users/${user._id}/Myfollowings`);

            const Myfollows = res.data;
            // console.log("my followings " +Myfollows[0]._id);
            // console.log("my followings " +Myfollows[1]._id);

            let stock = [];
            if (Myfollows){
                for (let i = 0; i < Myfollows.length; i++) {
                    const followSpreads = await getSpreadList(Myfollows[i]._id);
                    stock = stock.concat(followSpreads);
                }
            }

            // récupération tous les spreads(user + ses followings )
            // const allSpreads = MySpreads.concat(stock);
            setSpreads(allSpreads);
            // console.log("spread0 " +spreads[0].date);
            // console.log("spread1 " +spreads[1].date);
            // console.log("spread2 " +spreads[2].date);
            // console.log("spread3 " +spreads[3].date);
            // console.log("spread4 " +spreads[4].date);
            

        } catch (error) {
            console.log("Erreur chargement des spreads: ", error);
        }
    };*/
    
    const getSpreadList = async (id) => {
        try {
            const res = await axios.get(`http://localhost:5000/posts/postsFrom/${id}`);
            return res.data;
        } catch (error) {
            console.log("Erreur chargement des spreads du user: ", error);
        }
    };


    useEffect(() => {
        handleSpreadList();
    }, [reset]);

    return(
        <div className='render_HP'>
            <div className='Search_HP'>
                <BarreDeRecherche user={user} reset={reset} setReset={setReset}/>
                <br/>
            </div>
            <div className='down_HP'>
                <div className='Spreads_HP'> 
                    <div className='NewSpread_HP'>
                        <NewPost user={user} handleSpreadList={handleSpreadList} reset={reset} setReset={setReset}/>
                    </div>

                    <div className='FildActualite_HP'>
                        {spreads.length>0 && spreads.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                            .map(spread => (
                                <div className='spread_HP' key={spread._id}>
                                    {console.log("dans return " + spread.user)}
                                    {/* {console.log("dans return user " + spreader[spread.user])} */}
                                    <SpreadPost post={spread} user={user}/> 
                                </div>
                        ))}
                    </div>
                
                </div>

                <div className='TopSpreaders_HP'>
                    <YellowBox/>
                </div>
            </div>
            
        </div>
    )
};
