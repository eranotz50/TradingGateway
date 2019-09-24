const net = require('net');
const util = require('util');
const client = new net.Socket();

const network = require('./Utils/network.js')();
const observable = require('./Utils/observable.js');



const push = {

    handle : function(command,jsonData){
        if(!this.command){
            throw new Error('Could not find Command -> ' + command);
        }

        this.command(jsonData);
    },
    FeedUpdate : function(jsonData){
        var feedQuote = JSON.parse(jsonData);
        observable.noNext('quote',feedQuote);
    }

}

function messageHandler(msg){
    
    var parts = msg.split(',');

    var requestId = parts[0];
    var command = parts[2];
    var jsonData = parts[3];

    if(requestId === -1){
        try{
            push.handle(command,jsonData);
        }                            
        catch(err){
             console.log(util.format('Error from push.handle(%s,{...})',command));   
        }
    }


}

module.exports = function TradingGateway(config){
         
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