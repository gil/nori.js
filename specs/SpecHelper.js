var shouldBeCalledAtOrder, shouldNotBeCalled;

beforeEach(function() {

	var methodCalls = [];

	shouldBeCalledAtOrder = function(order) {
		methodCalls.push( order );
	}

	shouldNotBeCalled = function() {
		methodCalls.push( "!" );
	}

	this.addMatchers({

		// Compare instanceof expected class
		toBeInstanceof: function(expectedClass) {

			this.message = function () {
				return "Expression didn't match class instanceof expectation!";
			}

			return (this.actual instanceof expectedClass);
		},

		// Check if all methods were called in correct order
		methodsCalledInOrder: function() {

			var outOfOrder = false;
			var wrongMethodCalled = false;

			if( methodCalls.length > 0 ) {
				for( var i = 0; i < methodCalls.length; i++ ) {

					if( methodCalls[i] === "!" ) {

						wrongMethodCalled = true;
						break;

					} else if( methodCalls[i] !== i + 1 ) {

						outOfOrder = true;
						break;
					}

				}
			}

			this.message = function () {
				var notText = this.isNot ? " not" : "";

				if( methodCalls.length < 1 ) {
					return "No method called!";
				} else if( outOfOrder ) {
					return "Expected calls" + notText + " to be in order!";
				} else if( wrongMethodCalled ){
					return "A method that wasn't supposed to be called was called!";
				}
			}

			return ( methodCalls.length > 0 && !outOfOrder && !wrongMethodCalled );
		}

	});
});