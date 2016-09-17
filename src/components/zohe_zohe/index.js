import NadlanBase from '../../base/nadlan_base';
import XHR from '../../utils/xhr';
import atob from 'atob';

class ZoheZohe extends NadlanBase {
    /**
     *
     */
    constructor() {
        super();
        console.log('ZoheZohe Loaded');
    }


    get(properties = {}) {
        let xhr = new XHR(),
            response;

        xhr.setReferrer(this._getDomain());
        response = xhr.get({
            url: this.getUrl()
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
        return atob('UmVhbEVzdGF0ZS9Gb3JTYWxlL1JlYWxFc3RhdGVQYWdlLmFzcHg=');
    }



    /**
     * @example: http://example.com
     */
    _getDomain() {
        return atob('aHR0cDovL3d3dy53aW53aW4uY28uaWwv');
    }
}

export default ZoheZohe;