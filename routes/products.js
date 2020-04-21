const express = require('express');
const _ = require('lodash')
//import _ from '../node_modules/lodash'
const router = express.Router();
const Product = require('../models/product')
const User = require('../models/user')
const authenticationMiddleware = require('./../middlewares/authentication')
const ownerAuthorization = require('./../middlewares/ownerAuthorization');
const CustomError = require('../helpers/customError');

//get products of specified user
router.get('/user-products',
    authenticationMiddleware,
    async (req, res, err) => {
        debugger;
        const userId = req.user.id;
        //const products = await Product.find({});
        // const userProducts = products.filter(item => (item.user).toString() === userId);
        const userProducts = (await Product.find()).filter(item => (item.user).toString() === userId)
        res.json(userProducts)
    })

router.post('/add-product',
    authenticationMiddleware,
    async (req, res, err) => {
        //debugger;
        const user = req.user.id
        const { name, description, price, category, tags, discound } = req.body;
        console.log(user);
        const product = new Product({ user, name, description, price, category, discound, tags })
        console.log(product)
        await product.save();
        res.json(product);

    })

router.patch('/edit-product/:id',
    authenticationMiddleware,
    ownerAuthorization,
    async (req, res, next) => {

        const id = req.params.id;
        const user = req.user.id

        const { name, description, price, category, tags, discound } = req.body;
        const productToEdit = await Product.findByIdAndUpdate(
            id,
            { user, name, description, price, category, tags, discound },
            {
                new: true,
                runValidators: true,
                omitUndefined: true
            })
        res.status(200).json(productToEdit)

    })

router.delete('/delete-product/:id',
    authenticationMiddleware,
    ownerAuthorization,
    async (req, res, next) => {
        const id = req.params.id;
        const product = await Product.findByIdAndDelete(id);
        res.json(product);
    }
)

/////////////////////////////////.................One Route .............//////////////////////

router.get('', async (req, res, err) => {
    let pageSize = 1;
    let currentPage = 1;
    let searchedCategory = req.query.category ? req.query.category : "";
    let searchedItems = req.query.item ? req.query.item : "";
    let orderKey = req.query.orderKey ? req.query.orderKey : "";
    let products;

    //get ALL products
    //http://localhost:3000/products
    if (searchedCategory === "" && searchedItems === "") {
        products = await Product.find({}).populate('category');
    }

    //get all products of specified category
    //http://localhost:3000/products?category=Women shoes
    else if (searchedCategory && searchedItems === "") {
        products = await Product.find({}).populate('category');
        products = products.filter(product => product.category.name.toLowerCase() === searchedCategory.toLocaleLowerCase())
    }

    //search in All products
    //http://localhost:3000/products?item=a
    else if (searchedCategory === "" && searchedItems) {
        products = await Product.find({}).populate('category');
        products = products.filter(product => product.name.toLowerCase().includes(searchedItems.toLocaleLowerCase()))
    }

    //search in specified category
    //http://localhost:3000/products?item=cm&category=women shoes
    else if (searchedCategory && searchedItems) {
        products = await Product.find({}).populate('category');
        products = products.filter(product => product.category.name.toLowerCase() === searchedCategory.toLocaleLowerCase())
        products = products.filter(product => product.name.toLowerCase().includes(searchedItems.toLocaleLowerCase()))
    }

    //sort by name
    if (orderKey === "name") {
        products = products.sort((a, b) => (a.name > b.name) ? 1 : -1)
    }
    //http://localhost:3000/products?item=cm&category=women shoes&orderKey=lowPrice
    else if (orderKey === "lowPrice") {
        products = products.sort((a, b) => (a.price > b.price) ? 1 : -1)
    }
    else if (orderKey === "highPrice") {
        debugger
        products = products.sort((a, b) => (a.price > b.price) ? -1 : 1)
    }
    const startIndex = (currentPage - 1) * pageSize;
    products = _(products)
        .slice(startIndex)
        .take(pageSize)
        .value();

    res.json(products)

})
//////...............................
module.exports = router;