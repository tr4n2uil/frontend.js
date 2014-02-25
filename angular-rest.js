angular.module( 'REST', [ 'ngResource' ] )
	.factory( 'Resource', [ '$resource', function( $resource ) {
		return function( url, params, methods ) {
			var defaults = {
				query: {
					method: 'get', 
					isArray: false,
				},
				create: { 
					method: 'post' 
				},
				update: { 
					method: 'put', 
					params: { id: '@id' }, 
					isArray: false 
				},
				remove: {
					method: 'delete',
					params: { id: '@id' }, 
					isArray: false
				}
			};

			methods = angular.extend( defaults, methods );

			var resource = $resource( url, params, methods );

			resource.prototype.$save = function() {
				if ( !this.id ) {
					return this.$create();
				}
				else {
					return this.$update();
				}
			};

			return resource;
		};
	}]);
