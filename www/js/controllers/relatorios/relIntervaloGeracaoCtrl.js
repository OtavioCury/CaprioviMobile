angular.module('app.controllers')

.controller('relIntervaloGeracaoCtrl', ['$scope', '$stateParams', '$ionicLoading', 'CaprioviService', '$state', '$rootScope'
, '$ionicPopup', 'CaprioviFactory',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $ionicLoading, CaprioviService, $state, $rootScope, $ionicPopup, CaprioviFactory) {	
	
	$scope.mediaFemeas = 0;
	$scope.mediaMachos = 0;
	$scope.mediaRebanho = 0;

	$scope.vazio = true;
	if ($rootScope.relIntervaloGeracao.length > 0) {
		$scope.vazio = false;
		var soma = 0;
		var machos = [];
		var femeas = [];

		for(var i = 0; i < $rootScope.relIntervaloGeracao.length; i++){	
			soma = soma + $rootScope.relIntervaloGeracao[i].intervaloGeracao;
			if ($rootScope.relIntervaloGeracao[i].sexo == "SEXO_FEMEA") {
				femeas.push($rootScope.relIntervaloGeracao[i]);
			}else{
				machos.push($rootScope.relIntervaloGeracao[i]);
			}				
		}

		$scope.mediaRebanho = soma/$rootScope.relIntervaloGeracao.length;

		soma = 0;

		if (femeas.length > 0) {
			for(var i = 0; i < femeas.length; i++){		
				soma = soma + femeas[i].intervaloGeracao;	
			}
			$scope.mediaFemeas = soma/femeas.length;
		};

		soma = 0;

		if (machos.length > 0) {
			for(var i = 0; i < machos.length; i++){		
				soma = soma + machos[i].intervaloGeracao;	
			}
			$scope.mediaMachos = soma/machos.length;
		};		

		$scope.mediaFemeas = $scope.mediaFemeas.toFixed(3);
		$scope.mediaMachos = $scope.mediaMachos.toFixed(3);
		$scope.mediaRebanho = $scope.mediaRebanho.toFixed(3);

	};

	$scope.voltar = function(){
		$state.go('opcoes.relatorios');
	};

}])