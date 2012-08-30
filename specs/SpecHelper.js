beforeEach(function() {
	this.addMatchers({

		// Compare instanceof expected class
		toBeInstanceof: function(expectedClass) {

			this.message = function () {
				return "Expression didn't match class instanceof expectation!";
			}

			return (this.actual instanceof expectedClass);
		},

		// Count number of calls in array
		toHaveTotalOf: function(expectedCalls) {

			var totalCalls = (this.actual ? this.actual.length : 0);

			this.message = function () {
				var notText = this.isNot ? " not " : "";
				return "Expected " + notText + expectedCalls + " calls, but got " + totalCalls + " calls!";
			}

			return (totalCalls === expectedCalls);
		},

		// Check if array is in order, starting with 1
		toBeInOrder: function() {

			this.message = function () {
				var notText = this.isNot ? " not" : "";
				return "Expected calls" + notText + " to be in order!";
			}

			for( var i = 0; i < this.actual.length; i++ ) {
				if( this.actual[i] !== i + 1 ) {
					return false;
				}
			}

			return true;
		}

	});
});