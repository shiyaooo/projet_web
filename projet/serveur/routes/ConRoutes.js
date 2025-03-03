const router = require("express").Router();
const Conversation = require("../models/conversationModel");
const ObjectID= require('mongoose').Types.ObjectId;


//---------------------CREER UNE NOUVELLE CONV--------------------------------

router.post("/", async (req, res) => {    
    /*if (!ObjectID.isValid(req.params.sender) || !ObjectID.isValid(req.params.receiver)){//on vérifie que ID demandé existe bien dans BDD
        return res.status(400).send('one of the users ID is unknown ');
    }*/
    console.log(req.body.sender, req.body.receiver)
    if(req.body.sender === req.body.receiver) return res.status(401).send('Cannot send a message to himself');

    try{
    
      // 检查是否已存在这两个用户的对话
      const existingConversation = await Conversation.findOne({
        members: { $all: [req.body.sender, req.body.receiver] },
      });

      if (existingConversation) {
          return res.status(400).send('Exist conversation entre les 2 user'); // 直接返回已存在的对话
      }

      const newConversation = new Conversation({
        members: [req.body.sender, req.body.receiver],
      });

      const savedConversation = await newConversation.save();
      res.status(200).json(savedConversation);
    } catch (err) {
        res.status(500).json(err);
    }
});

//-----------------------RECUPERER CONV D'UN USER------------------------------

router.get("/:user", async (req, res) => {
    try {
        const conversation = await Conversation.find({  //on vérifie que ID demandé déja un conservation
        members: { $in: [req.params.user] },
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

//--------------------RECUPERER CONV ENTRE 2 USER------------------------------

router.get("/find/:user1/:user2", async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      members: { $all: [req.params.user1, req.params.user2] },
    });
    res.status(200).json(conversation)
  } catch (err) {
    res.status(500).json(err);
  }
});

//-----------------------SUPPRIMER CONV D'UN USER------------------------------
router.delete("/delet/:id", async (req, res) => {
  const id = req.params.id;
  if (!ObjectID.isValid(id)){//on vérifie que ID demandé existe bien dans BDD
      return res.status(400).send('ID unknown :' + id);
  }
  await Conversation.findByIdAndDelete(id)
  .then(() => {
      res.status(200).send('convesation deleted');
  })
  .catch((err) => {
      res.status(500).send('Error deleting conservation:' +err);
  });
});
module.exports = router;

