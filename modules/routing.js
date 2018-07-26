const fs = require('fs');

module.exports = {
    build: (routesPath, app, io) => {
        // Loop over each of the files in the "router" directory and then require that route
        // and pass in the app

        fs.readdirSync(routesPath).forEach(function (file) {
            var route = routesPath + file;
            require(route)(app, io);
        });

    }
};