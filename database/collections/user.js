const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({

  username: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  hobbies: {
    type: [String],
    default: [],
  },
});

const User = mongoose.model('User', UserSchema);

module.exports = User;