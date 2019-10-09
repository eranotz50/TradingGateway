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
    },
    TradeUpdate : function(jsonData){
        var trade = JSON.parse(jsonData);
        observable.noNext('trade',trade);
    },
    MarginUpdate : function(jsonData){
        var margin = JSON.parse(jsonData);
        observable.noNext('margin',margin);
    }
}

function Deserialize(msg){

    var i1 = msg.indexOf(',');
    var i2 = msg.indexOf(',',i1 + 1);
    var i3 = msg.indexOf(',',i2 + 1);

    var requestIdStr = msg.substring(0,i1);
    //var requestId = parseInt(requestIdStr);
    
    var moduleName = msg.substring(i1 + 1, i2);
    var command = msg.substring(i2 + 1, i3);
    var json =  msg.substring(i3 +1, msg.length);

    return {

        RequestId : requestIdStr,
        Module : moduleName,
        Command : command,
        JsonData : json,

    }
}


function messageHandler(rawMsg){
    
    var message = Deserialize(rawMsg);

    if(message.RequestId === '-1'){ // if pumping
        try{
            push.handle(message.Command,message.JsonData);
        }                            
        catch(err){
             console.log(util.format('Error from push.handle(%s,{...})',message.Command));   
        }
    }
    else {  // if response
        
        var promise = api.Requests[message.RequestId];
        
        if(promise === undefined){
            observable.noNext('error','could not find handler for message -> ' + message.toString());
        }

        try{

            if(message.JsonData === "Exception"){
                promise.reject(response);
            }
            else{
                var response = JSON.parse(message.JsonData);
                promise.resolve(response);    
            }            
        }
        catch(e){
            promise.reject('Error parsing response data -> \n' + message.toString() + '\n' + e)
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
                network.Send(client,config.toString());
            });
        });                
    }

    this.on = observable.subscribe;    
}

TradingGateway.prototype = api;

module.exports = TradingGateway;
