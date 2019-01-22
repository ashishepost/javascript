var inputArray = [23, 'Ashish', 'Gaurav'];

Array.prototype.filteru = function(callback) {
    
    self = this;
    outputArray = [];
    if(this instanceof Array){
        for (var i = 0; i < this.length; i++) {
            
            if (callback(self[i]) != undefined) {
                outputArray.push(callback(self[i]));
            }
        }
    }

return outputArray;
};

function checkNumber(data){

    if(typeof data == "number"){
        return data
    }

}

// console.log(inputArray.filter(checkNumber));
console.log(inputArray.filteru(checkNumber));