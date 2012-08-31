describe("AOP", function() {

	var Dog;

	beforeEach(function(){

		Dog = function() {};

		Dog.prototype.bark = function() {
			console.log("woof!");
		}

	});

	it("should add \"before\" advice to function", function() {

		// Mock method
		Dog.prototype.bark = function() {
			shouldBeCalledAtOrder(2);
		}

		var dog = new Dog();

		Nori.AOP.before(dog, "bark", function(){
			shouldBeCalledAtOrder(1);
		});

		dog.bark();
		expect().methodsCalledInOrder();
	});

	it("should add \"after\" advice to function", function() {

		// Mock method
		Dog.prototype.bark = function() {
			shouldBeCalledAtOrder(1);
		}

		var dog = new Dog();

		Nori.AOP.after(dog, "bark", function(){
			shouldBeCalledAtOrder(2);
		});

		dog.bark();
		expect().methodsCalledInOrder();
	});

	it("should add multiple advices to function", function() {

		// Mock method
		Dog.prototype.bark = function() {
			shouldBeCalledAtOrder(2);
		}

		var dog = new Dog();

		Nori.AOP.before(dog, "bark", function(){
			shouldBeCalledAtOrder(1);
		});

		Nori.AOP.after(dog, "bark", function(){
			shouldBeCalledAtOrder(3);
		});

		dog.bark();
		expect().methodsCalledInOrder();
	});

	it("should add \"introduction\" advice to function", function() {

		// Mock method
		Dog.prototype.bark = function() {
			shouldNotBeCalled();
		}

		var dog = new Dog();

		Nori.AOP.introduction(dog, "bark", function(){
			shouldBeCalledAtOrder(1);
		});

		dog.bark();
		expect().methodsCalledInOrder();
	});

	it("should add \"around\" advice to function", function() {

		// Mock method
		Dog.prototype.bark = function() {
			shouldBeCalledAtOrder(2);
		}

		var dog = new Dog();

		Nori.AOP.around(dog, "bark", function(adviceData){
			shouldBeCalledAtOrder(1);
			adviceData.invoke();
			shouldBeCalledAtOrder(3);
		});

		dog.bark();
		expect().methodsCalledInOrder();
	});

	it("should add \"around\" advice to function and capture returned value", function() {

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

	it("should add \"around\" advice to function and read arguments", function() {

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

	it("should add \"afterThrow\" advice to function and handle unhandled exceptions", function() {

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

	it("should apply advices during injection container bean configuration", function() {

		// Mock method
		Dog.prototype.bark = function() {
			shouldBeCalledAtOrder(2);
		}

		// Create handler bean
		var Logger = function() {};

		Logger.prototype.logMethodCall = function() {
			shouldBeCalledAtOrder(1);
		}

		var nori = new Nori();
		nori.addBeans([
			{
				name: "dog",
				type: Dog,
				advices: [
					{
						type: "before",
						method: "bark",
						handler: "logger",
						handlerMethod: "logMethodCall"
					}
				]
			},
			{
				name: "logger",
				type: Logger
			}
		]);

		var dog = nori.instance("dog");

		dog.bark();
		expect().methodsCalledInOrder();
	});

	it("should add advice to multiple functions by matching with Regular Expressions", function() {

		// Mock method
		Dog.prototype.setName = function(name) {
			shouldBeCalledAtOrder(2);
		}

		Dog.prototype.setBreed = function(breed) {
			shouldBeCalledAtOrder(4);
		}

		Dog.prototype.bark = function() {
			shouldBeCalledAtOrder(5);
		}

		var dog = new Dog();

		Nori.AOP.before(dog, /^set.+$/, function(adviceData){
			if( adviceData.method === "setName" ) {
				shouldBeCalledAtOrder(1);
			} else if( adviceData.method === "setBreed" ) {
				shouldBeCalledAtOrder(3);
			} else {
				shouldNotBeCalled();
			}
		});

		dog.setName("Reg");
		dog.setBreed("Bulldog");
		dog.bark();

		expect().methodsCalledInOrder();
	});

});

