//const router = require("express").Router();
const express = require('express');
const router = express.Router();
const cors = require('cors');  
const Post = require("../models/Post.js");
const User = require("../models/User.js");

/* const headers = (req, res, next) => {
	const origin = (req.headers.origin == 'http://localhost:3000') ? 'http://localhost:3000' : 'https://mywebsite.com'
	res.setHeader('Access-Control-Allow-Origin', origin)
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
	res.setHeader('Access-Control-Allow-Credentials', true)
	next()
} */

//Crear un post

router.post("/", async (req, res) => {
    const newPost = new Post(req.body)
    try{
        //const savedPost = await newPost.save();
        await newPost.save();
        //return res.status(200).json(savedPost);
        return res.status(200).json(newPost);

    } catch(err) {
        return res.status(500).json(err);
    }
});

//Actualizar un post

router.put("/:id", async (req, res) => {
    try{
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.updateOne({$set:req.body});
            return res.status(200).json("El post ha sido actualizado");
        } else {
            return res.status(403).json("Solo puedes actualizar tu post");
        }
    } catch (err) {
        return res.status(500).json(err);
    }
});

//Eliminar un post

router.delete("/:id", async (req, res) => {
    try{
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.deleteOne();
            return res.status(200).json("El post ha sido eliminado");
        } else {
            return res.status(403).json("Solo puede eliminar su post");
        }
    } catch (err) {
        return res.status(500).json(err);
    }
});


//Like-Dislike un post

router.put("/:id/like", async (req, res) => {
    try{
        const post = await Post.findById(req.params.id);
        if (!post.likes.includes(req.body.userId)) {
            await post.updateOne({ $push: { likes: req.body.userId } });
            return res.status(200).json("El post ha recibido like");
        } else {
            await post.updateOne({ $pull: { likes: req.body.userId } });
            return res.status(200).json("El post ha eliminado el like");
        }
    } catch (err) {
        return res.status(500).json(err);
    }
});

//Obtener un post

router.get("/:id", async (req, res) => {
    try{
        const post = await Post.findById(req.params.id);
        return res.status(200).json(post);
    } catch (err) {
        return res.status(500).json(err);
    }
});


//Obtener timeline posts

router.get("/timeline/:userId", async (req, res) => {
    try{
        const currentUser = await User.findById(req.params.userId);
        const userPosts = await Post.find({ userId: currentUser._id });
        const friendPosts = await Promise.all(
            currentUser.followings.map((friendId) => {
                return Post.find({ userId: friendId });
            })
        );
        return res.status(200).json(userPosts.concat(...friendPosts))
    } catch (err) {
        return res.status(500).json(err);
    }
});

//Obtener todos los posts de usuarios

router.get("/profile/:username", async (req, res) => {
    try{
        const user = await User.findOne({ username: req.params.username });
        const posts = await Post.find({ userId: user._id });
        return res.status(200).json(posts);
    } catch (err) {
        return res.status(500).json(err);
    }
});



module.exports = router;