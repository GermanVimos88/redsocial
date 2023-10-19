const express = require('express');
const router = express.Router();
const User = require("../models/User.js");
const bcrypt = require("bcrypt");

//Registro
router.post("/register", async (req, res) => {        
    try {
        // generar nuevo password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        //crear nuevo usuario
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,// req.body.password, 
            }); 
              
        //guardar usuario y respuesta
        await newUser.save();
        return res.status(200).json(newUser);           
    
    } catch (err) {
        return res.status(500).json(err)        
    }
});


//Login
router.post("/login", async(req,res) => {
    try {
        const user = await User.findOne({email:req.body.email});
        //!user && res.status(404).json("Usuario no encontrado");
        if (!user) return res.status(404).json("Usuario no encontrado");
        const validPassword = await bcrypt.compare(req.body.password, user.password)
        //!validPassword && res.status(400).json("Contraseña incorrecta")
        if (!validPassword) return res.status(400).json("Contraseña incorrecta")
        
        return res.status(200).json(user)
    } catch(err){
        return res.status(500).json(err)
    }
});


module.exports = router;
