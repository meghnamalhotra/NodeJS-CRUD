const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const Model = require('../model/model');
var jwt = require('jsonwebtoken');
const {verifyToken} = require('../middleware/auth');

//POST DETAILS
router.post('/post', async(req, res) => {
   const data = new Model({
    name: req.body.name,
    age: req.body.age,
   })
   try {
    const dataToSave = await data.save();
    res.status(200).json(dataToSave);
   }
   catch (error) {
     res.status(400).json({message: error.message})
   }
})

//GET ALL DATA
router.get('/getAll', async(req, res) => {
    try{
    const data = await Model.find();
    res.json(data);
    }catch(error){
        res.status(500).json({message: error.message});
    }
})

//GET DATA BY ID

router.get('/getOne/:id', async(req, res) => {
    try{
        const data = await Model.findById(req.params.id);
        res.json(data);
    }catch(error){
        res.status(500).json({message: error.message});
    }
})


//UPDATE BY ID

router.patch('/update/:id', async(req, res) => {
   try{
      const id = req.params.id;
      const updateData = req.body;
      const options = { new: true };
      const result = await Model.findByIdAndUpdate(id, updateData, options);
      res.send(result);

   }catch(error){
    res.status(400).json({ message: error.message })
   }
})


//FIND BY ID & DELETE
router.delete('/delete/:id', async(req, res) => {
   try{
    const id = req.params.id;
    const data = await Model.findByIdAndDelete(id);
    res.send(`Document with ${data.name} has been deleted..`)
   }catch(error){
    res.status(400).json({ message: error.message });
   }

})

//Register USER
router.post('/register', async(req, res) => {
    try{
        const { name, email, password, age, gender } = req.body;
        if(!(email && password && name)){
            res.status(400).send("All input is required");
        }
        const oldUser = await Model.findOne({ email });
        if (oldUser) {
          return res.status(409).send("User Already Exist. Please Login");
        }

         //Encrypt user password
         encryptedPassword = await bcrypt.hash(password, 10);

       // Create user in our database
       const user = await Model.create({
        name,
        age,
        gender,
        email: email.toLowerCase(), // sanitize: convert email to lowercase
        password: encryptedPassword,
        passwordDec: password
      });
      var token = jwt.sign({ 
        user_id: user._id, email 
        },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
      });
      user.token = token;

      // return new user
      res.status(200).json(user);

    }catch(error){
        console.log(error);
    }
});


router.post("/login" ,async (req, res) => {
    try {
      // Get user input
      const { email, password } = req.body;
  
      // Validate user input
      if (!(email && password)) {
        res.status(400).send("All input is required");
      }
      // Validate if user exist in our database
      const user = await Model.findOne({ email });
      if(user){
        const isSame = await bcrypt.compare(password, user?.password);
        console.log("bcdjn", isSame);
        if (user && isSame) {
          // Create token
          const token = jwt.sign(
            { user_id: user._id, email },
            process.env.TOKEN_KEY,
            {
              expiresIn: "2h",
            }
          );
          // save user token
          user.token = token;
          res.status(200).json(user);
        }else{
          res.status(400).json({ message: "Invalid credentials!" });
        }
      }else{
        res.status(400).json({ message: "User not Found" });
      }
    } catch (err) {
      console.log(err);
    }
    // Our register logic ends here
  });

  router.post("/welcome", verifyToken, (req, res) => {
    res.status(200).send("Welcome 🙌 ");
  });
module.exports = router;