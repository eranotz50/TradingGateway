const net = require('net');
const util = require('util');
const client = new net.Socket();

module.exports = function TradingGateway(config){

    
    this.Read = function(){
        return new Promise(function(resolve,reject){
            client.on('data', function(data) {    
                console.log('Client received: ' + data);
                 if (data.toString().endsWith('exit')) {
                   client.destroy();
                }
            });
        })
    }

    
         
    
   
    this.Connect = function(){
        return new Promise(function(resolve,reject){

            client.on('error', function(err) {
                reject(util.format('Error connting to %s:%s \n %s',config.address,config.port,err));
            });
                
            client.on('close', function() {
                resolve(util.format('Remote endpoint closed. %s:%s',client.remoteAddress,client.remotePort));    
            });
             
            client.connect(config.port,config.address,function(){
                resolve(util.format('Connected to %s:%s',config.address,config.port));    
            });
        });                
    }

}