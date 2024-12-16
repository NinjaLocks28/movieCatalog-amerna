const express = require('express');
const mongoose = require('mongoose');

const cors = require('cors')
require('dotenv').config();


const userRoutes = require("./routes/user")
const movieRoutes = require('./routes/movie')


const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))

const corsOptions = {
    origin: ['http://localhost:3000'],
    credentials: true,
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions))

app.use('/users', userRoutes);
app.use('/movies', movieRoutes)


mongoose.connect(process.env.MONGODB_STRING);
mongoose.connection.once('open', () => console.log(`Now Connected to MongoDB Atlas`))

if(require.main == module) {
    const port = process.env.PORT || 4000;
    app.listen(port, () => {
        console.log(`API is now online on port ${port}`)
    })
}

module.exports = { app, mongoose };