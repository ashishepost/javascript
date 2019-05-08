arr = ['as', 'sd', 'sd', 'sds', '', ''];


console.log(arr.filter(

    (val)=>{
        
        return  val;
        
    }
))

console.log(Boolean("f"));
// // (function kala(){
// // console.log(b);
// // var a = b = 5;
// // })();

// // console.log(a, b);





// // var start = new Date().getTime();

// // function first(num) {
// //     return function next(numNext) {

// //         if (arguments.length) {
// //             num = num + numNext;
// //             return next;
// //         } else {
// //             console.log(num);
// //         }


// //     }
// // }

// // first(10)(20)(30)(40)();

// // var end = new Date().getTime();
// // console.log(end - start);


// // var start = new Date().getTime();
// // function partial(argOuter) {
// //   const args = [];
// //   if (!arguments.length) {
// //     return 'No Args supplied';
// //   }
// //   args.push(argOuter);
// //   return function inner(argInner) {
// //     if (arguments.length) {
// //       args.push(argInner);
// //       return inner;
// //     }
// //     // Multiply all the arguments.
// //     return args.reduce((a, b) => a * b);
// //   }
// // }


// // console.log(partial(2)(4)(10)());



// // var end = new Date().getTime();
// // console.log(end - start);



// var obj = {
//   a: "A data",
//   b: "",
//   methodA: function(num){
//     return this.b = num;

//   },
//   methodB: function(num){
//     return num;
//     // console.log(this.a);
//   }
// };
// var objF = function(data){
//  this.tata = data;
//  // console.log(this.tata);
//  // return 10;
// }

// var inObj = Object.create(obj);

// console.log(inObj.methodB());

// var inObjF = new objF('Ahsihs');

// console.log(inObjF.prototype);
// console.log(inObj instanceof obj);
