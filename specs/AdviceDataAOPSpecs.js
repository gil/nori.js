describe("AOP advice data", function() {

	var Dog;

	beforeEach(function(){

		Dog = function() {};

		Dog.prototype.bark = function() {
			console.log("woof!");
		}

	});

	it("should receive method name inside advice", function() {

		// Mock method
		Dog.prototype.bark = function() {
			shouldBeCalledAtOrder(2);
		}

		var dog = new Dog();
		var calledMethod = null;

		Nori.AOP.before(dog, "bark", function(adviceData){
			calledMethod = adviceData.method;
		});

		dog.bark();
		expect( calledMethod ).toEqual( "bark" );
	});

	it("should add \"around\" advice to function and change arguments", function() {

		// Mock method
		var barkCount = null;

		Dog.prototype.bark = function(times) {
			barkCount = times;
		}

		var dog = new Dog();

		Nori.AOP.around(dog, "bark", function(adviceData){
			adviceData.arguments[0] = 10;
			adviceData.invoke();
		});

		dog.bark(3);
		expect( barkCount ).toEqual( 10 );
	});

	it("should receive captured exception inside advice", function() {

		// Mock method
		Dog.prototype.bark = function() {
			this_method_call_will_break();
		}

		var dog = new Dog();
		var exception = null;

		Nori.AOP.afterThrow(dog, "bark", function(adviceData){
			exception = adviceData.exception;
		});

		dog.bark();
		expect( exception ).toBeInstanceof( Error );
	});

});