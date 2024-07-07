const port = process.env.PORT || 4000;
const url = "https://roar-inspired-ecommerce-backend.onrender.com"
const { ObjectId } = require('mongodb');

// Initialize dependencies and modules
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path")
const cors = require("cors");
const { request } = require("http");
const Stripe = require("stripe")

const stripe = new Stripe("sk_test_51PUnSYAIF51USOWHxbyUkYb8nfieDy1voAk0fQ5MCDNopi1WhxmyoB9PjrzdHwEOXLr8engTd79aciFYz6ZRLHm300XFZCrwhJ")


app.use(express.json());    // any request that we will get from response will be parsed through json
app.use(cors());    // reactjs project can now connect to express app on the 4000 port

//  initialize database
// database connection with mongodb
mongoose.connect("mongodb+srv://roarinspired:RoarInspired!234@cluster0.d5qtvxm.mongodb.net/roarinspired")

// API creation (endpoint)
app.get("/", (request, response) => {
    response.send("Express app is running")
})

// image storage engine
const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({ storage: storage })

// creating upload endpoint for images
app.use('/images', express.static('upload/images'))

app.post("/upload", upload.single('product'), (request, response) => {
    response.json({
        success: 1,
        image_url: `http://localhost:${port}/images/${request.file.filename}`
    })
})

// schema for creating products
const Product = mongoose.model("Product", {
    id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    new_price: {
        type: Number,
        required: true,
    },
    old_price: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    available: {
        type: Boolean,
        default: true,
    }
})

// Creating API (endpoint) for Adding product to database
app.post('/addproduct', async (request, response) => {
    //  create logic for automatic ID incrementation
    let products = await Product.find({});  // get all products in db and store in array
    let id;
    // check if there are products in the database(array)
    if (products.length > 0) {
        let last_product_array = products.slice(-1); // retrieve last product
        let last_product = last_product_array[0]    // access last product
        id = last_product.id + 1    // increment last id by 1 to generate new id
    }
    else    // else there are no products in the database and the first product gets id 1
    {
        id = 1;
    }
    const product = new Product({
        id: id,
        name: request.body.name,
        image: request.body.image,
        category: request.body.category,
        new_price: request.body.new_price,
        old_price: request.body.old_price,
    });
    console.log(product);
    await product.save();   // save product in mongdb database
    console.log("Product saved to database");
    // generate response
    response.json({
        success: true,
        name: request.body.name,
    })
})


// Creating API (endpoint) for Removing product from database
app.post('/removeproduct', async (request, response) => {
    await Product.findOneAndDelete({ id: request.body.id })
    console.log("Product removed.")
    response.json({
        success: true,
        name: request.body.name,
    })
})

// Creating API (endpoint) for Retrieving all products in database
app.get('/allproducts', async (request, response) => {
    let products = await Product.find({})   // get all products from database
    console.log("All products retrieved.")
    response.send(products)    // generate response for front end
})



// Schema creating User model
const Users = mongoose.model('Users', {
    name: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
    },
    cartData: {
        type: Object,
    },
    data: {
        type: Date,
        default: Date.now,
    }
})

// Creating API (endpoint) for registering a user
app.post('/signup', async (request, response) => {

    // Check if email already exists
    let check = await Users.findOne({ email: request.body.email });
    if (check) {
        return response.status(400).json({ success: false, errors: "An account with this email already exists." })
    }
    // create empty cart
    let cart = {};
    for (let i = 0; i < 200; i++) {
        cart[i] = 0
    }
    // create user
    const user = new Users({
        name: request.body.username,
        email: request.body.email,
        password: request.body.password,
        cartData: cart,
    })

    // save user in database
    await user.save();

    // create token
    const data = {
        user: {
            id: user.id
        }
    }
    // generate token
    const token = jwt.sign(data, 'secret_ecom');
    response.json({ success: true, token })    // respond with success and token
})


// Creating API (endpoint) for user login
app.post('/login', async (request, response) => {
    // getch user based on user email
    let user = await Users.findOne({ email: request.body.email })
    // if a user was retrieved
    if (user) {
        const passCompare = request.body.password === user.password  // verify user input password matches user details in db
        if (passCompare) {    // if password is correct then we create the user object
            const data = {
                user: {
                    id: user.id
                }
            }
            const token = jwt.sign(data, 'secret_ecom'); // generate token
            response.json({ success: true, token })    // respond with success and token
        }
        else    // if password incorrect
        {
            response.json({ success: false, errors: "Incorrect Password" })    //respond with failure
        }
    }
    else {
        response.json({ success: false, errors: "User does not exist for this email" }) //respond with failure
    }
})

// Creating middleware to fetch user
const fetchUser = async (request, response, next) => {
    const token = request.header('auth-token'); // get user token
    // if token was not found then respond with error
    if (!token) {
        response.status(401).send({ errors: "Please authencticate with a valid token" })
    }
    else    // if token was found
    {
        try {
            const data = jwt.verify(token, 'secret_ecom');    // decode token
            request.user = data.user;   // get user data
            next();
        } catch (error) {
            response.status(401).send({ errors: "Please authencticate with a valid token" })
        }
    }
}

