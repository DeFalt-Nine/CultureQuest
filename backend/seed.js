require('dotenv').config();
const { connectDB } = require('./config/db');
const TouristSpot = require('./models/TouristSpot');
const touristSpotsData = require('./data/touristSpotsData');

const importData = async () => {
  try {
    await connectDB();

    await TouristSpot.deleteMany();
    console.log('Data destroyed...');

    await TouristSpot.insertMany(touristSpotsData);
    console.log('Data imported...');

    process.exit();
  } catch (error) {
    console.error(`Error with data import: ${error}`);
    process.exit(1);
  }
};

importData();
