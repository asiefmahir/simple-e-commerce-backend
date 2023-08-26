const models = require("../models");

const Model = models.Category;

const getAllCategory = async (take, skip) => {
    const categories = await Model.find()
        .limit(take)
        .skip(skip)
    return categories
}

const getCategoryById = async (id) => {
    const category = Model.findById(id);
    return category
}


const saveCategory = async (category) => {
    const item = await Model.create(category);
    return item.id
}

const updateCategory = async (id, category) => {
    const item = await Model.findById(id);
    if(item) {
        item.title = category.title || item.title;
        item.price = category.price || item.price;
        item.image = category.image || item.image;
        item.description = category.description || item.description;
        item.products = item.products.concat(category.product) || item.products
        await item.save()
        return item._id
    }
   throw new NotFound('category not found by the id: ' + id);

}

const deleteCategoryById = async (id) => {
    const item = await Model.findById(id);
    if(item) {
        await Model.deleteOne({_id: id})
    }
    throw new NotFound('category not found by the id: ' + id);
};


module.exports = {
    getAllCategory,
    getCategoryById,
    saveCategory,
    updateCategory,
    deleteCategoryById
}
