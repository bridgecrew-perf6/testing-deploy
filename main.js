require("dotenv").config()
const express = require("express")
const app = express()
const { DataTypes } = require("sequelize")
const jwt = require("jsonwebtoken")
var hbs = require('hbs')
const path = require("path")
const multer  = require('multer')
const User = require("./models/user")
const sequelize = require("./models/index").sequelize
const {hash, compare} = require("bcrypt")

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.set('view engine', 'hbs')
app.use(express.static('view'))
app.set('views', path.join(__dirname, 'view'));

const port = process.env.PORT || 8001

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, uniqueSuffix + "_" + file.originalname)
    }
  })

  const upload = multer({ storage: storage })


const authentticate = (req, res, next) => {
    const token = req.headers.authorization
    if(!token) {
        return res.status(200).json({message: "tidak punya akses"})
    }
    next()
}


app.post("/create",authentticate, upload.single("image"), async (req, res) => {
    const {username, password} = req.body
    var token = jwt.sign({ username, password  }, process.env.SECRET_KEY);
    const data = {
        code: 200,
        message: req.file
    }
    try {        
        return res.status(200).json(data)
    } catch (err) {
        return res.status(400).json({message: err.message})
    }
})

app.get("/test",authentticate, async (req, res) => {
    const data = {
        code: 200,
        message: "berhasil masuk"
    }
    try {        
        return res.status(200).json(data)
    } catch (err) {
        return res.status(400).json({message: err.message})
    }
})

app.post("/login", async (req, res) => {

    const user = await User(sequelize, DataTypes).findOne({
        where: {
            username: req.body.username
        }
    })

    const isEligible = await compare(req.body.password, user.password)

    if(!isEligible) {
       return res.status(400).json({message: "password atau username salah"})
    }


    const token = jwt.sign(req.body, "rahasia")

    res.status(200).json({
        username: req.body.username,
        token
    })
})

app.post("/register",async (req, res) => {
    req.body.password = await hash(req.body.password, 10)
    const data = await User(sequelize, DataTypes).create(req.body)
    res.status(200).json({data})
})

app.put("/update-user/:id", async (req, res) => {
    const {id} = req.params
    await User(sequelize, DataTypes).update({...req.body}, {where: {id}})
    return res.status(200).json({message: "successfully update"})
})


app.delete("/delete-user/:id", async (req, res) => {
    const {id} = req.params
    await User(sequelize, DataTypes).destroy({where: {id}})
    return res.status(200).json({message: "successfully delete"})
})


app.use("/*",async (req, res) => {

    res.render('index');
 } )



// app.delete("/delete_user/:id", authentticate, async (req, res) => {

//      await User(sequelize, DataTypes).destroy({
//         where: {
//             id: req.params.id
//         }
//     })

//     res.status(200).json({message: "user berhasil dihapus"})
// })




app.listen(port, console.log("listening at " + port))