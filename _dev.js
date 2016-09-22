var fs = require('fs');
var jsdom = require('jsdom');

var doIt = function(html) {

    jsdom.env(html, [],
      function(err, window) {
        console.log(window.genPid);

        //console.log(['getPid', eval('genPid()')]);
      }
    );

};

fs.readFile('_det.txt', 'utf8', function(err, data) {
  if (err) {
    return console.log(err);
  }

  doIt(data);
});