const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true
  },
  description: {
    type: String,
    require: false
  },
  quantity: {
    type: Number,
    require: true
  },
  price: {
    type: Number,
    require: true
  },
  imageUrl: {
    type: String,
    require: false,
  },
  createAt: {
    type: Date,
    default: Date.now()
  }
})


module.exports = mongoose.model('Product', productSchema)