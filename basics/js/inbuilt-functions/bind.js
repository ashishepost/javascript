var module = {
    x: 42,
    getX: function() {
      return this.x;
    }
  }

// //   console.log(module.getX()); // The function gets invoked module Scope
  
//   var unboundGetX = module.getX;
// //   console.log(unboundGetX()); // The function gets invoked at the global scope
//   // expected output: undefined
  
// //   var boundGetX = unboundGetX.bind(module);
// //   console.log(boundGetX());
// //   // expected output: 42
// function kala(){}

// Function.prototype.bindu = function(ob){
//     console.log(ob)
//    ob.prototype = this;
//     console.log(ob)
//        return ob.prototype;
//   }
//   var lala = unboundGetX.bindu(module);
// //   console.log(lala);

// ClipBoard Section
// navigator.clipboard.writeText(JSON.stringify(module)).then(function() {
//     console.log("done")
//   }, function() {
//     console.log("not")
//   });

  var arr = [1,2,3,4,14,3,4,5, 14];
  var match = 14;
  console.log(arr, "Before");
  arr.forEach((element, i) => {
    if(element == match) {
         
         console.log(arr.splice(i, 1));
    }
    
  });
  
//   for (let i=0; i<arr.length; i++) {
    
//     if(arr[i] == match){
//         arr.splice(i, 1);
//         break;
//     }
//   }
  
  console.log(arr, "After");