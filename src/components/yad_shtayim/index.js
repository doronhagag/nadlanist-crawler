import JavascriptDetector from 'javascript-detector';
import NadlanBase from '../../base/nadlan_base';
import XHR from '../../utils/xhr';
import atob from 'atob';


class YadShtayim extends NadlanBase {
    /**
     *
     */
    constructor() {
        super();
        console.log('YadShtayim Loaded');
    }


    get(properties = {}) {
        let request = {
                url: this.getUrl(),
                params: {},
                encoding: 'win1255',
                cookies: {
                    CLIENT_WIDTH_DIR: {
                        value: 2540,
                        expires: 60 * 60 * 24 * 10
                    },
                    MAIN_WIDTH_DIR: {
                        value: 2540,
                        expires: 60 * 60 * 24 * 10
                    },
                    DivurNadlanSearchAgain_sales: {
                        value: 2,
                        expires: 60 * 60 * 24 * 30 * 12 * 10
                    }
                }
            };

        return new Promise((resolve, reject) => {
            let response = this._sendRequest(request);

            response.then($ => {
                console.log('GOT VALID RESPONSE!');
                resolve($);
            });
        });
    }


    /**
     *
     */
    _sendRequest(request) {
        let tries = {
            count: 0,
            max: 4
        };

        return new Promise((resolve, reject) => {
            let xhr = new XHR(),
                jsDetector = new JavascriptDetector(),
                run = () => {
                    if (tries.count >= tries.max) {
                        console.log('MAX RETRIES EXCIDED '+tries.count);
                        return reject({error: 'max_tries_reached', count: tries.count});
                    }

                    let response = xhr.get(request);
                    response.then(($, response) => {
                        let html = $.html(),
                            encodingMethod = jsDetector.getEncodingMethod(html);

                        if (false === encodingMethod)
                            return resolve($);

                        switch(encodingMethod) {
                            case JavascriptDetector.ENCODING_TYPE.BASIC:
                                console.log('BASIC ----- ADDING PRID!');
                                jsDetector.getID(html).then(ID => {
                                    console.log(['PRID DETECTED:', ID]);

                                    for (let i in ID) {
                                        request.cookies[i] = {
                                            value: ID[i].value,
                                            expires: 10,
                                            override: true
                                        }
                                    }

                                    console.log('NEW REQUEST');
                                    console.log(request);
                                    console.log(html);

                                    setTimeout(() => {
                                        run();
                                    }, 4000);
                                });

                                break;
                            case JavascriptDetector.ENCODING_TYPE.ADVNACED:
                                console.log('ADVNACED ----- FIGURE IT OUT!');
                                console.log('NEW REQUEST');
                                console.log(request);
                                console.log(html);
                                break;
                        }
                    });

                    tries.count++;

                    return response;
                };

            run();
        });
    }


    /**
     *
     */
    _botDetection(html) {
        return new Promise((resolve, reject) => {

            console.log(html);
            console.log('_botDetection BEGINS!');
            let encoded = html.match(/cc='(.*)';.*cc='(.*);.*Pid\(\) {return (.*); }/);

            let form = unescape(decodeURIComponent(encoded[1]).replace(/^<\!\-\-\s*|\s*\-\->$/g, ''))
                    .replace(/'/g, '"')
                    .replace(/onclick="return "(.*?)""/g, 'value="$1"')
                ,
                funcs = [
                    unescape(decodeURIComponent(encoded[2]).replace(/^<\!\-\-\s*|\s*\-\->$/g, ''))
                        .replace(/'/g, '"')
                        .replace(/finalStr=""/g, 'var finalStr=""')
                        .replace(/sbbObj = /g, 'var sbbObj=')
                        .replace(/sbbFrm=/g, 'var sbbFrm=')
                        .replace(/i=0/g, 'var i=0')
                        .replace(/\.onclick\(\)/g, '\.getAttribute\(\'value\'\)')
                        .replace(/document\./g, 'window\.document\.')
                    ,
                    'window.getID = function() { return '+ decodeURIComponent(encoded[3]) +'};'
                ].join('');

            let wrongRef = funcs.match(/} var (.*)=.*getElementsByName.*x=.*?\((.*?)\)/, '');
            if (null !== wrongRef)
                funcs = funcs.replace(wrongRef[2], wrongRef[1]);

            jsdom.env({
                html: form,
                done: (err, window) => {
                    console.log(['functions', funcs]);
                    console.log(['form', form]);

                    eval(funcs);

                    console.log('CALC DONE');
                    console.log(['getPid', window.getID()]);
                    console.log('CALC2 DONE');

                    resolve({value: window.getID()});
                }

            });

        });
    }


    /**
     * @example: http://example.com/path/to/uri
     */
    getUrl() {
        return this._getDomain() + this._getUri();
    }


    /**
     * @example: /path/to/uri
     */
    _getUri() {
        return atob('L05hZGxhbi9zYWxlcy5waHA=');
    }



    /**
     * @example: http://example.com
     */
    _getDomain() {
        return atob('aHR0cDovL3d3dy55YWQyLmNvLmls');
    }
}

export default YadShtayim;