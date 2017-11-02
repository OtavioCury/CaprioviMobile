angular.module('app.controllers')

.controller('relCoberturaReprodutorCtrl', ['$scope', '$stateParams', '$ionicLoading', 'CaprioviService', '$state', '$rootScope'
, '$ionicPopup', 'CaprioviFactory',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $ionicLoading, CaprioviService, $state, $rootScope, $ionicPopup, CaprioviFactory) {	

	$scope.vazio = false;
	if ($rootScope.relCoberturaReprodutor.length == 0) {
		$scope.vazio = true;
	};
	for (var i = 0; i < $rootScope.relCoberturaReprodutor.length; i++) {
		var aux = new Date($rootScope.relCoberturaReprodutor[i].animal.nascimento);
		$rootScope.relCoberturaReprodutor[i].animal.nascimento = (aux.getDate()) + '/' + (aux.getMonth()+1) + '/' +  
			(aux.getFullYear());
	};

	$scope.voltar = function(){
		$state.go('opcoes.relatorios');
	};

}])