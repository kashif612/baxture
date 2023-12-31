const { User } = require("../../database");

exports.userlogin = async (req, res) => {

  const {username,age,hobbies} = req.body
  console.log(req.body)
    const UserData = {
        username: username,
        age: age,
        hobbies: hobbies
      };
      
      if(!username){
        return res.status(400).json({message: "Please add username"})
      }
      if(!age){
        return res.status(400).json({message: "Please add age"})
      }
      if(!hobbies){
        return res.status(400).json({message: "Please add hobbies"})
      }
      try {
        const newUser = await User.create(req.body);
        console.log('User saved successfully:', newUser);
        return res.status(201).json({ message: 'User saved successfully', savedUser: newUser });
      } catch (error) {
        console.error('Error saving user:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
      }
    };
      
exports.getAlluser = async(req, res)=>{
  let user = await User.find().select('username age hobbies');
  if(!user || user.length == 0){
   return res.status(404).json("No record found")
  }
  return res.status(200).json({message: "Successfully fetch", user})
}

exports.get_single = async(req, res)=>{
  const validUUID = /^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-4[a-fA-F0-9]{3}-[89abAB][a-fA-F0-9]{11}$/;
  if (!validUUID.test(userId)) {
    return res.status(400).json({ message: 'Invalid userId format' });
  }
  let user = await User.findOne({_id: req.params.userid}).select({ username: 1, age: 1, hobbies: 1 });
  if(!user){
    return res.status(400).json({message:"Please provide the valid userid"})
  }else{
    return res.status(200).json({message: "Successfully fetch the data", user})
  }

}
exports.update_user = async(req, res)=>{
  const { userid } = req.params;

 

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userid,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

exports.delete_user = async(req, res)=>{
  const { userid } = req.params;

  try {
    const deletedUser = await User.findByIdAndDelete(userid);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(204).send("User Successfully deleted"); // 204 No Content for successful deletion
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

