var fs = require('fs');
var jsdom = require('jsdom');

var doIt = function(html) {
    var encoded = html.match(/cc='(.*)';.*cc='(.*);.*Pid\(\) {return (.*); }/);

    var form = unescape(decodeURIComponent(encoded[1]).replace(/^<\!\-\-\s*|\s*\-\->$/g, ''))
                  .replace(/'/g, '"')
                  .replace(/onclick="return "(.*?)""/g, 'value="$1"')
    ,
        funcs = unescape(decodeURIComponent(encoded[2]).replace(/^<\!\-\-\s*|\s*\-\->$/g, ''))
                  .replace(/'/g, '"')
                  .replace(/finalStr=""/g, 'var finalStr=""')
                  .replace(/sbbObj = /g, 'var sbbObj=')
                  .replace(/sbbFrm=/g, 'var sbbFrm=')
                  .replace(/i=0/g, 'var i=0')
                  .replace(/\.onclick\(\)/g, '\.getAttribute\(\'value\'\)')
                  .replace(/document\./g, 'window\.document\.')
        ,
        getPid = function() {
            return decodeURIComponent(encoded[3]);
        };

        var wrongRef = funcs.match(/} var (.*)=.*getElementsByName.*x=.*?\((.*?)\)/, '');
        if (null !== wrongRef)
          funcs = funcs.replace(wrongRef[2], wrongRef[1]);

        jsdom.env(form, [],
          function(err, window) {
            eval(funcs);

            console.log(['functions', funcs]);
            console.log(['form', form]);
            console.log(['getPid', eval(getPid())]);
          }
        );

};

fs.readFile('_det.txt', 'utf8', function(err, data) {
  if (err) {
    return console.log(err);
  }

  doIt(data);
});