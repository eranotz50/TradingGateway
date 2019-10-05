var TradingGateway = require('./tradingGateway.js')
var config = require('./Config/tgConfig.js');

var tradingGateway = new TradingGateway(config);

/*function onNextMessage(msg){
    console.log(JSON.stringify(msg));
}*/

/*tradingGateway.Connect()
    .then(res => console.log(res))
    .catch(err => console.log(err))

tradingGateway.on('quote',function(q){
    console.log(q);
})*/    


//var dt = new Date('2000-01-01T00:00:00Z');

//var tradingAccounts = tradingGateway.GetTradingAccounts(['Balance','Login'],dt)


var fields = ['Balance','Login'];
var fieldsObj = {fields}

var name = Object.keys(fieldsObj)[0];

var obj = {};
obj['fields'] = fields

console.log(obj);
