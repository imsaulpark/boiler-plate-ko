const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser')
const config = require('./config/key')
const cookieParser = require('cookie-parser')
const { auth } = require("./middleware/auth")
const { User } = require("./models/User")

//body parser가 클라이언트에서 오는 정보를 서버에서 분석해서 가져올 수 있게 해주는 것이므로
//application/x-www-form-urlencoded 타입으로 된 것을 가져올 수 있게 해주는 함수
app.use(bodyParser.urlencoded({extended: true}));

//application/json 타입으로 된 것을 가져올 수 있게 해주는 함수
app.use(bodyParser.json());

app.use(cookieParser())

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))

app.get('/', (req, res) => {
  res.send('Hello World!`_`!!')
})

//회원가입할 때 필요한 정보들을 client에서 받아온 후 db에 넣기
app.post('/api/user/register', (req, res) => {

    //req.body에는 {id: "hello", password: "1234" } 이런식으로 존재하며 이는 bodyparser가 있기 때문
    const user = new User(req.body)
    
    //mongodb method, user db 저장하기
    user.save((err,userInfo) => {
        if(err) return res.json({ success: false, err}) //문제가 생길시 클라이언트에 실패, 에러문을 보내줌
        return res.status(200).json({   //성공시 상태 200, 성공을 클라이언트에 보내줌
            success: true
        })
    })
})

app.post('/api/users/login', (req,res) => {
  

    //유저의 이메일이 db에 있는지
    User.findOne({email:req.body.email}, (err,user) => {
      if(!user){
        return res.json({
          loginSuccess: false,
          message: "제공된 이메일에 해당되는 유저가 없습니다"
        })
      }
      //유저의 비밀번호가 맞는지
      user.comparePassword(req.body.password, (err,isMatch) => {
        if(!isMatch)
          return res.json({
            loginSuccess: false,
            message: "비밀번호가 틀렸습니다."
          })  

        //비밀번호가 맞다면 토큰 생성
        user.generateToken((err,user) => {
          if(err) return res.status(400).send(err);

          // 토큰을 저장 쿠키에
          res.cookie("x_auth", user.token)
          .status(200)
          .json({
            loginSuccess: true,
            userId: user._id
          })
        })
      })

    })
})

// auth라는 미들웨어는 콜백 함수를 부르기 전에 뭔가를 해 주는 것ㅋ
app.get('/api/users/auth', auth, (req, res) =>{

  // 안으로 성공적으로 진입 했다는 것은 auth가 true 라는 말.
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.emial,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image
  })
})

app.get('/api/users/logout', auth, (req,res)=>{

  User.findOneAndUpdate({_id: req.user.id},
    { token: ""}
    , (err,user) => {
      if(err) return res.json({ success: false, err });
      return res.status(200).send({
        success: true
      })
    })

})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

