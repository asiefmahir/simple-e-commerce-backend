const models = require("../models");
const {NotFound} = require('../utils/errors')


const Model = models.Product;

const getAllProduct = async (take, skip) => {
    const products = await Model.find()
        .limit(take)
        .skip(skip)
    return products
}

const getProductById = async (id) => {
    const product = Model.findById(id);
    return product
}

// const getSearchedProduct = async (searchString, price, filterMethod, skip, take, orderKey, orderValue) => {
//     const or = searchString
//         ? {
//             OR: [
//                 { title: { contains: searchString } },
//                 { description: { contains: searchString } },
//             ],
//         }
//         : {};

//     const filter = (price && filterMethod)
//         ? {
//             price: {
//                 [filterMethod]: Number(price),
//             },
//         }
//         : {};

//     const products = await Model.find({
//         where: {
//             ...or,
//             ...filter
//         },
//         include: { category: true },
//         take: Number(take) || undefined,
//         skip: Number(skip) || undefined,
//         orderBy: {
//             [orderKey]: orderValue || undefined,
//         },
//     })

//    return  {
//         products,
//         count: products?.length
//     }
// };


const saveProduct = async (product) => {
    const item = await Model.create(product);
    return item._id
}

const updateProduct = async (obj) => {
    const {id, body: product, image} =  obj;
    const updatedProduct = {...product, image};
    console.log(updatedProduct, 'up');
    const item = await Model.findById(id);
    console.log(item, 'it');

    console.log(item);
    if(item) {
        const result = await Model.replaceOne({_id: id}, updatedProduct);
        console.log(result, 'res');
    } else {
        throw new NotFound('Product not found by the id: ' + id);
    }
   

}

const deleteProductById = async (id) => {
    const item = await Model.findById(id);
    if(item) {
        await Model.deleteOne({_id: id})
        return
    }
    throw new NotFound('Product not found by the id: ' + id);
};


module.exports = {
    getAllProduct,
    getProductById,
    saveProduct,
    updateProduct,
    deleteProductById
}
