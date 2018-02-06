/**
 * Created by ryanhoyda on 2/4/18.
 */



var casper = require('casper').create({
    clientScripts:  [
        "jquery-3.3.1.min.js",      // These two scripts will be injected in remote
    ],
    logLevel: "debug",              // Only "info" level messages will be logged
    verbose: true                  // log messages will be printed out to the console
});

casper.start('https://www.edmunds.com/new-car-ratings/');

casper.then(function() {
    var sedans = this.evaluate(function(){
        var sedans = $('#sedan_ratings_module');
        return sedans.html();
    });
    this.echo(sedans);
});

casper.run();