var querystring = require('querystring');
    fs = require('fs'),
    request = require('request'),
    jsdom = require("jsdom"),
    program  = require('commander'),
    csv = require('csv'),
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
        var str = "" + i,
            pad = "00000",
            number = pad.substring(0, pad.length - str.length) + str,
            newUrl = url + letter + number
        console.log('URL: ' + newUrl);

        try {
            request.get({url:newUrl}, function (e, response, body) {
                jsdom.env(
                    body,
                    ['jquery-1.10.2.min.js'],
                    function(errors, window) {
                        var table = window.$("body .result-table").html();
                        if (table) {
                            jsdom.env(
                                table,
                                ['jquery-1.10.2.min.js'],
                                function(errors, window) {
                                    var rows = window.$.find('.cert-details p');
                                    console.log(newUrl, letter + number, window.$(rows[0]).text(),  window.$(rows[1]).text());
                                    stream.write("'"+window.$(rows[0]).text()+"','"+window.$(rows[1]).text()+"','"+letter + number+"' \r\n");
                                    loop(i + 1);
                                }

                            );
                        } else {
                            loop(i + 1);
                        }
                    }
                );

            });
        } catch(err) {
            loop(i + 1);
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
