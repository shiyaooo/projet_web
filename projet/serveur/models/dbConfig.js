const mongoose= require('mongoose');
mongoose.set('strictQuery', true); // 启用严格的查询验证


mongoose.connect("mongodb+srv://dysm1869:930C4QKucWFjGIS0@spreaddb.hifji.mongodb.net/?retryWrites=true&w=majority&appName=spreaddb")
.then(()=>console.log("Mongodb connected"))
.catch(err => console.error("Connection error: " + err))

module.exports = mongoose;