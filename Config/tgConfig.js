const util = require('util');

var config = {   
    "port" : 14306,
    "address" : "185.49.100.17",
    "apiVersion" : 2.3,
    "PumpQuote" : false,
    "PumpTrade" : false,
    "PumpMargin" : false,
    "PumpUser" : false,
    "UseBase64" : true,
    "PumpSymbolsCon" : false,
    "PumpGroups" : false ,
    "toString" : function(){
        return util.format('apiVersion=%s, PumpQuote=%s, PumpTrade=%s, PumpMargin=%s, PumpUser=%s, UseBase64=%s, PumpSymbolsCon=%s, PumpGroups=%s'
                        ,this.apiVersion,this.PumpQuote,this.PumpTrade,this.PumpMargin,this.PumpUser,this.UseBase64,this.PumpSymbolsCon,this.PumpGroups)

    }
}

module.exports = config;
