const fs            = require('fs');
const mongoose      = require('mongoose');
var colors          = require('colors');

const pathConfig        = require('./path');
global.__base           = __dirname + '/';
global.__path_app       = __base + pathConfig.folder_app + '/';

global.__path_configs   = __path_app + pathConfig.folder_configs + '/';

const databaseConfig  = require(__path_configs + 'database');


main().catch(err => console.log('err'));
async function main() {
  await mongoose.connect('mongodb://localhost:27017/api');
  // await mongoose.connect(`mongodb+srv://${databaseConfig.username}:${databaseConfig.password}@cluster0.t6pff.mongodb.net/${databaseConfig.database}?retryWrites=true&w=majority`);
  console.log('connect success'.yellow);
}

const productSchemas = require('./app/schemas/product');
const categorySchemas = require('./app/schemas/category');
const userSchemas = require('./app/schemas/users');

const dataProducts = JSON.parse(
    fs.readFileSync(`${__dirname}/app/_data/product.json`,'utf-8')
);
const dataCategory = JSON.parse(
    fs.readFileSync(`${__dirname}/app/_data/category.json`,'utf-8')
);
const dataUsers = JSON.parse(
    fs.readFileSync(`${__dirname}/app/_data/users.json`,'utf-8')
);


const importData = async () => {
    try {
        await productSchemas.create(dataProducts);
        await categorySchemas.create(dataCategory);
        await userSchemas.create(dataUsers);
        console.log('importData...'.bgCyan);
        process.exit();
    } catch (error) {
        console.log(error);
    }
}

const deleteData = async () => {
    try {
        await productSchemas.deleteMany({});
        await categorySchemas.deleteMany({});
        await userSchemas.deleteMany({});
        console.log('deleteData...'.bgCyan);
        process.exit();
    } catch (error) {
        console.log(error);
    }
}

if(process.argv[2] === '-i'){
    importData();
}else if(process.argv[2] === '-d'){
    deleteData();
}