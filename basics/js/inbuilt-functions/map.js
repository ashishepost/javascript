// Library Defination Section
Array.prototype.customMap = function(callback) {

    if (typeof callback === 'function') {
        returnArray = [];
        for (index = 0; index < this.length; index++) {

            returnArray.push(callback(this[index]));

        }
        return returnArray;
    } else {
        console.log('No Callback Passed');
        return callback;
    }


};

Array.prototype.customMapEach = function(callback) {

    if (typeof callback === 'function') {
        returnArray = [];
        // console.log(typeof callback);
        this.forEach(function(value) {

            returnArray.push(value)

        });
        return returnArray;
    } else {
        console.log('No Callback Passed');
        return callback;
    }


};


// User Section
arrayData = ['ashish', 'sunil', 'Guarav'];
everyItemCallback = function(data) {
    return 'kal' + data;
}

// Result Section
console.log(arrayData.map(everyItemCallback));
console.log(arrayData.customMap(everyItemCallback));
// console.log(arrayData.customMapEach(everyItemCallback));
