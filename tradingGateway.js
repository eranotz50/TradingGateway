const net = require('net');
const util = require('util');
const client = new net.Socket();

const network = require('./Utils/network.js')();

module.exports = function TradingGateway(config){
         
    this.Connect = function(){
        return new Promise(function(resolve,reject){
           
           network.BeginReceive(client,msg => {
                console.log(msg);
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