describe('Run All Tests', function(){

	beforeEach(function() { 
   		console.log("Befor Testing");
	});  

	it("testFucntion Should Return Maya", function(){
		expect(testFunction()).toEqual('Maya');
		console.log("After Testing");
	});
});