const express=require('express');
const router=express.Router();
const userController = require('../controllers/user.controller')

//--------------------AJOUTER UN USER--------------------------   
router.post("/signup", userController.signUp);

//-------------------CHARGER LES USERS-------------------------   
router.get("/", userController.getUsers);

//--------------CHARGER UN USER SPECFIQUE----------------------    
router.get('/:id', userController.filterUserById);

//-----------CHARGER UN USER DEPUIS SON PSEUDO-----------------    
router.get('/FromPseudo/:pseudo', userController.filterUserByPseudo);

//-----------------------FOLLOW--------------------------------     
router.put('/:id/follow/:target_id', userController.follow);

//---------------------UNFOLLOW--------------------------------      
router.put('/:id/unfollow/:target_id', userController.unfollow);

//-----------------CHARGER LES AMIS----------------------------     
router.get('/:id/Myfriends',userController.getMyFriends);

//----------------CHARGER LES FOLLOWERS------------------------     
router.get('/:id/Myfollowers',userController.getMyFollowers);

//----------------CHARGER LES FOLLOWINGS-----------------------     
router.get('/:id/Myfollowings',userController.getMyFollowings);

//-------------------CHANGER LA BIO----------------------------     
router.put('/:id/changeBio',userController.changeBio);


//------------------SUPPRIMER USER-----------------------------     
router.delete('/:id',userController.deleteUser);


module.exports = router;
