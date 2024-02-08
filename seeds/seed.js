const sequelize = require('../config/connection');
const Book = require("../models/index.js");

const seedDatabase = async () => {
  await sequelize.sync({ force: true });



  process.exit(0);
};

seedDatabase();
