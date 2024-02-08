// Dependencies
const path = require('path');
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const routes = require('./controllers');

const sequelize = require('./config/connection');
const helpers = require('./utils/helpers');

const hbs = exphbs.create({ helpers });

// Sets up the Express App
const app = express();
const PORT = process.env.PORT || 3000;


const sess = {
  secret: 'secret',
  cookie: {
    maxAge: 24 * 60 * 60 *1000,
    httpOnly: true,
    secure: false,
    sameSite: 'strict',
  },
  resave: false,
  saveUninitialized: true,
  // Sets up session store
  store: new SequelizeStore({
    db: sequelize,
  }),
}

app.use(session(sess));
// Set Handlebars as the default template engine.
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(routes);


// Starts the server to begin listening
sequelize.sync({ force: false }).then (() => {
  app.listen(PORT, () => {
    console.log('Server listening on: http://localhost:' + PORT);
  });  
});
