var handlers = {};

const noNext = function(event,value){

    if(handlers[event]){
        handlers[event].forEach(sub => {
            sub(value);
        });
    }
}

const subscribe = function(event,handler){
    
    if(typeof events[event] === undefined){
        events[event] = [];
    }

    events[event].push(handler);
}

module.exports = {

    noNext : noNext,
    subscribe : subscribe
}
