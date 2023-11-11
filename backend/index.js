const express = require('express');
const cors = require('cors');
const session = require('express-session');
const Sequelize = require('sequelize');
const SequelizeStore = require('express-session-sequelize')(session.Store);
const db = require('./models')

const app = express()
const port = 3000

const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/config/config.json')[env];
const sequelize = new Sequelize(config.database, config.username, config.password, config);

//This middleware is used to parse incoming requests with JSON payloads
app.use(express.json())

//This middleware is used to enable Cross-Origin Resource Sharing. 
//It allows or restricts resources on a web page to be requested from another domain outside the domain from which the first resource was served
app.use(cors({
    origin: `${config.frontendUrl}`,
    credentials: true
}));

// Using session to maintain user state
app.use(
    session({
      secret: "some-secret-key",
      resave: false,
      saveUninitialized: false,
      cookie: { 
        maxAge: 1000 * 60 * 60 * 24, // Session duration (1 day) 
        httpOnly: true,
        secure: false // To be true in production
      }, 
      store: new SequelizeStore({
        db: sequelize,
        table: 'Session', 
      }),
    })
);

//Routers
const userRouter = require('./routes/User') 
const todoRouter = require('./routes/Todo')

// User Router will handle api realted to users 
app.use("/user", userRouter )
// Todo Router will handle api realted to tasks 
app.use("/todo", todoRouter )

// Endpoint to check health of service
app.get('/check', (req,res) => {
    res.send('Server Running')
})

// Start the service on the specified port
db.sequelize.sync().then(() => {
    app.listen(port, () => {
        console.log("Server Started")
    })
})

