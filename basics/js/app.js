function bindu(lal) {
	// console.log(this);
	console.log(lal + this.key);
}

obj = {key: 'key Data'};
bindu.bind(obj)('hey ');
bindu.call(obj, 'hey ');
bindu.apply(obj, ['hey ']);




function closure(){
	var upper = "upper";

	return function(){
		console.log(upper);
	}

}


closure()();


function ClassEx(name) {
    this.name = name;
}


ClassEx.prototype.displayName = function(){
    console.log(this.name);
}


var classObj = new ClassEx('honey');
classObj.displayName();

class User {

    constructor(name) {
        this.name = name;
    }

    displayName() {
        console.log(this.name);
    }

}

let userObj = new User('Singh');
userObj.displayName();