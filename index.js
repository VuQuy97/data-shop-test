const express = require('express') //new express
const cors = require('cors') // mở cors cho FE dùng
const app = express()
const mongoose = require('mongoose')
const port = process.env.PORT || 3000 // set port to 3000
const dotenv = require('dotenv')

const userRouter = require('./routes/users')
const productRouter = require('./routes/products')

app.use(cors()) // open cors
dotenv.config()

//connect db to server
mongoose.connect(process.env.DB_CONNECT, {
  useNewUrlParser: true,
}).catch(err => console.log('Connect failed: ', err))

app.use(express.json({ extended : true })) // use JSON

//Check running 
app.get('/', (req, res) => {
  res.send('API Running')
})

//router
app.use('/api/users', userRouter)
app.use('/api/products', productRouter)

app.listen(port, () => {
  console.log(`Server Up And Running Localhost:${port}`)
})