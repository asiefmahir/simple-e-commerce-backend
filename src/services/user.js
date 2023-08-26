const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


const models = require("../models");
const { GeneralError } = require("../utils/errors");

const Model = models.User;


const getAllUser = async (take, skip) => {
    const users = await Model.find()
        .limit(take)
        .skip(skip)
    // const count = await Model.find()
    //     .limit(take)
    //     .skip(skip).count
    return users
}

const getById = async (id) => {
  const user = await Model.findById(id)
  return user;
};
async function getPasswordHash(password) {
  const hash = await bcrypt.hash(password, 10);
  return hash;
}

const saveUser = async (user) => {
    
    const item = await Model.findOne({email: user.email});
    if (item) {
        throw new GeneralError('User with this email already exists');
    }
    if(!item) {
        let role = 'user'
        const usersCount = await Model.estimatedDocumentCount();

        if (usersCount === 0) {
            role = 'super-admin';
        }
        const passwordHash = await getPasswordHash(user.password);
        const model = new Model({...user, role, password: passwordHash});
        const savedItem = await model.save();
        return savedItem._id;
    }
    return item._id;
};

const login = async (payload) => {
        const user = await Model.find({ email: payload.email });
        if(user && user.length > 0) {
            const isValidPassword = await bcrypt.compare(payload.password, user[0].password);

            if(isValidPassword) {
                const {_id, email, role} = user[0];
                const validUser = {
                    _id, email, role
                }

                console.log(validUser);

               return validUser
             
            } else {
                return undefined
             
            }
        } else {
            return undefined;
    }
}

const updateUser = async (id, user) => {
    const item = await Model.findById(id);

    console.log(item);
    if(item) {
        await Model.replaceOne({_id: id}, user);
        return item._id
    }
   throw new NotFound('Product not found by the id: ' + id);

}


const deleteUserById = async (id) => {
    const item = await Model.findById(id);
    if(item) {
        await Model.deleteOne({_id: id})
        return
    }
    throw new NotFound('Product not found by the id: ' + id);
};

module.exports = { saveUser, getById, getAllUser, login, updateUser, deleteUserById };