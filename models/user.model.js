const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  password: { type: String, required: true }
});

//middleware used to convert plaintext to hashpassword 
UserSchema.pre("save", function(next) {
  let user = this;
  if (!user.isModified("password")) return next();
  bcrypt.genSalt(10, function(err, salt) {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});


//compare with entered password 
UserSchema.methods.comparePassword = async function(pass) {
  return await bcrypt.compare(pass, this.password);
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
