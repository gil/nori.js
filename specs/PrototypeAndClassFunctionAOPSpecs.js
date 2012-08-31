describe("AOP to class prototype and class functions", function() {

	var Dog;

	beforeEach(function(){

		Dog = function() {};

		Dog.listPossibleColors = function() {
			console.log("black");
			console.log("brown");
			console.log("cream");
		}

		Dog.prototype.bark = function() {
			console.log("woof!");
		}

	});

	it("should apply advice to class prototype and affect every new instance", function(){

		// Mock method
		Dog.prototype.bark = function() {
			shouldBeCalledAtOrder(2);
		}

		Nori.AOP.before(Dog.prototype, "bark", function() {
			shouldBeCalledAtOrder(1);
		});

		// Created after advice
		var dog = new Dog();

		dog.bark();
		expect().methodsCalledInOrder();
	});

	it("should apply advice to class prototype and affect every existing instance", function(){

		// Mock method
		Dog.prototype.bark = function() {
			shouldBeCalledAtOrder(2);
		}

		// Created before advice
		var dog = new Dog();

		Nori.AOP.before(Dog.prototype, "bark", function() {
			shouldBeCalledAtOrder(1);
		});

		dog.bark();
		expect().methodsCalledInOrder();
	});

	it("should apply advice to class methods", function(){

		// Mock method
		Dog.listPossibleColors = function() {
			shouldBeCalledAtOrder(2);
		}

		Nori.AOP.before(Dog, "listPossibleColors", function() {
			shouldBeCalledAtOrder(1);
		});

		Dog.listPossibleColors();
		expect().methodsCalledInOrder();
	});

});