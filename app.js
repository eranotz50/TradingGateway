var TradingGateway = require('./tradingGateway.js')
var config = require('./Config/tgConfig.js');

var tradingGateway = new TradingGateway(config);

/*function onNextMessage(msg){
    console.log(JSON.stringify(msg));
}*/

tradingGateway.Connect()
    .then(res => console.log(res))
    .catch(err => console.log(err))
