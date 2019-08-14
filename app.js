// ==============================================

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const { databaseUrl } = require('./config/database');
const jwt = require('jsonwebtoken');
// ==============================================

// Setup port and start the server ==============

const port = process.env.PORT || 5000;
const app = express();
app.listen(port, () => {
    console.log('Server started at localhost:'+port);
})
// ==============================================

// Connect to mongoDB database ==================

mongoose.connect(databaseUrl, {useNewUrlParser: true});
mongoose.connection.on('connected', () => {
    console.log('Database connected on '+databaseUrl);
});
mongoose.connection.on('error', (err) => {
    console.log('Database error: '+err); 
});
// ==============================================

// Setup middlewares ============================

app.use(cors());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
const user = require('./routes/user');
app.use('/api/user', user);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/assets' ,express.static(path.join(__dirname, 'assets')));
// ==============================================

// Serve index.html from public folder ==========

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});
// ==============================================