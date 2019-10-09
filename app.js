var TradingGateway = require('./tradingGateway.js')
var config = require('./Config/tgConfig.js');
const util = require('util');

var tradingGateway = new TradingGateway(config);


tradingGateway.Connect()
    .then(res => {
        console.log(res);
        
        var dt = new Date('2000-01-01T00:00:00Z');
        tradingGateway.GetTradingAccounts(['Balance','Login'],dt)
            .then(tradingAccounts =>{
                console.log(util.format('Received %d tradingAccounts',tradingAccounts.length()))
            })
            .catch( err => console.log('Error from GetTradingAccounts()  -> ' + err))
    })
    .catch(err => console.log(err))

tradingGateway.on('quote',function(q){
    console.log(q);
}) 




/*
function test(obj){
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            console.log(key + " -> " + obj[key]);
        }
    }

}



var fields = ['Balance','Login'];
var stam = 'dfsgg';
var fieldsObj = {fields,stam}

test(fieldsObj);

var names = Object.keys(fieldsObj);
*/