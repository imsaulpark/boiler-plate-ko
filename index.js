const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser')
const config = require('./config/key')
const { User } = require("./models/User")

//body parser가 클라이언트에서 오는 정보를 서버에서 분석해서 가져올 수 있게 해주는 것이므로
//application/x-www-form-urlencoded 타입으로 된 것을 가져올 수 있게 해주는 함수
app.use(bodyParser.urlencoded({extended: true}));

//application/json 타입으로 된 것을 가져올 수 있게 해주는 함수
app.use(bodyParser.json());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))

app.get('/', (req, res) => {
  res.send('Hello World!`_`!!')
})

//회원가입할 때 필요한 정보들을 client에서 받아온 후 db에 넣기
app.post('/register', (req, res) => {

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

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

