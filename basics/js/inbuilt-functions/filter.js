var inputArray = [23, 'Ashish', 'Gaurav'];

Array.prototype.filteru = function(callback) {
    
    self = this;
    outputArray = [];
    if(self instanceof Array){
        for (var i = 0; i < self.length; i++) {
            
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