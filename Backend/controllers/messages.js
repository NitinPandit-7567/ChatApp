const Users = require('../models/users')
const Messages = require('../models/messages')
const AppError = require('../utils/AppError')
const wrapAsync = require('../utils/wrapAsync')
module.exports.new = wrapAsync(async (req, res, next) => {
    const sender_id = req.session.user_id;
    const sender = await Users.findById(sender_id)
    const { id: receiver_id } = req.params
    const receiver = await Users.findById(receiver_id)

    if (receiver) {
        // const message = new Messages({ messages: [{ notification: { notification_type: 'new', message: `New conversation started by ${sender.username}` } }] });
        // message.users.push(sender, receiver)
        const message = new Messages();
        message.users.push(sender, receiver)
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
                if (message.messages.length !== 0) {
                    res.json({ sender, receiver, messages: message.messages })
                }
                else {
                    res.json({ sender, receiver })
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
    console.log('MSG: ', msg)
    const message = await Messages.findById(message_id);
    if (message) {
        console.group('Dates')
        console.log(message.updatedAt)
        console.log(Date.now())
        console.groupEnd();
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