describe("AOP RegExp method name matching", function() {

	var Dog;

	beforeEach(function(){

		Dog = function() {};

		Dog.prototype.bark = function() {
			console.log("woof!");
		}

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

	it("should add advice to multiple functions by matching with Regular Expressions during injection container bean configuration", function() {

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

		// Create handler bean
		var Logger = function() {};

		Logger.prototype.logMethodCall = function(adviceData) {
			if( adviceData.method === "setName" ) {
				shouldBeCalledAtOrder(1);
			} else if( adviceData.method === "setBreed" ) {
				shouldBeCalledAtOrder(3);
			} else {
				shouldNotBeCalled();
			}
		}

		var nori = new Nori();
		nori.addBeans([
			{
				name: "dog",
				type: Dog,
				advices: [
					{
						type: "before",
						method: /^set.+$/,
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
		dog.setName("Reg");
		dog.setBreed("Bulldog");
		dog.bark();

		expect().methodsCalledInOrder();
	});

});