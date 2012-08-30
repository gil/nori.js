describe("Dependency injection via constructor", function() {

	var House, Dog, Cat;

	beforeEach(function(){
		House = function() {};
		Dog = function() {};
		Cat = function() {};
	});

	it("should inject constructor argument", function() {

		// Mock constructor to check if it was called
		var injectedDog = null;

		House = function(dog) {
			injectedDog = dog;
		}

		// Instantiate beans
		var nori = new Nori();
		nori.addBeans([
			{ name: "house", type: House, constructor: ["dog"] },
			{ name: "dog", type: Dog }
		]);

		var house = nori.instance("house");
		expect( injectedDog ).toBeInstanceof( Dog );
	});

	it("should inject multiple constructor arguments", function() {

		// Mock constructor to check if it was called
		var injectedDog = null;
		var injectedCat = null;

		House = function(dog, cat) {
			injectedDog = dog;
			injectedCat = cat;
		}

		// Instantiate beans
		var nori = new Nori();
		nori.addBeans([
			{ name: "house", type: House, constructor: ["dog", "cat"] },
			{ name: "dog", type: Dog },
			{ name: "cat", type: Cat }
		]);

		var house = nori.instance("house");
		expect( injectedDog ).toBeInstanceof( Dog );
		expect( injectedCat ).toBeInstanceof( Cat );
	});

});

