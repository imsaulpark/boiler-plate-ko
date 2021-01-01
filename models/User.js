const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const saltRounds = 10
const jwt = require('jsonwebtoken')

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
    }else{
        next()
    }
})

userSchema.methods.comparePassword = function(plainPassword, cb){
    // salt 없이 컴페어 가능?
    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
        if(err) return cb(err)
        cb(null, isMatch)
    })
}

userSchema.methods.generateToken = function(cb){
    
    var user = this;
    
    //jswonwebtoken을 통해 토큰 생성
    var token = jwt.sign(user._id.toHexString(), 'secretToken')

    user.token = token
    user.save(function(err,user){
        if(err) return cb(err)
        cb(null, user)

        // 토큰을 저장한다. 
    })

}

userSchema.statics.findByToken = function(token, cb){
    var user = this;

    // 토큰을 decode 한다.
    jwt.verify(token, 'secretToken', function(err, decoded){
        //유저 아이디를 이용해서 유저를 찾고 클라이언트에서 가져온 토큰과 디비 토큰을 비교

        user.findOne({"_id": decoded, "token": token}, function(err, user){
            if(err) return cb(err);
            cb(null, user);
        })
    })

}


const User = mongoose.model('User', userSchema)

module.exports = {User}