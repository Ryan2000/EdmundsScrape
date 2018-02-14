/**
 * Created by ryanhoyda on 2/4/18.
 */



var casper = require('casper').create({
    clientScripts:  [
        "jquery-3.3.1.min.js",      // These two scripts will be injected in remote
    ]
    //logLevel: "debug",              // Only "info" level messages will be logged
    //verbose: true                  // log messages will be printed out to the console
});

casper.on('remote.message', function(msg) {
    //this.echo('remote message caught: ' + msg);
});

casper.start('https://www.edmunds.com/new-car-ratings/');

var articles = [];
casper.then(function() {

    articles = this.evaluate(function(){
        articles = [];

        var logo = 'https:' + $('.edmunds-logo').find('img').attr('src');

        $('.tips-item').each(function(){

            var image = $(this).find('img').attr('data-dsrc');

            var title = $(this).find('a').attr('title');

            var summary = $(this).find('p').text();

            var link = 'https://edmunds.com' + $(this).find('a').attr('href');

            var rating = 0.0;
            $(this)
                .find('.rating-stars')
                .find('.icon-star-full')
                .each(function(e){
                    rating++;
                });
            $(this)
                .find('.rating-stars')
                .find('.icon-star-half')
                .each(function(e){ rating += .5; });

            articles.push({
                image: image,
                title: title,
                summary: summary,
                link: link,
                rating: rating,
                byline: ""
            });
        });
        return articles;
    });

    var articleMap = [];
    var links = [];

    var lookup = function(key, poorMansMap){
        for(i = 0; i < poorMansMap.length; i++){
            if (poorMansMap[i][0] === key){
                return poorMansMap[i][1];
            }
        }
    };

    for(var i = 0; i < 5; i++){
        var article = articles[i];
        links.push(article.link);

        var arr = [];
        arr.push(article.link);
        arr.push(article);

        articleMap.push(arr);
    }
    casper.eachThen(links, function(response){
        this.echo(response.data);
        var url = response.data;
        this.thenOpen(response.data, function(nested){
            article = lookup(url, articleMap);

            this.evaluate(function(){
                var byline = $('.by-line:nth-child(1)').text();
                article.byline = byline;
            });
        });
    }).then(function(){
        for(i = 0; i < 5; i++){
            var article = articles[i];
            this.echo(article.image);
            this.echo(article.title);
            this.echo(article.summary);
            this.echo(article.link);
            this.echo(article.rating);
            this.echo(article.byline);
            this.echo('--------------\n');
        }
    });
});


casper.run();