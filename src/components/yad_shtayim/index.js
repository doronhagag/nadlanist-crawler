import NadlanBase from '../../base/nadlan_base';
import XHR from '../../utils/xhr';
import atob from 'atob';
import jsdom from 'jsdom';

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
                        value: 2541,
                        expires: 60 * 60 * 24 * 10,
                        override: false
                    },
                    MAIN_WIDTH_DIR: {
                        value: 2541,
                        expires: 60 * 60 * 24 * 10,
                        override: false
                    },
                    DivurNadlanSearchAgain_sales: {
                        value: 2,
                        expires: 60 * 60 * 24 * 30 * 12 * 10,
                        override: false
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
                run = () => {
                    if (tries.count >= tries.max) {
                        console.log('MAX RETRIES EXCIDED '+tries.count);
                        return reject({error: 'max_tries_reached', count: tries.count});
                    }

                    let response = xhr.get(request);
                    response.then(($, response) => {
                        if (0 > $.html().indexOf('<title></title>'))
                            return resolve($);

                        console.log('EMPTY TITLE - DETECTED EMPTY TITLE');
                        this._botDetection($.html()).then(PRID => {
                            console.log('PRID DETECTED: '+PRID);

                            request = Object.assign({}, request, {
                                cookies: {
                                    PRID: {
                                        value: PRID,
                                        expires: 10
                                    }
                                }
                            });

                            console.log('NEW REQUEST');
                            console.log(request);

                            run();
                        });
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