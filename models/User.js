const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const saltRounds = 10

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxLength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minLength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
})

//실제로 'save'하기 전에(pre) 무엇을 한다는 것을 의미
userSchema.pre('save', function(next){

    var user = this;

    //어떤 변화가 있을 때 마다 이 함수가 실행되므로 비밀번호가 변경 되었을 경우에만 실행되도록 조건 추가
    if(user.isModified('password')){

        //salt 생성
        bcrypt.genSalt(saltRounds, function(err, salt){
            if(err) return next(err)

            //salt로 비밀번호 해싱
            bcrypt.hash(user.password, saltRounds, function(err, hash){
                if(err) return next(err)
                user.password = hash
                next()
            })
        })
    }
})

const User = mongoose.model('User', userSchema)

module.exports = {User}