// Creating API (endpoint) for adding products in cartdata to database
app.post('/addtocart', fetchUser, async (request, response) => {
    console.log("Added product", request.body.itemId);
    let userData = await Users.findOne({ _id: request.user.id });   // get user from db
    userData.cartData[request.body.itemId] += 1;    // increase cart item count
    await Users.findOneAndUpdate({ _id: request.user.id }, { cartData: userData.cartData }) // find user and update their cart in db with items in their cart
    response.json({ message: "Added to cart" });
})

// Creating API (endpoint) for removing products in cartdata in database
app.post('/removefromcart', fetchUser, async (request, response) => {
    console.log("Removed product", request.body.itemId);
    let userData = await Users.findOne({ _id: request.user.id });   // get user from db
    if (userData.cartData[request.body.itemId] > 0) // check if there are more then 0 items in the cart for that specific item of the user
    {
        userData.cartData[request.body.itemId] -= 1;    // decrease cart item count (remove item)
    }
    await Users.findOneAndUpdate({ _id: request.user.id }, { cartData: userData.cartData }) // find user and update their cart in db with items in their cart
    response.json({ message: "Removed from cart" });
})

// Creating API (endpoint) for getting cartdata in database
app.post('/getcart', fetchUser, async (request, response) => {
    console.log("Get user cart")
    let userData = await Users.findOne({ _id: request.user.id })  // get user from db
    response.json(userData.cartData)    // respond with users cart data
})


// Schema creating Orders model
const Orders = mongoose.model('Orders', {
    userId: {
        type: String,
        required: true,
    },
    items: {
        type: Array,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    address: {
        type: Object,
        required: true,
    },
    status: {
        type: String,
        default: "Order Processing",
    },
    date: {
        type: Date,
        default: Date.now(),
    },
    payment: {
        type: Boolean,
        default: false,
    }
})


// Creating API (endpoint) for placing order in database
app.post('/placeorder', fetchUser, async (request, response) => {

    const frontend_url = "https://roar-inspired-ecommerce-frontend.onrender.com";   // frontend url

    try {
        // create new order
        const newOrder = new Orders({
            userId: request.user.id,
            items: request.body.items,
            amount: request.body.amount,
            address: request.body.address,
        })
        await newOrder.save();  // save order to database

        await Users.findByIdAndUpdate(request.user.id, { cartData: {} });   // clear cartData

        // create line_item for item (necessary for stripe payment)
        const line_items = request.body.items.map((item) => ({
            price_data: {
                currency: "usd",
                product_data: {
                    name: item.name
                },
                unit_amount: item.new_price * 100
            },
            quantity: item.quantity
        }))

        // add one more entry for delivery price
        line_items.push({
            price_data: {
                currency: "usd",
                product_data: {
                    name: "Delivery Charges"
                },
                unit_amount: 2 * 100
            },
            quantity: 1
        })

        // create stripe session
        const session = await stripe.checkout.sessions.create({
            line_items: line_items,
            mode: 'payment',
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
        })

        response.json({ success: true, session_url: session.url })  // send session in response

    } catch (error) {
        console.log(error)
        response.json({ success: false, message: "Error" })
    }
})
//  Listing orders for admin panel
// Creating API (endpoint) for Retrieving all orders in database
app.get('/allorders', async (request, response) => {
    try {
        console.log("Get all orders")
        let orders = await Orders.find({})  // get orders from db
        response.send(orders)   // respond with all orders data
    } catch (error) {
        console.log("Failed to retreive orders.")
    }

})

// Creating API (endpoint) for Removing product from database
app.post('/removeorder', async (request, response) => {
    try {
        await Orders.findOneAndDelete({ _id: new ObjectId(request.body.id) })   // delete order from database
        console.log("Order removed.")
        response.json({
            success: true,
            name: request.body.name,
        })
    } catch (error) {
        console.error("Error removing order:", error);
        response.status(500).json({
            success: false,
            message: "An error occurred while removing the order.",
        });
    }

})


// Creating API (endpoint) for updating order status in database
app.post('/updateorderstatus', async (request, response) => {
    try {
        console.log("STATUS CHANGE TO:")
        console.log(request.body.status)
        await Orders.findOneAndUpdate({ _id: new ObjectId(request.body.orderId) }, { status: request.body.status })   // updating order status
        response.json({
            success: true,
            message: 'Status Updated',
        })
    } catch (error) {
        console.error("Error updating status:", error);
        response.status(500).json({
            success: false,
            message: "An error occurred while updating the status of the order.",
        });
    }

})



// express app to listen at this port to run backend server
app.listen(port, (error) => {
    if (!error) {
        console.log("Server running on port " + port)
    }
    else {
        console.log("Error: " + error)
    }
})