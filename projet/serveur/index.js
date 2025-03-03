const express = require("express"); // 引入 express 模块，用于创建 Web 服务器
const cors = require("cors"); // 跨域资源共享 
const bodyParser = require("body-parser"); // 用于解析请求体中的数据 
const cookieSession = require("cookie-session");
const path = require("path");


const app = express(); // 创建 Express 服务器实例，app 代表整个 Web 应用。

const corsOptions = {
    origin: 'http://localhost:5173', // 只允许这个前端访问
    credentials: true, // 允许发送 Cookie（如果前端有身份验证）
    // allowedHeaders: ['Content-Type', 'Authorization', 'Set-Cookie']
  };

app.use(cors(corsOptions)); // 只允许该前端请求后端 API

app.use(cookieSession({
    name: 'session',   // nom de cookie
    keys: ['key1', 'key2'],   // 这是用于加密和签名 cookie 的密钥数组
    // sameSite: 'none', // 允许跨站点 Cookie
    // secure: false // 在 localhost 环境下允许 HTTP（生产环境应设为 true）
}));


app.use(bodyParser.urlencoded({extended: true})); // 用于解析 URL 编码的表单数据 ex: name=John&age=30 -> { name: 'John', age: '30' }
app.use(bodyParser.json()); // 用于解析 JSON 格式的请求体 ex: { "name": "John", "age": 30 } -> { name: 'John', age: 30 }



//ROUTES
const sessionRoutes = require('./routes/sessionsRoutes');
const usersRoutes = require('./routes/usersRoutes');
const postsRoutes = require('./routes/postsRoutes');
const PicsRoutes = require('./routes/profilePicRoutes');
const conRoutes = require("./routes/ConRoutes");
const msgRoutes = require('./routes/MsgRoutes');


app.use('/session',sessionRoutes);
app.use('/users',usersRoutes);
app.use('/posts',postsRoutes);
app.use('/pics', PicsRoutes);
app.use('/conversations',conRoutes);
app.use('/messages',msgRoutes);
app.use('/uploads', express.static(path.join(__dirname, './uploads'))); // 让 /uploads/ 这个路由指向 ./uploads 文件夹，这样你可以通过 http://localhost:5000/uploads/ 访问该文件夹中的图片

//CONNEXION A LA BASE DE DONNEES
require("./models/dbConfig");

app.listen(5000, ()=>{
    console.log('Serveur pret sur port 5000')
});



//petit test 
app.get("/",(req, res) => {
    console.log("bien test");
    res.json({user: "Tout va à merveille"})
} )

