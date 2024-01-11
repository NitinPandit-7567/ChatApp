const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const userSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    contact: {
        type: Number,
        required: true
    },
    chats: [{
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users'
        },
        message_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Messages'
        }
    }]
}, { timestamps: true })
userSchema.statics.findAndValidate = async function (user, pwd) {
    const u = await this.findOne({ username: user });
    if (u) {
        const result = await bcrypt.compare(pwd, u.password);
        if (result) {
            return u
        }
    }
    else {
        return false
    }
}
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    else {
        this.password = await bcrypt.hash(this.password, 12);
        return next()
    }
})



module.exports = mongoose.model('Users', userSchema)