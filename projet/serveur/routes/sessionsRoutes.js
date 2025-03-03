const express=require('express');
const userModel = require('../models/userModel');
const router=express.Router();

//--------------------CREER UNE SESSION---------------------------------
router.post('/login/:id', async (req, res) => {
  try{
    req.session.user = { id: req.params.id};

    console.log(req.session.user)

      const user= await userModel.findByIdAndUpdate(
        {_id: req.params.id},
        {
            $set: {
                isConnected: true
            }
        },
        {new: true}
      );
      
      if(!user){
        console.log("Cannot unset User on online mode");
      }
      console.log("Ouverture d'une session");
      res.status(200).json(user);
  } catch (error) {
    res.status(401).json({ message: 'Cannot open a new session' });
  }
});
  

//------------------SUPPRIME LA SESSION---------------------------------
router.post('/logout/:id', async (req, res) => {
    
    try{
      req.session = null;

      const user= await userModel.findByIdAndUpdate(
        {_id: req.params.id},
        {
            $set: {
                isConnected: false
            }
        },
        {new: true}
      );
      if(!user){
        console.log("Cannot unset User on online mode");
      }
    res.send('Fermeture session');
  } catch (error) {
    res.status(401).json({ message: `Cannot close the user ${req.params.id}'s session` });
  }
});
  

//--------------------CHECK UNE SESSION---------------------------------
router.get('/dashboard', async (req, res) => { // 路由的作用是检查是否有已登录的用户, 如果有，就将其存入 Session 并返回该用户的数据。
    try{
      const userOnline= await userModel.findOne(
        {isConnected: true}
      )
      if (userOnline){
        console.log(userOnline);
        req.session.user=userOnline;
        res.status(200).json(req.session.user)
      }else {
        return res.status(404).json({ message: "Aucun utilisateur en ligne." });
    }
      
    } catch (error) {
      res.status(401).json({ message: `session invalide` });
    }
    
});

  
module.exports = router; 
