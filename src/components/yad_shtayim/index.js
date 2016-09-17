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
        let xhr = new XHR(),
            response;

        xhr.setReferrer(this._getDomain());

        response = xhr.get({
            url: this.getUrl(),
            params: {},
            encoding: 'win1255',
            cookies: {
                CLIENT_WIDTH_DIR: {
                    value: 2541,
                    expires: 60 * 60 * 24 * 10
                },
                MAIN_WIDTH_DIR: {
                    value: 2541,
                    expires: 60 * 60 * 24 * 10
                },
                DivurNadlanSearchAgain_sales: {
                    value: 2,
                    expires: 60 * 60 * 24 * 30 * 12 * 10
                },
                PRID: {
                    value: 'iq',
                    expires: 1
                }
            }
        });

        return response;
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