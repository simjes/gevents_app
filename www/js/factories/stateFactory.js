angular.module('geekeventsApp')
	.factory('stateFactory', function() {

		var stateFactory = {};


		stateFactory.setState = function(state) {
			stateFactory.state = state;
		}

		stateFactory.getState = function(state) {
			return stateFactory.state;
		}


		return stateFactory;
	});
