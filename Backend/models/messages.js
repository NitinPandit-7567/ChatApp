const mongoose = require('mongoose');
const Users = require('./users')
const AppError = require('../utils/AppError')
const messagesSchema = new mongoose.Schema({
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        unique: true
    }],
    messages: [
        {
            notification: {
                notification_type: {
                    type: String,
                    enum: ['new', 'info', 'delete']
                },
                message: {
                    type: String
                }
            },
            message: {
                sender: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Users'
                },
                receiver: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Users'
                },
                text: {
                    type: String
                }
            }
        }
    ]
}, { timestamps: true })
messagesSchema.post('save', async function (next) {
    if (!this.isModified('users')) {
        return next;
    }
    for (let i of this.users) {
        const user1 = await Users.findById(i);
        if (user1) {
            let user2 = i !== this.users[0] ? this.users[0] : this.users[1];
            user1.chats.push({ user_id: user2, message_id: this._id });
            await user1.save()
        }
        else {
            throw new AppError('404', 'User not found!')
        }
    }
    return next
})

module.exports = mongoose.model('Messages', messagesSchema)