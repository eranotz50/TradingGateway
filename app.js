var TradingGateway = require('./tradingGateway.js')
var config = require('./Config/tradingGateway.json');

var tradingGateway = new TradingGateway(config);

tradingGateway.Connect()
    .then(msg => console.log(msg))
    .catch(err => console.log(err))
