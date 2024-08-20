const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const orgRoutes = require('./routes/organization');
const userRoutes = require('./routes/user');
const app = express();
const dotenv = require('dotenv');

app.use(express.json());
dotenv.config()

app.use(passport.initialize());
require('./config/passport')(passport);

app.use('/api/organizations', orgRoutes);
app.use('/api/users', userRoutes);

mongoose.connect(process?.env?.MONGODB_URL)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server running on port ${port}`));



