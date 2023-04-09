const express = require('express');
const bodyParser = require('body-parser');
// const Sequelize = require('sequelize');
const {Sequelize, DataTypes}=require('sequelize');
const JWT = require('jsonwebtoken');
const bcrypt = require('bcrypt')


const app = express();
app.use(bodyParser.json());

const port = process.env.PORT || 5000

const sequelize = new Sequelize("orm_jwt", "kakashi", "4774", {
    host: "localhost",
    dialect: "mysql",
    timezone: '+05:30',
    define: {
        timestamps: true,
        // underscored: true
    }
})

sequelize.authenticate()
        .then((data) => {
            console.log('DB connected successfully')
        })
        .catch((err) => {
            console.log({Error : err})
        })
        
//model
var User = sequelize.define("tbl_users", {
    id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER
    },
    name : {
        allowNull: false,
        type: DataTypes.STRING(50),
    },
    email : {
        allowNull: false,
        type: DataTypes.STRING(50)
    },
    password: {
        allowNull: false,
        type: DataTypes.STRING(150)
    },
    status: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
    }
}, {
    timestamps: true,
    modelName: "User"
})

//Sync
User.sync()

//register user
app.post('/user', (req,res) => {
    const {name, email, password, status} = req.body

    User.findOne({
        where: {
            email: email
        }
    })
    .then((response) => {
        res.status(200).json({
            status:0,
            message: "User already exists",
            data: response
        })
    })
    .catch((err) => {
        res.status(500).json({
            status: 0,
            message: err
        })
    })

    User.create({
        name,
        email,
        password: bcrypt.hashSync(password, 10),
        status
    })
    .then((response) => {
        res.status(200).json({
            status: 1,
            message: "User has been created successfully",
            data: response
        })
    })
    .catch((err) => {
        console.log({error: err})
        res.status(500).json({
            status: 0,
            message: err,

        })
    })
})


app.get('/', (req,res) => {
    res.status(200).json({
        status: 1,
        message : "Welcome to homepage"
    })
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
});