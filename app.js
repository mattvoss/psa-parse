var querystring = require('querystring');
    fs = require('fs'),
    cheerio = require('cheerio'),
    request = require('request'),
    async = require('async'),
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
    letter = "A",
    start = 0,
    end = 99999,
    q = async.queue(function (task, callback) {
        var newUrl = url + task.cert;
        console.log('URL: ' + newUrl);

        try {
            request.get({url:newUrl}, function (e, response, body) {
                if (!e) {
                    $ = cheerio.load(body);
                    var rows = $('.cert-details').find('p');
                    if (rows) {

                        console.log(rows.eq(0).text(), rows.eq(1).text(), task.cert);
                        stream.write("'"+rows.eq(0).text()+"','"+rows.eq(1).text()+"','"+task.cert+"' \r\n");
                        rows = null;
                        callback();
                    } else {
                        callback();
                    }

                } else {
                    callback();
                }
            });
        } catch(err) {
            callback();
        }

    }, 4);

// assign a callback
q.drain = function() {
    console.log('all items have been processed');
    stream.end();
}

program
  .version('0.0.1')
  .option('-l, --letter [value]', 'Letter at beginning of authenticity number')
  .option('-s, --start [value]', 'Optional starting point other than zero')
  .parse(process.argv);

letter = program.letter || letter;
start = parseInt(program.start) || start;
var stream = fs.createWriteStream(
    letter+'00000.csv',
    {
        'flags': 'a'
    }
);
for (var i=0; i<(end-start)/2; i++) {
    var lstr = "" + (start+i),
        rstr = "" + (end-i),
        pad = "00000",
        lnumber = pad.substring(0, pad.length - lstr.length) + lstr,
        rnumber = pad.substring(0, pad.length - rstr.length) + rstr,
        lcert = letter + lnumber,
        rcert = letter + rnumber;

    q.push({cert: lcert}, function (err) {
        //console.log('finished processing:', cert);
    });

    q.push({cert: rcert}, function (err) {
        //console.log('finished processing:', cert);
    });
}
