var TradingGateway = require('./tradingGateway.js')
var config = require('./Config/tradingGateway.json');

var tradingGateway = new TradingGateway(config);

tradingGateway.Connect()
    .then(res => {
        console.log(res);
        tradingGateway.StartReceive()
            .then(msg => console.log('Received -> ' + msg))
            .catch(err => console.log('Read Error -> ' + err));
    })
    .catch(err => console.log(err))
