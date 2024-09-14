const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const messageSchema = new Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now, required: true },
    global: { type: Boolean, required: true },
    conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation'}
});

messageSchema.pre('validate', function(next) {
    if (this.global && this.conversationId) {
        return next(new Error("Message cannot be both global and belong to a conversation."))
    } else if (!this.global && !this.conversationId) {
        return next(new Error("Message must be either global or belong to a conversation."))
    } else {
        return next();
    }
})

module.exports = mongoose.model('Message', messageSchema);
