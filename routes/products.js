const router = require('express').Router();

const Product = require('../model/Product')

// @route  GET api/prodcuts
// @desc   GET all products
router.get('/', async(_, res) => {
  try {
    const prodcuts = await Product.find().sort({ createAt: - 1})
    res.status(200).json({
      isSuccess: true,
      data: prodcuts
    })
  } catch (err) {
    res.status(500).json({
      isSuccess: false,
      msg: "Get prodcut failed"
    })
  }
})

// @route  GET api/products/:id
// @desc   GET a product
router.get('/:id', async (req, res) => {
  const id = req.params.id
  try {
    const product = await Product.findById(id)
    res.status(200).json({
      isSuccess: true,
      data: product
    })
  } catch (err) {
    res.status(500).json({
      isSuccess: false,
      msg: "Prodcut not found"
    })
  }
})

// @route  POST api/products/addproduct
// @desc   Add Product
router.post('/addproduct', async (req, res) => {
  const { name, description, quantity, price, imageUrl } = req.body

  //create a new product
  const newProduct = new Product({
    name,
    description,
    quantity,
    price,
    imageUrl,
  })
  console.log(newProduct)
  try {
    await newProduct.save()
    res.status(200).json({
    isSuccess: true,
    msg: "add successfully product"
  })
  } catch (err) {
    res.status(500).json({
      isSuccess: false,
      msg: err.message
    })
  }
})



module.exports = router;