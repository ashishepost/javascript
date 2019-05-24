
//


function a(){
    console.log(a.caller);
}

console.log(a());





/*
// Testing Scope Chain

var common = 10;

function methodA(){
    function methodB(){
        // var common = 30;
        console.log(common);
        // console.log(this===window);
        
    }
    var common = 20;
    console.log(common);
    // console.log(this===window);
    methodB();
}


console.log(common);
methodA();
*/



/*
// Testing Hoisting

console.log(a);
console.log(methodA());

var a = 10;

function methodA(){
    console.log('Method A');
}
*/

