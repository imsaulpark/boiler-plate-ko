const { User } = require('../models/User')

// 인증 처리를 하는 곳
let auth = (req, res, next) =>{

        // 클라이언트 쿠키에서 토큰을 가져온다.
        let token = req.cookies.x_auth;

        // 토큰을 복호화 한 후 유저를 찾는다.
        User.findByToken(token, (err,user) =>{
            if(err) throw err;
            if(!user) return res.json({isAuth: false, error: true});
            
            // 추후 index.js 에서 req.token,user를 사용하기 위해 여기서 넣어줌
            req.token = token;
            req.user = user;
            next();
        })

        // 유저가 있으면 인증 O

        // 유저가 없으면 인증 X
        
}

module.exports = { auth };