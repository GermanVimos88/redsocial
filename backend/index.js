const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require('cors');  
const dotenv = require('dotenv'); 
const helmet = require("helmet");
const morgan = require('morgan');
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const multer = require("multer");
const path = require("path");
//const bodyParser = require('body-parser');


dotenv.config();

mongoose.set('strictQuery', false);
mongoose.connect(
    'mongodb+srv://socialdb:dbredsocial66@cluster0.c0ihecv.mongodb.net/?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true },
    
    (err) =>
    err ? console.log(err) : console.log(
      "Conectado a MongoDB")
);

app.use("/images", express.static(path.join(__dirname, "public/images")));

// Middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/images"); //path del server donde se guardan los archivos
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({storage});
app.post("/api/upload", upload.any("file"), (req, res) => {
    try {
        return res.status(200).json("Archivo subido exitosamente");
    } catch (error) {
        //console.log(error);       
        return error;
    }
})

//CORS
/* const whiteList = ["http://localhost:3000"]; //  /api/auth/login
app.use(cors({      
    origin: function(origin, callback){
        if(whiteList.includes(origin)){
            return callback(null, origin);
        }
        else {
            return callback("Error de cors origin: " + origin + " No autorizado");
        }
    }
})); */
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
}); 

app.get("/", (req,res)=>{
    res.send("Bienvenido al mi Homepage");
})

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);




app.listen(8800, () => {
    console.log("Backend server en línea");
});