const Map = new require('./api_map.js');
const apiMetaData = new Map();

const util = require('util');
const network = require('./Utils/network.js')();


var requestMap = {};

var _client = null;
var requestId = 0;



function Serialize(fn,parameters){    
    var metaData = apiMetaData[fn];        
    var requestStr =  util.format("%d,%s,%s,%s",++requestId,metaData.Module,metaData.Command,JSON.stringify(parameters));
    return requestStr;

}


function GetTradingAccounts(fields,lastChangeTimestamp){        
    var request = Serialize(arguments.callee.name,{fields,lastChangeTimestamp});
    
    var promise = new Promise(function(resolve,reject){});
    requestMap[requestId.toString()] = { request, promise};

    network.Send(_client,request);
    
    return promise;
}

module.exports = function(client){
    _client = client;

    return{
        GetTradingAccounts : GetTradingAccounts,
        Requests : requestMap
    }
}