const express = require('express');
const userRouter = express.Router();

userRouter.get('/', require('../controller/userlogin').getAlluser);
userRouter.post('/', require('../controller/userlogin').userlogin);
userRouter.get('/:userid', require('../controller/userlogin').get_single);
userRouter.put('/:userid', require('../controller/userlogin').update_user);
userRouter.delete('/:userid', require('../controller/userlogin').delete_user);





module.exports = userRouter;