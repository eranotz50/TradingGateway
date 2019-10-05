const apiMetaData = require('./api_map.js')();
const util = require('util');
const acorn = require('acorn');    


var client = null;
var requestId = 0;



function Request(fn){
    var metaData = apiMetaData[fn];
    var parameters = { 
        fields : fields,
        lastChangeTimestamp : lastChangeTimestamp
    };   
}

function Serialize(requestId,metaData,parameters){
    return util.format("%d,%s,%s,%s",requestId,metaData.module,metaData.command,JSON.stringify(parameters));
}


function GetTradingAccounts(fields,lastChangeTimestamp){
    
    var obj = {};
    obj['fields'] = fields;
    obj['lastChangeTimestamp'] = lastChangeTimestamp;


    var args = acorn.parse(arguments.callee).body[0].params; 
    var fn = arguments.callee.name;    
 

}








module.exports = function(client){
    client = client;

    return{
        GetTradingAccounts : GetTradingAccounts
    }
}