import Request from 'request-promise';
import CheerIO from 'cheerio';
import iconv from 'iconv-lite';
import fs from 'fs';
import FileCookieStore from 'tough-cookie-filestore';

class XHR {
    _cookieDefault = {
        value: null,
        expires: null,
        path: '/',
        httpOnly: false
    };

    options = {
        referrer: ''
    };


    constructor() {

    }

    setReferrer(referrer) {
        this.options.referrer = referrer;
        return this;
    }


    /**
     *
     */
    get(properties) {
        let urlProps = this._getUrlPeroperies(properties.url);
        let cookieJarPath = '.cache/cookie_jar/'+ urlProps.domain +'.json';

        // create the json file if it does not exist
        if (!fs.existsSync(cookieJarPath)) {
            fs.closeSync(fs.openSync(cookieJarPath, 'w'));
        }

        let jar = Request.jar(new FileCookieStore(cookieJarPath));

        for (let i in properties.cookies) {
            jar.setCookie(this._getCookie(i, properties.cookies[i]), urlProps.url);
        }

        return Request({
            uri: properties.url,
            headers: this._getHeader(),
            qs: properties.params,
            gzip: true,
            encoding: 'binary',
            jar: jar,

            transform: (body, response, resolveWithFullResponse) => {
                console.log(response.headers);

                if ('undefined' !== typeof(properties.encoding)) {
                    body = iconv.decode(body, properties.encoding);
                }

                return CheerIO.load(body, {
                    decodeEntities: false
                });
            }
        });
    }


    /**
     *
     */
    _getCookie(name, properties) {
        let cookieProperties = Object.assign({}, this._cookieDefault, properties),
            cookie = [
                name +'='+ cookieProperties.value,
                'expires='+ new Date(new Date().getTime() + cookieProperties.expires * 1000),
                'path='+ cookieProperties.path
            ];

        if (true === cookieProperties.httpOnly) {
            cookie.push('httpOnly');
        }

        return Request.cookie(cookie.join('; '));
    }


    /**
     *
     */
    _getHeader() {
        return {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Charset': 'UTF-8;q=0.7,*;q=0.3',
            'Accept-Encoding': 'gzip, deflate',
            'Accept-Language': 'he-IL,en;q=0.8,he;q=0.6',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2815.0 Safari/537.36',
            'Referrer': this.options.referrer
        };
    }


    /**
     *
     */
     _getUrlPeroperies(url) {
         let matches = url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);

         return {
             url: matches[0],
             domain: matches[1]
         };
     }
}

export default XHR;