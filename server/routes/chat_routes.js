const { getChatsName, newChat, updateChat } = require("../controllers/chat_controller");
const express = require('express');
const router = express.Router();

router.post('/chatList', getChatsName);
router.route('/')
      .post(newChat)
      .put(updateChat);

module.exports = router;