describe("AOP exception handling", function() {

	var Dog;

	beforeEach(function(){

		Dog = function() {};

		Dog.prototype.bark = function() {
			console.log("woof!");
		}

	});

	it("should add \"afterThrow\" advice to function and handle unhandled exceptions", function() {

		// Mock method
		Dog.prototype.bark = function() {
			shouldBeCalledAtOrder(1);
			this_method_call_will_break();
			shouldNotBeCalled();
		}

		var dog = new Dog();

		Nori.AOP.afterThrow(dog, "bark", function(adviceData){
			shouldBeCalledAtOrder(2);
		});

		dog.bark();
		expect().methodsCalledInOrder();
	});

	it("should add \"afterFinally\" advice to function and do something after an exception was thrown", function() {

		// Mock method
		Dog.prototype.bark = function() {
			this_method_call_will_break();
		}

		var dog = new Dog();

		Nori.AOP.afterThrow(dog, "bark", function(){
			// Got an exception, did nothing
		});

		Nori.AOP.afterFinally(dog, "bark", function(){
			shouldBeCalledAtOrder(1);
		});

		dog.bark();
		expect().methodsCalledInOrder();
	});

	it("should add \"afterFinally\" advice to function and do something even when there wasn't any exception being thrown", function() {

		// Mock method
		Dog.prototype.bark = function() {}

		var dog = new Dog();

		Nori.AOP.afterFinally(dog, "bark", function(){
			shouldBeCalledAtOrder(1);
		});

		dog.bark();
		expect().methodsCalledInOrder();
	});

});