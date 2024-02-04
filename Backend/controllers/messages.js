const Users = require('../models/users')
const Messages = require('../models/messages')
const AppError = require('../utils/AppError')
const wrapAsync = require('../utils/wrapAsync')
async function sendLoad(user) {
    const users_messages = Promise.all(user.chats.map((el) => {
        async function data(el) {
            const u = await Users.findById(el.user_id);
            const username = u.username;
            const user_id = u._id;
            let count = 0;
            const message_id = el.message_id._id
            for (let i of el.message_id.messages) {
                console.log(i)
                if (i.message.text !== undefined) {
                    console.log('HERE: ', i, ' Loop: ', (i.message.seen === false && i.message.sender.toString() !== user._id.toString()))
                    if (i.message.seen === false && i.message.sender.toString() !== user._id.toString()) {
                        count += 1
                    }
                }
            }
            console.log('User: ', username, ' Unseen: ', count)
            const length = el.message_id.messages.length
            if (length > 0) {
                let type = 'message';
                const temp = el.message_id.messages[length - 1]
                let message = temp.message.text;
                if (!message) {
                    message = temp.notification.message;
                    type = 'notification'
                }
                const date = el.message_id.updatedAt;
                const sender = temp.message.sender;
                const receiver = temp.message.receiver;
                return { message_id: message_id, username: username, user_id: user_id, unseen: count, message: message, date: date, sender: sender, receiver: receiver, type: type }
            }
            else {
                return { message_id: message_id, username: username, unseen: count, user_id: user_id, date: date, sender: sender, receiver: receiver }
            }
        }
        return data(el)
    }))
    return users_messages
}
module.exports.new = wrapAsync(async (req, res, next) => {
    const sender_id = req.session.user_id;
    const sender = await Users.findById(sender_id)
    const { id: receiver_id } = req.params
    const receiver = await Users.findById(receiver_id)
    if (receiver) {
        // const message = new Messages({ messages: [{ notification: { notification_type: 'new', message: `New conversation started by ${sender.username}` } }] });
        // message.users.push(sender, receiver)
        const message = new Messages();
        // const date = new Date().toString();
        // message.Date = date;
        const timestamp = new Date()
        message.messages.push({ notification: { notification_type: 'new', message: `New conversation started by ${sender.username}`, timestamp: timestamp } })
        message.users.push(sender._id.toString(), receiver._id.toString()) //adding ._id 
        await message.save()
    }
    else {
        next(new AppError(404, 'Not Found'))
    }
    res.json(req.params)

})

module.exports.load = wrapAsync(async (req, res, next) => {
    const { id: message_id } = req.params;
    const message = await Messages.findById(message_id);
    if (message) {
        if (req.session.user_id === (message.users[0]).toString() || req.session.user_id === (message.users[1]).toString()) {
            console.group();
            let sender = null, receiver = null;
            for (let i of message.users) {
                console.log(i.toString())
                if (req.session.user_id === i.toString()) {
                    sender = i.toString();
                }
                else {
                    receiver = i.toString();
                }
            }
            if (sender && receiver) {
                const user_s = await Users.findById(sender);
                const user_r = await Users.findById(receiver);
                const users = { sender: { username: user_s.username, _id: user_s._id }, receiver: { username: user_r.username, _id: user_r._id } }
                if (message.messages.length !== 0) {
                    res.json({ ...users, messages: { _id: message._id.toString(), messages: message.messages } })
                }
                else {
                    res.json({ ...users })
                }
            }
            else {
                next(new AppError(401, 'Not Authorized'))
            }
        }
        else {
            next(new AppError(401, 'Not Authorized'))
        }
    }
    else {
        next(new AppError(404, 'Messages not found'))
    }
})

module.exports.post = wrapAsync(async (req, res, next) => {
    const { id: message_id } = req.params;
    const { message: msg } = req.body;
    const timestamp = new Date().toString();
    msg.timestamp = timestamp;
    console.log('MSG: ', msg)
    const message = await Messages.findById(message_id);
    if (message) {
        if (msg.sender && msg.receiver) {
            let check = false;
            for (let i of message.users) {
                if (msg.sender === req.session.user_id && msg.sender === i.toString()) {
                    check = true
                }
                else if (msg.receiver === i.toString()) {
                    check = true
                }
            }
            if (check) {
                message.messages.push({ message: msg });
                await message.save();
                res.json({ message })
            }
            else {
                next(new AppError(501, 'Invalid Data'))
            }
        }
        else {
            next(new AppError(401, 'Not Authorized'))
        }
    }
    else {
        next(new AppError(404, 'Not Found'))
    }
})

module.exports.index = wrapAsync(async (req, res, next) => {
    console.log('Load Request')
    const user = await Users.findById(req.session.user_id).populate({ path: 'chats', populate: { path: 'message_id' } });
    // .populate({ path: 'chats', populate: { path: 'user_id' } })
    // populate({ path: 'reviews', populate: { path: 'author' } })
    await sendLoad(user).then((data) => { res.send(data) })
})