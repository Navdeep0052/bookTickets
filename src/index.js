const express = require("express")
const mongoose = require("mongoose")
const router = require("./routes/route")

const app = express()

app.use(express.json())

mongoose.connect("mongodb+srv://miniblognpis:K7SoUljJXaEqV3A0@cluster0.oxrsqmy.mongodb.net/booktrain?retryWrites=true&w=majority",{

})
.then(()=>console.log("mongodb is connected"))
.catch(err=>(console.log(err)))

// app.get("/",function(req,res){
//     res.send("app is working fine")
// })

app.use("/",router)

app.listen(process.env.PORT || 3000, function(){
    console.log("app is running on http://localhost:" + (process.env.PORT || 3000));
})
