const ObjectID= require('mongoose').Types.ObjectId;
const UserModel= require('../models/userModel');


module.exports.signUp= async( req,res)=>{
    const {nom, prenom, pseudo, password}= req.body//destructuring

    try{
        const user = await UserModel.create({nom, prenom, pseudo, password});
        res.status(201).json({user:user._id}+ "crée ! ");
    }
    catch(err){
        res.status(200).send("Cannot sing up: " + err);
    }
}


module.exports.getUsers= async (req,res)=>{
    try{
        const users = await UserModel.find().select();//trouve et prend tout
        res.status(201).json(users);
    }
    catch(err){
        res.status(200).send("Cannot get the users: " +err);
    }
};

module.exports.filterUserById = async (req, res)=>{
    if (!ObjectID.isValid(req.params.id)){//on vérifie que ID demandé existe bien dans BDD
        return res.status(400).send('ID unknown :' + req.params.id);
    }
    else{
        try{
            const user = await UserModel.findById(req.params.id);
            if (!user) {
                return res.status(404).send('User not found');
              }
            console.log(user);
            return res.send(user);
        }catch (err) {
            console.error('ID filtering issue: ' + err);
            res.status(500).send('ID filtering issue: ' + err);
        } 
    }
};

module.exports.filterUserByPseudo = async (req, res)=>{
    console.log(req.params);
    
    try{
        const user = await UserModel.findOne({ pseudo: { $eq: req.params.pseudo }}); 
        console.log(user);
        return res.send(user);
    } catch (error) {
        console.log('getting pseudo issue from user issue : ' + error);
    }
    
};

module.exports.getMyFriends =  async (req, res)=>{
    // console.log(req.params);
    if (!ObjectID.isValid(req.params.id)){//on vérifie que ID demandé existe bien dans BDD
        return res.status(400).send('ID unknown :' + req.params.id);
    }
    else{
        try{
            const user = await UserModel.findById(req.params.id);
            const friendIds = user.Myfriends; 
            const friends = await UserModel.find({ _id: { $in: friendIds }}); // on recup les users ayant ces id d'amis
            return res.status(200).json(friends);
        } catch (error) {
            console.log('getting friends issue: "' + error);
        }
    }
};

module.exports.getMyFollowings =  async (req, res)=>{
    console.log(req.params);
    if (!ObjectID.isValid(req.params.id)){//on vérifie que ID demandé existe bien dans BDD
        return res.status(400).send('ID unknown :' + req.params.id);
    }
    else{
        try{
            const user = await UserModel.findById(req.params.id);
            const followingsIds = user.Myfollowings; 
            const followings = await UserModel.find({ _id: { $in: followingsIds }}); 
            return res.status(200).json(followings);
        } catch (error) {
            console.log('getting followings issue: "' + error);
        }
    }
};

module.exports.getMyFollowers =  async (req, res)=>{
    console.log(req.params);
    if (!ObjectID.isValid(req.params.id)){//on vérifie que ID demandé existe bien dans BDD
        return res.status(400).send('ID unknown :' + req.params.id);
    }
    else{
        try{
            const user = await UserModel.findById(req.params.id);
            const followersIds = user.Myfollowers; 
            const followers = await UserModel.find({ _id: { $in: followersIds }}); 
            return res.status(200).json(followers);
        } catch (error) {
            console.log('getting followers issue: ' + error);
        }
    }
};

module.exports.changeBio = async (req,res)=>{
    if (!ObjectID.isValid(req.params.id)){//on vérifie que ID demandé existe bien dans BDD
        return res.status(400).send('ID unknown :' + req.params.id);
    }
    else{
        try{
            const updatedBio =  await UserModel.findByIdAndUpdate(
                {_id: req.params.id},
                { $set: {
                        bio: req.body.bio 
                    }
                },
                {new: true, upsert: true, setDefaultsOnInsert: true}, //à toujours mettre avec un put
            );
            if (!updatedBio) {
                return res.status(404).send('User not found');
            }
            res.send(updatedBio);
        }catch(err){
            console.log('Changing Bio issue: "' + err);
            res.status(500).send('Internal server error');
        }

    };
};


module.exports.follow = async (req, res)=>{
    if (!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.params.target_id)){//on vérifie que ID demandé existe bien dans BDD, target_id est dans route: ex => put('/:id/follow/:target_id')
        return res.status(400).send('ID of user of target unknown ' );
    }else{
        try{
            const user = await UserModel.findById(req.params.id); 
            const userID = user.id 

            const target = await UserModel.findById(req.params.target_id); 
            const targetID = target.id

            if(user.Myfollowings.includes(targetID)){
                return res.send(user.id + " already followed " + target.id);
            }
            
            //incrémentation des followers et followings
            await UserModel.findByIdAndUpdate(
                userID,
                { $addToSet: { Myfollowings: targetID } },
                { new: true }
            );
            
            await UserModel.findByIdAndUpdate(
                targetID,
                { $addToSet: { Myfollowers: userID } },
                { new: true }  // utilisée dans une requête de mise à jour pour retourner le document mis à jour plutôt que l'ancien document
            );            

            
            //nouvelle amitié si les 2 se suivent
            if (target.Myfollowings.includes(userID)){
                
                await UserModel.findByIdAndUpdate(
                    userID,
                    { $addToSet: { Myfriends: targetID } },
                    { new: true }
                );
                
                await UserModel.findByIdAndUpdate(
                    targetID,
                    { $addToSet: { Myfriends: userID } },
                    { new: true }  
                );  
            }
            return res.status(201).send(userID + ' followed ' + targetID );
        } catch (error) {
            console.log('cannot follow: ' + error);
        }
    }
}


module.exports.unfollow = async (req, res)=>{
    if (!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.params.target_id)){//on vérifie que ID demandé existe bien dans BDD
        return res.status(400).send('ID of user or target unknown ' );
    }else{
        try{
            const user = await UserModel.findById(req.params.id); 
            const userID = user.id

            const target = await UserModel.findById(req.params.target_id); 
            const targetID = target.id


            //décrémentation des followers et followings
            await UserModel.findByIdAndUpdate(
                userID,
                { $pull: { Myfollowings: targetID } },
                { new: true }
            );
            
            await UserModel.findByIdAndUpdate(
                targetID,
                { $pull: { Myfollowers: userID } },
                { new: true }  // utilisée dans une requête de mise à jour pour retourner le document mis à jour plutôt que l'ancien document
            );            

            // amitié terminée si les 2 se suivent
            if (target.Myfriends.includes(userID)){
                
                await UserModel.findByIdAndUpdate(
                    userID,
                    { $pull: { Myfriends: targetID } },
                    { new: true }
                );
                
                await UserModel.findByIdAndUpdate(
                    targetID,
                    { $pull: { Myfriends: userID } },
                    { new: true }  
                );  
            }
            return res.status(201).send(userID + ' unfollowed ' + targetID );
        } catch (error) {
            console.log('cannot unfollow: ' + error);
        }
    }
}
  

module.exports.deleteUser = (req, res) => {

    if (!ObjectID.isValid(req.params.id)){
        return res.status(400).send('ID unknown :' + req.params.id);
    }
    
    const id = req.params.id;
    UserModel.findByIdAndDelete(id)
    .then(() => {
        res.status(200).send('User deleted');
    })
    .catch((err) => {
        res.status(500).send('Error deleting user:' +err);
    });
};


