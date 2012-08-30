describe("Dependency injection via property", function() {

	var House, Owner, Dog, Cat;

	beforeEach(function(){
		House = function() {};
		Owner = function() {};
		Dog = function() {};
		Cat = function() {};
	});

	it("should inject property", function() {

		var nori = new Nori();
		nori.addBeans([
			{ name: "house", type: House, properties: ["dog"] },
			{ name: "dog", type: Dog }
		]);

		var house = nori.instance("house");
		expect( house.dog ).toBeInstanceof( Dog );
	});

	it("should inject multiple properties", function() {

		var nori = new Nori();
		nori.addBeans([
			{ name: "house", type: House, properties: ["dog", "cat"] },
			{ name: "dog", type: Dog },
			{ name: "cat", type: Cat }
		]);

		var house = nori.instance("house");
		expect( house.dog ).toBeInstanceof( Dog );
		expect( house.cat ).toBeInstanceof( Cat );
	});

	it("should inject multiple properties with repetition", function() {

		var nori = new Nori();
		nori.addBeans([
			{ name: "house", type: House, properties: ["owner", "dog", "cat"] },
			{ name: "owner", type: Owner },
			{ name: "dog", type: Dog, properties: ["owner"] },
			{ name: "cat", type: Cat, properties: ["owner"] }
		]);

		var house = nori.instance("house");

		expect( house.owner ).toBeInstanceof( Owner );
		expect( house.dog ).toBeInstanceof( Dog );
		expect( house.cat ).toBeInstanceof( Cat );

		expect( house.dog.owner ).toBe( house.owner );
		expect( house.cat.owner ).toBe( house.owner );
	});

	it("should inject properties with custom names", function() {

		var nori = new Nori();
		nori.addBeans([
			{ name: "house", type: House, properties: {"pet": "dog"} },
			{ name: "dog", type: Dog }
		]);

		var house = nori.instance("house");
		expect( house.pet ).toBeInstanceof( Dog );
	});

	it("should inject multiple bean instances", function() {

		var nori = new Nori();
		nori.addBeans([
			{ name: "house", type: House, properties: {"firstPet": "dog", "secondPet": "dog"} },
			{ name: "dog", type: Dog, singleton: false }
		]);

		var house = nori.instance("house");
		expect( house.firstPet ).toBeInstanceof( Dog );
		expect( house.secondPet ).toBeInstanceof( Dog );
		expect( house.firstPet ).not.toBe( house.secondPet );
	});

});

