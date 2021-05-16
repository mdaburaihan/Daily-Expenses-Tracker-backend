const mongoose = require('mongoose');
   
const productSchema = new mongoose.Schema({
    title:  {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    category: {
        type: Number,
        required: true
    },
    image_url: {
        type: String,
        required: true
    }
 });


 const Product = mongoose.model('t_product', productSchema);

 exports.Product = Product;