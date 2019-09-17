const net = require('net');
const util = require('util');
const client = new net.Socket();

module.exports = function TradingGateway(config){
    
     
    this.Connect = function(onNextMessage){
        return new Promise(function(resolve,reject){

           var message = { size : undefined, SizeBuffer : new Buffer(0) ,  MessageBuffer : new Buffer(0)};

            client.on('data', function(data) {    
                        
                message.Buffer = Buffer.concat(message.Buffer,data);    

                if(!message.size){
                    
                    var delimeterPos = -1;

                    for (var i = 0; i < message.Buffer.length; i++) {
                                                
                        if(message.Buffer[i] === 10){
                            delimeterPos = i;    
                        }                                                  
                    }      
                    
                    if(delimeterPos !== -1){
                        var lenStr = message.Buffer.toString('ascii',0,delimeterPos); // until delimiter
                        message.size = parseInt(lenStr);

                        message.Buffer = message.Buffer.slice(0,delimeterPos + 1); // buffer without delimeter
                    }
                }
                
                if(message.size && message.Buffer.length == message.size){
                    var json = message.Buffer.toString('ascii',0,message.size);   
                    var message = JSON.parse(json); 
                    onNextMessage(onNextMessage);   
                }

                
                                                
                console.log('data -> ' + data) ;  
            });

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

                resolve(util.format('Connected to %s:%s',config.address,config.port));    
            });
        });                
    }

}