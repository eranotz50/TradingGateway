const net = require('net');
const util = require('util');
const client = new net.Socket();

const network = require('./Utils/network.js')();
const observable = require('./Utils/observable.js');
const api = require('./api.js')(client);


var lastPingTime = new Date('0001-01-01T00:00:00Z');

const push = {

    handle : function(command,jsonData){
        if(!this[command]){
            throw new Error('Could not find Command -> ' + command);
        }

        this[command](jsonData);
    },
    FeedUpdate : function(jsonData){
        var feedQuote = JSON.parse(jsonData);
        observable.noNext('quote',feedQuote);
    },
    LoginUpdate : function(jsonData){
        var login = JSON.parse(jsonData);
        observable.noNext('login',login);
    },
    Mt4ConnectStatus : function(jsonData){
        var status = JSON.parse(jsonData);
        lastPingTime = Date.now();
    }

}

function Deserialize(msg){

    var i1 = msg.indexOf(',');
    var i2 = msg.indexOf(',',i1 + 1);
    var i3 = msg.indexOf(',',i2 + 1);

    var requestIdStr = msg.substring(0,i1);
    var requestId = parseInt(requestIdStr);
    
    var moduleName = msg.substring(i1 + 1, i2);
    var command = msg.substring(i2 + 1, i3);
    var json =  msg.substring(i3 +1, msg.length);

    return {

        RequestId : requestId,
        Module : moduleName,
        Command : command,
        JsonData : json
    }
}


function messageHandler(msg){
    
    var parts = Deserialize(msg);

    if(parts.RequestId === -1){
        try{
            push.handle(parts.Command,parts.JsonData);
        }                            
        catch(err){
             console.log(util.format('Error from push.handle(%s,{...})',parts.Command));   
        }
    }
}

function TradingGateway(config){
         
    this.Connect = function(){
        return new Promise(function(resolve,reject){
                       
            network.SetOnNextMessage(function(msg){                
                if(msg.includes("Connected")){                     
                    network.SetOnNextMessage(messageHandler);                                                                   
                    resolve(util.format('Connected to %s:%s',config.address,config.port));    
                }                
            })

            network.BeginReceive(client);
              
            client.on('error', function(err) {                
                reject(util.format('Error connting to %s:%s \n %s',config.address,config.port,err));
            });
                
            client.on('close', function() {
                resolve(util.format('Remote endpoint closed. %s:%s',client.remoteAddress,client.remotePort));    
            });
             
            client.connect(config.port,config.address,function(){                
                                 
                var dataBuffer = Buffer.from(config.toString(), 'utf8'); 
                var len = dataBuffer.length + '\n';
                var lenBuffer = Buffer.from(len);

                var sendBuffer = Buffer.concat([lenBuffer,dataBuffer]);                
                client.write(sendBuffer);                 
            });
        });                
    }

    this.on = observable.subscribe;    
}

TradingGateway.prototype = api;

module.exports = TradingGateway;
