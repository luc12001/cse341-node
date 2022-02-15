const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const cors = require('cors');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

const PORT = process.env.PORT || 5000;

const MONGODB_URL = process.env.MONGODB_URL || 'mongodb+srv://Brandon2:Admin@cluster0.qqma9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const path = require('path');

const errorController = require('./controllers/error');
const User = require('./models/user');
const csrfProtection = csrf();

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URL,
  collection: 'sessions',
  useUnifiedTopology: true
});


const corsOptions = {
  origin: "https://store341.herokuapp.com/",
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

const options = {
  family: 4
};
app.set('view engine', 'ejs');
app.set('views', 'views');



app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
  }));

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose.connect(
    MONGODB_URL, options
  )
  .then(result => {
    console.log("Connected YAY")
    app.listen(PORT);
  })
  .catch(err => {
    console.log(err);
  });