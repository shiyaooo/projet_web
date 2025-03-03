const ObjectID= require('mongoose').Types.ObjectId;
const router = require("express").Router();
const Message = require("../models/privateMsgModel");

//----------AJOUTER UN MESSAGE------------------------
router.post("/", async (req, res) => {
  const newMessage = new Message(req.body);

  try {
    const savedMessage = await newMessage.save();
    res.status(200).json(savedMessage);
  } catch (err) {
    res.status(500).json(err);
  }
});

//----------RECUPERER UN MESSAGE------------------------
router.get("/:conversationId", async (req, res) => {
  if (!ObjectID.isValid(req.params.conversationId)){//on vérifie que ID demandé existe bien dans BDD
    return res.status(400).send('ID unknown :' + id);
  }
  try {
    const messages = await Message.find({  //on vérifie que ce conservation existe bien dans BDD
        conversationId: req.params.conversationId,
    });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
});

//----------SUPPRIMER UN MESSAGE------------------------
router.delete("/delet/:id", async (req, res) => {
  const id = req.params.id;
  if (!ObjectID.isValid(id)){//on vérifie que ID demandé existe bien dans BDD
    return res.status(400).send('ID unknown :' + id);
  }

  try {
    await Message.findByIdAndDelete(id);
    res.status(200).json("Message deleted");
  } catch (err) {
    res.status(500).json(err);
  }
});




module.exports = router;
