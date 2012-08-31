describe("Dependency injection instantiation", function() {

	var Dog;

	beforeEach(function(){
		Dog = function() {};
	});

	it("should instantiate beans", function() {

		var nori = new Nori();
		nori.addBean({ name: "dog", type: Dog });

		var dog = nori.instance("dog");
		expect( dog ).toBeInstanceof( Dog );
	});

	it("should instantiate singleton beans by default", function() {

		var nori = new Nori();
		nori.addBean({ name: "dog", type: Dog });

		var firstDog = nori.instance("dog");
		var secondDog = nori.instance("dog");

		expect( firstDog ).toBe( secondDog );
	});

	it("should instantiate singleton beans", function() {

		var nori = new Nori();
		nori.addBean({ name: "dog", type: Dog, singleton: true });

		var firstDog = nori.instance("dog");
		var secondDog = nori.instance("dog");

		expect( firstDog ).toBe( secondDog );
	});

	it("should instantiate prototype beans", function() {

		var nori = new Nori();
		nori.addBean({ name: "dog", type: Dog, singleton: false });

		var firstDog = nori.instance("dog");
		var secondDog = nori.instance("dog");

		expect( firstDog ).not.toBe( secondDog );
	});

	it("should have multiple beans for the same type", function() {

		var nori = new Nori();
		nori.addBeans([
			{ name: "labrador", type: Dog },
			{ name: "bulldog", type: Dog }
		]);

		var labrador = nori.instance("labrador");
		var bulldog = nori.instance("bulldog");

		expect( labrador ).toBeInstanceof( Dog );
		expect( bulldog ).toBeInstanceof( Dog );
	});

	it("should have multiple beans for the same type, with different settings", function() {

		var nori = new Nori();
		nori.addBeans([
			{ name: "bulldog", type: Dog, singleton: true },
			{ name: "beagle", type: Dog, singleton: false }
		]);

		var firstBulldog = nori.instance("bulldog");
		var secondBulldog = nori.instance("bulldog");

		var firstBeagle = nori.instance("beagle");
		var secondBeagle = nori.instance("beagle");

		expect( firstBulldog ).toBe( secondBulldog );

		expect( firstBeagle ).not.toBe( secondBeagle );
		expect( firstBeagle ).not.toBe( firstBulldog );
		expect( secondBeagle ).not.toBe( firstBulldog );
	});

});

