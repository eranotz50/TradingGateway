
var onNextMessage = function(msg){

};

function BeginReceive(stream){

    var message = { size : -1 , Buffer : new Buffer(0)};

    stream.on('data', function(data) {    
               
        message.Buffer = Buffer.concat([message.Buffer,data]);    

        if(message.size == -1){
            
            var delimeterPos = -1;

            for (var i = 0; i < message.Buffer.length  && delimeterPos == -1; i++) {
                                        
                if(message.Buffer[i] === 10){
                    delimeterPos = i;    
                }                                                  
            }      
            
            if(delimeterPos !== -1){
                var lenStr = message.Buffer.toString('ascii',0,delimeterPos); // until delimiter
                message.size = parseInt(lenStr);

                message.Buffer = message.Buffer.slice(delimeterPos + 1, message.Buffer.length);   //message.Buffer.slice(delimeterPos + 1, message.Buffer.length - delimeterPos + 1 ); // buffer without message size + delimeter bytes 
            }
        }
        
        if(message.size && message.Buffer.length >= message.size){
            
            var msg = message.Buffer.toString('ascii',0,message.size);   
           
            message.Buffer =  message.Buffer.slice(message.size, message.Buffer.length);    //message.Buffer.slice(message.size, message.Buffer.length - message.size); // remove curret message bytes 
            message.size = -1;            
                        
            onNextMessage(msg);              
        }                                                            
    });
}


module.exports = function(){
   
    return {
        SetOnNextMessage : function(handler){
            onNextMessage = handler;
        },   
        
        BeginReceive : BeginReceive,              
    }


}

