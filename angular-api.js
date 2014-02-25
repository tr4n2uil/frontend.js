angular.module( 'API', [] )
	.factory( 'API', [ '$rootScope', '$location', '$route', '$routeParams', 
		function($rootScope, $location, $route, $routeParams){
			var API = {};
			API.Helpers = { path: undefined, popup: undefined };
			API.Resources = { Session: undefined };
			API.Scope = $rootScope;

			API.REST = {
				query: function(resource, key, params, callback){
		    		API.Scope.loader = true;
		    		API.Scope[key] = false;
		    		var params = params || {id: $routeParams.id};
		            API.Resources[resource].query(params)
		            	.$promise.then(
			                function(data){
			                    console.log('API Query: '+JSON.stringify(data.objects || data));
			                    API.Scope.loader = false;
			                    API.Scope[key] = data.objects || data;
			                    if(callback) callback();
			                }, 
			                function(data){
			                    //TODO
			                    API.Scope.loader = false;
			                }
			            );
		        },

		        select: function(key, value){
		        	API.Scope[key] = value;
		        	return true;
		        },

		        create: function(resource, object, block, callback){
		        	console.log(object);
		        	API.Scope.loader = true;
		            API.Resources[resource].create(object)
		            	.$promise.then(
			                function(data){
			                    console.log('API Create: '+JSON.stringify(data));
			                    API.Scope.loader = false;
			                    API.Helpers.popup(block, true);
			                    $route.reload();
			                    if(callback) callback();
			                }, 
			                function(data){
			                    //TODO
			                    API.Scope.loader = false;
			                }
			            );
		        },

		        update: function(resource, object, block, callback){
		        	console.log(object);
		        	API.Scope.loader = true;
		            API.Resources[resource].update(object)
		            	.$promise.then(
			                function(data){
			                    console.log('API Update: '+JSON.stringify(data));
			                    API.Scope.loader = false;
			                    API.Helpers.popup(block, true);
			                    if(callback) callback();
			                }, 
			                function(data){
			                    //TODO
			                    API.Scope.loader = false;
			                }
			            );
		        },

		        remove: function(resource, key, block, element, callback){
		        	object = API.Scope[key];
		        	console.log(object);
		        	API.Scope.loader = true;
		        	API.Resources[resource].remove({id:object.id})
		            	.$promise.then(
			                function(data){
			                    console.log('API Remove: '+JSON.stringify(data));
			                    API.Scope.loader = false;
			                    API.Helpers.popup(block, true);
			                    $(element+object.id).remove();
			                    if(callback) callback();
			                }, 
			                function(data){
			                    //TODO
			                    API.Scope.loader = false;
			                }
			            );
		        }
		    };

		    API.Session = {
		    	check: function(){
					user = window.SessionUser || false;
					console.log('check session: ' + user);
					if(user){
						API.Scope.user = user;
						console.log("Logged In " + user.first_name);
						if($location.path() == '/'){
							$location.path(API.Helpers.path());
						}
					}
					else {
						console.log("Not Logged In");
						$location.path('/');
						return false;
					}
				},

				login: function(credentials, callback){
					console.log(credentials);
			    	API.Scope.loader = true;
					API.Resources.Session.create(credentials).$promise.then(
						function(data){
							console.log(data);
							API.Scope.loader = false;
							window.SessionUser = data;
							API.Scope.user = data;
							if(callback) callback();
							$location.path(API.Helpers.path());
						},
						function(){
							API.Scope.loader = false;
						}
					);
				},

				logout: function(callback){
			    	console.log(API.Scope.user.type);
			    	API.Scope.loader = true;
					API.Resources.Session.remove({id: API.Scope.user.type}).$promise.then(
						function(data){
							API.Scope.loader = false;
							API.Scope.user = undefined;
							if( window.SessionUser || false ){
								window.SessionUser = undefined;
							}
							if(callback) callback();
							$location.path('/');
						},
						function(){
							API.Scope.loader = false;
						}
					);
			    }
				
		    }

			return API;
		}]);
