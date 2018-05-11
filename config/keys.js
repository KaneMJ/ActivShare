if(process.env.NODE_ENV === 'production'){
    module.exports = require('./keys-deploy');
} else {
    module.exports = require('./keys-dev');
}