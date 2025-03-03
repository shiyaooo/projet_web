const ObjectID= require('mongoose').Types.ObjectId;
const CommentModel = require('../models/commentsModel'); 
const PostModel= require('../models/postsModel');
const path = require('path');

module.exports.getPosts = async (req, res)=>{
    
    try{
        const posts = await PostModel.find().select();
        res.status(201).json(posts);
    }

    catch(err){
        res.status(200).send("Cannot get the posts: "+err);
    }

};

module.exports.postPost = async(req, res)=>{

    if (!ObjectID.isValid(req.params.id)){//on vérifie que ID demandé existe bien dans BDD
        return res.status(400).send('ID unknown :' + req.params.id);
    }

    try{
        if (req.file && (req.file.path.startsWith('uploads\\') || req.file.path.startsWith('./') )) { // 判断是否有文件上传（req.file 存在, 检查文件路径是否是本地路径（uploads/ 或 ./ 开头）。
            // Extraire le nom de fichier à partir du chemin
            const fileName = path.basename(req.file.path); 
          
            // Modifier la valeur de req.file.path avec le nom de fichier extrait
            req.file.path = fileName;
        }

        const newRecord = new PostModel({
            // const {author, message}=req.body;   PostModel.create({author,message});
            user: req.params.id,
            contenu:req.body.contenu,
            image: req.file ? req.file.path: null,
        });
        
        const savedPost = await newRecord.save(); newRecord.save() // 将数据存入 MongoDB
        res.json ("post sent:"+ {newRecord: newRecord._id}); // 返回 newRecord._id（新建的 Post ID)

    }catch(err){
        console.error("Error to send the post: ", err);
        res.status(500).send("Internal server error");
    }

}

module.exports.deletePost = async (req, res) => {
    const id = req.params.id;
    if (!ObjectID.isValid(id)){//on vérifie que ID demandé existe bien dans BDD
        return res.status(400).send('ID unknown :' + id);
    }
    await PostModel.findByIdAndDelete(id)
    .then(() => {
        res.status(200).send('Post deleted');
    })
    .catch((err) => {
        res.status(500).send('Error deleting post:' +err);
    });
};


module.exports.getPostsFromUser = async (req, res) =>{
    if (!ObjectID.isValid(req.params.user_id)){
        return res.status(400).send('ID unknown of user ');
    }

    try{
        const Docs = await PostModel.find({ user: { $eq: req.params.user_id }});
        res.status(201).json(Docs);
    }

    catch(err){
        res.status(200).send("Cannot get his/her posts: "+err);
    }

}

module.exports.likePost = async (req, res) =>{

    if (!ObjectID.isValid(req.params.user_id) || !ObjectID.isValid(req.params.target_id)){//on vérifie que ID demandé existe bien dans BDD
        return res.status(400).send('ID unknown of user or post ');
    }

    try{
        await PostModel.findByIdAndUpdate(
            req.params.target_id,
            { $addToSet: { likes : req.params.user_id } },
            { new: true } //on renvoie la version updated
        ); 
        res.send("post liked !");   
    } catch (error) {
        res.send(req.params.user_id + 'cannot like the post: ' + error);
    }
};

module.exports.unlikePost = async (req, res) =>{

    if (!ObjectID.isValid(req.params.user_id) || !ObjectID.isValid(req.params.target_id)){//on vérifie que ID demandé existe bien dans BDD
        return res.status(400).send('ID unknown of user or post ');
    }

    try{
        await PostModel.findByIdAndUpdate(
            req.params.target_id,
            { $pull: { likes : req.params.user_id } },
            { new: true } 
        );  
        res.send("post unliked ..");  
    } catch (error) {
        console.log(req.params.user_id + 'cannot unlike the post: ' + error);
    }
};

module.exports.getComments =  async (req, res) =>{
    if (!ObjectID.isValid(req.params.id)){//on vérifie que ID demandé existe bien dans BDD
        return res.status(400).send('ID unknown :' + req.params.id);
    }

    try{
        const Post = await PostModel.findById(req.params.id);
        const Comments = Post.commentaires;
        const Docs = await CommentModel.find({ _id: { $in: Comments }});
        res.status(200).json(Docs);
    }catch(err){
        res.status(500).send('Error getting the comments:' +err);
    }
};


module.exports.addComment = async (req, res) =>{
    if (!ObjectID.isValid(req.params.id)){
        return res.status(400).send('ID unknown :' + req.params.id);
    }  

    try{

        //créé le commentaire
        const newRecord = new CommentModel({  
            user: req.body.author,    
            message:req.body.message
        });
        
        // Sauvegarde du commentaire
        const saveComment =await newRecord.save(); 

        if(!saveComment){
            console.error("Error to create the comment " );
        }
        // newRecord.save((err,docs)=>{
        //     if (!err) console.log("comment created !");
        //     else console.log("Error to create the comment : " + err);
        // })

        //associe le commentaire au post actuel
        await PostModel.findByIdAndUpdate(
            req.params.id,
            {$addToSet : {commentaires:newRecord._id}},
            {new :true}
        )
        
        res.status(201).json({newRecord : newRecord._id} + ' Comment added !');
    }

    catch(err){
        res.status(500).send('Error saving the comment:' +err);
    }
};

