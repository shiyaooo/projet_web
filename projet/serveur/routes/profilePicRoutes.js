const express=require('express');
const router=express.Router();
const PicModel= require('../models/profilePicModel');
const userModel= require('../models/userModel')
const ObjectID= require('mongoose').Types.ObjectId;

//--------------AJOUTER UNE PHOTO DE PROFIL------------------------
router.post('/add/:user_id/:picNumber', async (req, res) => {
    if (!ObjectID.isValid(req.params.user_id)) {
      return res.status(400).send('user unknown');
    }
    
    try{
        //save the new pic
        const newRecord = new PicModel({
            user: req.params.user_id,
            picture: req.params.picNumber,
        });
    
        const savePic = await newRecord.save(); 
        if(!savePic){
            return res.send("Error to save the picture ");
        }

        //update user info
        const user = await userModel.findOneAndUpdate(
            { _id: req.params.user_id },
            { profileImage: true },
            { new: true }
        );

        return res.status(200).json("pic ajouté");        ; // sortir de la fonction après la mise à jour de l'utilisateur
    }catch(err){
        return res.status(500).json('Erreur serveur pour ajouter photo de profil');
    }
    
  });
  


//--------------SUPPRIMER MA PHOTO DE PROFIL----------------------
router.delete('/:user_id', async (req,res)=>{
    if (!ObjectID.isValid(req.params.user_id)){
        return res.status(400).send('ID unknown :' + req.params.user_id);
    }
    
    //supprimer photo
    await PicModel.findOneAndDelete({user: req.params.user_id});

    //mise à jour de l'info dans user
    try{
        await userModel.findOneAndUpdate(
            {_id: req.params.user_id},
            {profileImage:false},
            {new: true}
        )
        return res.status(200).send('Post deleted and user updated');

    }catch(err) {
        return res.status(500).send('Error deleting the post or updating user info:' +err);
    }
})


//--------------CHANGER MA PHOTO DE PROFIL------------------------
router.put('/change/:user_id/:picNumber',async (req, res)=>{
    if (!ObjectID.isValid(req.params.user_id)){//on vérifie que ID demandé existe bien dans BDD
        return res.status(400).send('user unknown');
    }

    //save the new pic
    try{
        const pic = await PicModel.findOneAndUpdate(
        { user: req.params.user_id },   // filtre pour trouver le document à mettre à jour
        { picture: req.params.picNumber },        // nouvelle valeur 
        { new: true }       // options pour renvoyer le document mis à jour
        )
        return res.status(200).json('pic modified');
    }catch (error) {
        return res.status(500).json('Erreur serveur pour modifier photo de profil:', error );
    }        
});

//--------------RECUPERER MA PHOTO DE PROFIL----------------------
router.get('/:user_id',async (req, res)=>{
    if (!ObjectID.isValid(req.params.user_id)){//on vérifie que ID demandé existe bien dans BDD
        return res.status(400).send('user unknown');
    }

    try{
        const pic = await PicModel.findOne(
            { user: req.params.user_id }   // filtre pour trouver le document à mettre à jour
        )
        return res.status(200).json(pic);
    } 
    
    catch (error) {
        return res.status(500).json('Erreur serveur pour recuperer la photo de profil:', error );
    }        
});


module.exports = router;