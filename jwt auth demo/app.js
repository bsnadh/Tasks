// generated ACCESS_TOKEN_SECRET with crypto library in node --> require('crypto').randomBytes(64).toString('hex')

require('dotenv').config()

const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')

app.use(express.json())
  // dummy user data
const users = [
  {
    username: 'user1',
    title: 'post 1'
  },
  {
    username: 'user2',
    title: 'post 2'
  }
]

app.get('/users', authenticateToken, (req, res) => {
  //access to user when authenticated
  const result = users.filter(usr => usr.username === req.user.name)
  res.json(result)
  console.log(result)

})

app.post('/login', (req, res) => {
  // authenticate user

  // sign token

  const username = req.body.username
  const user = { name: username }


  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
  console.log(accessToken)
  res.json({ accessToken: accessToken })
})

function authenticateToken(req, res, next) {
  // access token from header
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.sendStatus(401)
  // verify token
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    // if the user has invalid/expired token
    if (err) res.sendStatus(403)
    req.user = user
    console.log(user)
    next()
  })
}

app.listen(3000)