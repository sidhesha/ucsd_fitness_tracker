const express = require('express');
const router = express.Router();
const Message = require('../../database/models/message');

/* /api/chat/* endpoint controllers */
router.get('/:conversationId', async (req, res, next) => {
    if (!req.user) {
        res.status(401);
        res.json({error: "User not logged in"});
        return;
    }

    // TODO: If we do private messages / group chats, this needs to check that the user is a participant in the Conversation
    Message.find(req.params.conversationId === 'global'? { global: true } : { conversationId: req.params.conversationId})
        .sort({ timestamp: -1 }) 
        .limit(50)
        .populate('sender', 'firstName lastName fullName image')
        .exec()
        .then(messages => res.status(200).json(messages))
        .catch(err => {
            res.status(404).json({error: `Conversation with id ${req.params.conversationId} does not exist or cannot be accessed by you.` })
        });
    })

router.get('/', (req, res, next) => {
    res.status(404).json({message: 'No conversation id provided'})
})

module.exports = router;
