const router = require('express').Router();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

//model
const User = require('../model/User')

// @route  GET api/users
// @desc   GET all users
router.get('/', async(_, res) => {
  try {
    const users = await User.find().sort({ createAt: - 1})
    res.status(200).json({
      isSuccess: true,
      data: users
    })
  } catch (err) {
    res.status(500).json({
      isSuccess: false,
      msg: "Get user failed"
    })
  }
})

// @route  GET api/users/:id
// @desc   GET a user
router.get('/:id', async (req, res) => {
  const id = req.params.id
  try {
    const user = await User.findById(id)
    res.status(200).json({
      isSuccess: true,
      data: user
    })
  } catch (err) {
    res.status(500).json({
      isSuccess: false,
      msg: "User not found"
    })
  }
})

// @route  PUT api/users/:id
// @desc   Update a user
router.put('/:id', async (req, res) => {
  const { password } = req.body
  const id = req.params.id
  const dataUpdate = {
    password
  }
  try {
    const user = await User.findOneAndUpdate(
      {_id: id},
      {$set: dataUpdate},
      {new : true}  
    )
    if(!user) {
      res.status(404).json({
        isSuccess: false,
        msg: "User not found"
      })
      return
    }
    res.status(200).json({
      isSuccess: true,
      msg: "User updated successfully"
    })
  } catch (err) {
    res.status(500).json({
      isSuccess: false,
      msg: "User not found"
    })
  }  
})

// @route  DELETE api/users/:id
// @desc   DELETE a user
router.delete('/:id', async (req, res) => {
  const id = req.params.id
  try {
    const user = await User.findOneAndRemove({ _id: id })
    if(!user) {
      res.status(404).json({
        isSuccess: false,
        msg: "User not found"
      })
      return
    }
    res.status(200).json({
      isSuccess: true,
      msg: "Delete Success"
    })
  } catch (err) {
    res.status(500).json({
      isSuccess: false,
      msg: "User not found"
    })
  }
})

// @route  LOGIN api/users/login
// @desc   LOGIN a user
router.post('/login', async (req, res) => {
  const { user_name, password } = req.body
  const user = await User.findOne({ user_name })
  if(!user) {
    res.status(400).json({
      isSuccess: false,
      msg: "ID or Password wrong"
    })
    return
  }
  
  //check valid password
  const isValidPassword = await bcryptjs.compare(password, user.password)
  
  if(!isValidPassword) {
    res.status(400).json({
      isSuccess: false,
      msg: "ID or Password wrong"
    })
    return
  }

  //create token
  const payload = {
    id: user._id,
    first_name: user._first_name,
    last_name: user._last_name,
    email: user._email
  }
  
  jwt.sign(
    payload,
    process.env.SECRET_KEY,
    {expiresIn : 3600},
    (err, token) => {
      if(err) throw err
      res.status(200).json({
        isSuccess: true,
        msg: 'login successful',
        token
      })
    }
  )
})

// @route  POST api/users/register
// @desc   Register a user
router.post('/register', async (req, res) => {
  const { first_name, last_name, email, password, user_name } = req.body

  // check user name exist
  const isUserNameExisted = await User.findOne({ user_name }) 
  if(isUserNameExisted) {
    res.status(500).json({
      isSuccess: false,
      msg: "User name is existed"
    })
    return
  }

  //hash password
  const salt = await bcryptjs.genSalt(10)
  const hashPassword = await bcryptjs.hash(password, salt)

  //create data
  const newUser = new User({
    first_name,
    last_name,
    email,
    user_name,
    password: hashPassword
  })
  
  try {
    await newUser.save()
    res.status(200).json({
      isSuccess: true,
      msg: "registerd successfully created"
    })
  } catch (e) {
    res.status(500).json({
      isSuccess: false,
      msg: e.message
    })
  }
})

// @route  LOGIN api/users/verify
// @desc   authenticate
router.post('/verify', async (req, res) => {
  const accessToken = req.header('x-auth-token')
  
  if (!accessToken) {
    res.status(400).json({
      isSuccess: false,
      msg: 'no token, authorization denied'
    })
    return
  }
  try {
    const user = await jwt.verify(accessToken, process.env.SECRET_KEY)
    res.status(200).json({
      isSuccess: true,
      user: user
    })
  } catch (err) {
    res.status(500).json({
      isSuccess: false,
      msg: 'Token is not valid'
    })
  }
})

module.exports = router;