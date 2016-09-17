import YadShtayim from './components/yad_shtayim';
import ZoheZohe from './components/zohe_zohe';

let yad = new YadShtayim();
let win = new ZoheZohe();

console.log('REQ SENT');
yad.get().then(($, response) => {

    console.log($.html());//.substr(0, 550)
    console.log(response);
});