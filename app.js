var querystring = require('querystring');
    fs = require('fs'),
    cheerio = require('cheerio'),
    program  = require('commander'),
    url = 'http://www.psacard.com/DNACert/',
    default_headers = {
      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/536.11 (KHTML, like Gecko) Chrome/20.0.1132.34 Safari/536.11',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-us,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate',
      'Accept-Charset': 'ISO-8859-1,utf-8;q=0.7,*;q=0.3',
      // 'Connection': 'keep-alive',
      'Cache-Control': 'max-age=0'
    },
    letter = "R",
    start = 0,
    end = 99999;

program
  .version('0.0.1')
  .option('-l, --letter [value]', 'Letter at beginning of authenticity number')
  .option('-s, --start [value]', 'Optional starting point other than zero')
  .parse(process.argv);

loop = function(i) {
    if (i <= end) {
        var request = require('request'),
            str = "" + i,
            pad = "00000",
            number = pad.substring(0, pad.length - str.length) + str,
            newUrl = url + letter + number
        console.log('URL: ' + newUrl);

        try {
            request.get({url:newUrl, timeout:3000}, function (e, response, body) {
                if (!e) {
                    $ = cheerio.load(body);
                    var rows = $('.cert-details').find('p');
                    if (rows) {

                        console.log(rows.eq(0).text(), rows.eq(1).text(), letter + number);
                        stream.write("'"+rows.eq(0).text()+"','"+rows.eq(1).text()+"','"+letter + number+"' \r\n");
                        table = null;
                        rows = null;
                        request = null;
                        jsdom = null;
                        process.nextTick(function() {loop(i + 1)});
                    } else {
                        table = null;
                        jsdom = null;
                        request = null;
                        process.nextTick(function() {loop(i + 1)});
                    }

                } else {
                    request = null;
                    process.nextTick(function() {loop(i + 1)});
                }
            });
        } catch(err) {
            request = null;
            process.nextTick(function() {loop(i + 1)});
        }
    } else {
        stream.end();
    }
}

letter = program.letter || letter;
start = parseInt(program.start) || start;
var stream = fs.createWriteStream(
    letter+'00000.csv',
    {
        'flags': 'a'
    }
);
loop(start);
