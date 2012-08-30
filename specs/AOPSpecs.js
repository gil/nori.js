describe("AOP", function() {

	var Dog;

	beforeEach(function(){

		Dog = function() {};

		Dog.prototype.bark = function() {
			console.log("woof!");
		}

	});

	it("should be able to add \"before\" advice to function", function() {

		var calls = [];

		// Mock method
		Dog.prototype.bark = function() {
			calls.push(2);
		}

		var dog = new Dog();

		Nori.AOP.before(dog, "bark", function(){
			calls.push(1);
		});

		dog.bark();
		expect( calls ).toHaveTotalOf( 2 );
		expect( calls ).toBeInOrder();
	});

	it("should be able to add \"after\" advice to function", function() {

		var calls = [];

		// Mock method
		Dog.prototype.bark = function() {
			calls.push(1);
		}

		var dog = new Dog();

		Nori.AOP.after(dog, "bark", function(){
			calls.push(2);
		});

		dog.bark();
		expect( calls ).toHaveTotalOf( 2 );
		expect( calls ).toBeInOrder();
	});

	it("should be able to add multiple advices to function", function() {

		var calls = [];

		// Mock method
		Dog.prototype.bark = function() {
			calls.push(2);
		}

		var dog = new Dog();

		Nori.AOP.before(dog, "bark", function(){
			calls.push(1);
		});

		Nori.AOP.after(dog, "bark", function(){
			calls.push(3);
		});

		dog.bark();
		expect( calls ).toHaveTotalOf( 3 );
		expect( calls ).toBeInOrder();
	});

	it("should be able to add \"introduction\" advice to function", function() {

		var calls = [];
		var dog = new Dog();

		Nori.AOP.introduction(dog, "bark", function(){
			calls.push(1);
		});

		dog.bark();
		expect( calls ).toHaveTotalOf( 1 );
		expect( calls ).toBeInOrder();
	});

	it("should be able to add \"around\" advice to function", function() {

		var calls = [];

		// Mock method
		Dog.prototype.bark = function() {
			calls.push(2);
		}

		var dog = new Dog();

		Nori.AOP.around(dog, "bark", function(adviceData){
			calls.push(1);
			adviceData.invoke();
			calls.push(3);
		});

		dog.bark();
		expect( calls ).toHaveTotalOf( 3 );
		expect( calls ).toBeInOrder();
	});

	it("should be able to add \"around\" advice to function and capture returned value", function() {

		// Mock method
		Dog.prototype.bark = function() {
			return true;
		}

		var dog = new Dog();
		var returned = null;

		Nori.AOP.around(dog, "bark", function(adviceData){
			returned = adviceData.invoke();
		});

		dog.bark();
		expect( returned ).toBeTruthy();
	});

	it("should be able to add \"around\" advice to function and read arguments", function() {

		// Mock method
		Dog.prototype.bark = function(times) {}

		var dog = new Dog();
		var barkCount = null;

		Nori.AOP.around(dog, "bark", function(adviceData, times){
			barkCount = times;
			adviceData.invoke();
		});

		dog.bark(3);
		expect( barkCount ).toEqual( 3 );
	});

	it("should be able to add \"around\" advice to function and change arguments", function() {

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

	it("should be able to add \"afterThrow\" advice to function and handle unhandled exceptions", function() {

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

	it("should be able to add \"afterFinally\" advice to function and do something after an exception was thrown", function() {

		// Mock method
		Dog.prototype.bark = function() {
			this_method_call_will_break();
		}

		var dog = new Dog();
		var finallyCalled = false;

		Nori.AOP.afterThrow(dog, "bark", function(){
			// Got an exception, did nothing
		});

		Nori.AOP.afterFinally(dog, "bark", function(){
			finallyCalled = true;
		});

		dog.bark();
		expect( finallyCalled ).toBeTruthy();
	});

	it("should be able to add \"afterFinally\" advice to function and do something even when there wasn't any exception being thrown", function() {

		// Mock method
		Dog.prototype.bark = function() {}

		var dog = new Dog();
		var finallyCalled = false;

		Nori.AOP.afterFinally(dog, "bark", function(){
			finallyCalled = true;
		});

		dog.bark();
		expect( finallyCalled ).toBeTruthy();
	});

});

