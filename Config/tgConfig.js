const util = require('util');

var config = {   
    "port" : 14106,
    "address" : "185.49.100.17",
    "apiVersion" : 2.3,
    "PumpQuote" : true,
    "PumpTrade" : true,
    "PumpMargin" : true,
    "PumpUser" : true,
    "UseBase64" : true,
    "PumpSymbolsCon" : true,
    "PumpGroups" : true ,
    "toString" : function(){
        return util.format('apiVersion=%s, PumpQuote=%s, PumpTrade=%s, PumpMargin=%s, PumpUser=%s, UseBase64=%s, PumpSymbolsCon=%s, PumpGroups=%s'
                        ,this.apiVersion,this.PumpQuote,this.PumpTrade,this.PumpMargin,this.PumpUser,this.UseBase64,this.PumpSymbolsCon,this.PumpGroups)

    }
}

module.exports = config;
