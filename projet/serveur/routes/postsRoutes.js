const express=require('express');
const router=express.Router();
const postController = require('../controllers/post.controller')
const multer = require('multer'); // middleware pour gérer les fichiers uploadés, 处理文件上传
const path = require('path');


// CONFIGURATION DE MULTER pour enregistrer les fichiers dans le dossier "uploads"
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)) // creer nom de file
    }
});

const upload = multer({ storage: storage }); // 创建一个 Multer 实例，并指定存储方式（storage）


//--------------CHARGER LES MESSAGES PUBLICS (SPREADS)--------------   
router.get('/', postController.getPosts);

//--------------CHARGER LES MESSAGES PUBLICS D'UN USER--------------    
router.get('/postsFrom/:user_id', postController.getPostsFromUser);

//--------------POSTER UN MESSAGE PUBLIC (SPREAD)-------------------   
router.post('/:id', upload.single('file'), postController.postPost);  // upload.single('file') 让 Multer 处理 单个文件上传，文件字段名是 "file"

//--------------SUPPRIMER UN MESSAGE PUBLIC (SPREAD)----------------   
router.delete('/:id', postController.deletePost);

//--------------LIKER UN MESSAGE PUBLIC (SPREAD)--------------------   
router.put('/:user_id/like/:target_id', postController.likePost);

//--------------UNLIKER UN MESSAGE PUBLIC (SPREAD)------------------  
router.put('/:user_id/unlike/:target_id', postController.unlikePost);

//---------------------COMMENTER------------------------------------                 
router.post('/commenting/:id', postController.addComment);

//------------------VOIR LES COMMENTS-------------------------------      
router.get('/comments/:id', postController.getComments);

module.exports = router; 