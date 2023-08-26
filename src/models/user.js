const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["user", "admin", "super-admin"],
        default: "user",
    },

    orders: [
        {type: mongoose.Types.ObjectId, ref: 'Orders'}
    ]
});


const User = mongoose.model("User", userSchema);

async function getPasswordHash(password) {
  const hash = await bcrypt.hash(password, 10);
  return hash;
}

User.createNew = async (user) => {
  const model = new User(user);
//   const hash = await getPasswordHash(user.password);
//   model.passwordHash = hash;
  return model;
};


module.exports = User;