const express = require('express')

const app = express()
const ejs = require('ejs')
const { default: mongoose } = require('mongoose')

app.use(express.urlencoded({extended: true}))
app.set('view engine', 'ejs')

let allCustomers = []
let URI = "mongodb+srv://adedejisam0628:adedeji06@cluster0.r9vo8ks.mongodb.net/redo_db?retryWrites=true&w=majority&appName=Cluster0"

mongoose.connect(URI)
.then(() => {
    console.log("mongodb has connected")
})
.catch((err) => {
    console.log("an error has occurred", err)
})

let userSchema = mongoose.Schema({
    firstname: {type:String, required:true},
    email: {type:String, required:true, unique:[true, "Email has been used before, try another email"]},
    password: {type:String, required:true},
    registrationDate : {type:String, default:Date.now()}
})
let userModel = mongoose.model("users_collection", userSchema)



app.get('/', (req, res) => {
    console.log(__dirname+ '/overview.html')
    res.sendFile(__dirname+ '/overview.html')
})

app.get('/signup', (req, res) => {
    res.render('signup')
})

app.get("/dashboard", (req, res) => {
    userModel.find()
    .then((response)=> {
        console.log(response)
        allCustomers = response
        res.render("dashboard", {allCustomers})
    })
    .catch ((err) => {
        console.log(err, "an error occured")
    })
    
})

app.post('/register',(req, res) => {
    console.log(req.body)
    let form = userModel(req.body)
    form.save()
    .then(()=> {
        console.log("Information saved successfully")
        res.redirect("/dashboard")
    })
    .catch((err) => {
        console.log("could not save information", err)
    })
})

const port = 5001
app.listen(port, (err)=> {
    if(err){
        console.log('error don occur, server cannot run')
    } else {
        console.log('server has started successfully')
    }
})