
//const router = require("express").Router();
//const express = require('express');
//const router = express.Router();
//const { Router } = require("express");
const express = require('express');
const router = express.Router();
const cors = require('cors');  
const User = require("../models/User.js");
//const router = Router();
const bcrypt = require("bcrypt");

/* const headers = (req, res, next) => {
	const origin = (req.headers.origin == 'http://localhost:3000') ? 'http://localhost:3000' : 'https://mywebsite.com'
	res.setHeader('Access-Control-Allow-Origin', origin)
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
	res.setHeader('Access-Control-Allow-Credentials', true)
	next()
} */

/* const corsOptions = {
	origin: "http://localhost:3000"
}; */


//Obtener user

router.get("/:username", async (req, res) => {
    //const userId = req.query.userId;
    const userId = req.body.userId;
    const username = req.params.username;
    try{
        const user = userId
        ? await User.findById(userId)
        : await User.findOne({ username: username });
        const { password, updatedAt, ...other } = user._doc
        //res.setHeader("Access-Control-Allow-Origin", "*"); 
        return res.status(200).json(other);        
    } catch (err) {
        return res.status(500).json(err);
    }
});


//Actualizar user
router.put("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        if(req.body.password){
            try{
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            } catch (err) {
                return res.status(500).json(err);
            }
        }
        try{
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            });
            return res.status(200).json("La cuanta ha sido actualizada");
        } catch (err) {
            return res.status(500).json(err);
        }
    } else {
        return res.status(403).json("Puedes actualizar solamente tu cuenta!");
    }
});

//Eliminar user

router.delete("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        
        try{
            const user = await User.findByIdAndDelete(req.params.id);
            return res.status(200).json("La cuanta ha sido eliminada");
        } catch (err) {
            return res.status(500).json(err);
        }
    } else {
        return res.status(403).json("Puedes eliminar solamente tu cuenta!");
    }
});



//get friends
router.get("/friends/:userId", async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        const friends = await Promise.all(
            user.followings.map(friendId=>{
                return User.findById(friendId)
            })
        )
        let friendList = [];
        friends.map(friend=>{
            const {_id,username,profilePicture} = friend;
            friendList.push({ _id, username, profilePicture });
        });
        return res.status(200).json(friendList);
    } catch (error) {
        return res.status(500).json(error);
    }
})



//Follow user

router.put("/:id/follow", async (req, res)=> {
    if(req.body.userId !== req.params.id){
        try{
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if(!user.followers.includes(req.body.userId)) {
                await user.updateOne({ $push: { followers: req.body.userId } });
                await currentUser.updateOne({ $push: { followings: req.params.id } });
                return res.status(200).json("Usuario ha sido seguido");
            } else{
                return res.status(403).json("Ahora sigues a este usuario");
            }
        }catch(err){
            return res.status(500).json(err)
        }
    }else{
        return res.status(403).json("No puedes seguir a tu cuenta propia")
    }
})

//Unfollow user

router.put("/:id/unfollow", async (req, res)=> {
    if(req.body.userId !== req.params.id){
        try{
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if(user.followers.includes(req.body.userId)) {
                await user.updateOne({ $pull: { followers: req.body.userId } });
                await currentUser.updateOne({ $pull: { followings: req.params.id } });
                return res.status(200).json("Usuario ha dejado de seguir");
            } else{
                return res.status(403).json("No puedes seguir a este usuario");
            }
        }catch(err){
            return res.status(500).json(err)
        }
    }else{
        return res.status(403).json("No puedes dejar de seguir a tu cuenta propia")
    }
})

module.exports = router