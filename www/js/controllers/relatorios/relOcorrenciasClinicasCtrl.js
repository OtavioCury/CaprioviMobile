angular.module('app.controllers')

.controller('relOcorrenciasClinicasCtrl', ['$scope', '$stateParams', '$ionicLoading', 'CaprioviService', '$state', '$rootScope'
, '$ionicPopup', 'CaprioviFactory',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $ionicLoading, CaprioviService, $state, $rootScope, $ionicPopup, CaprioviFactory) {	

	$scope.vazio = false;
	if ($rootScope.relOcorrenciasClinicas.length == 0) {
		$scope.vazio = true;
	};
	$scope.anos = [];	
	$scope.labelsDoenca = [];	

	for(var i = 0; i < $rootScope.relOcorrenciasClinicas.length; i++){

		var doenca = $rootScope.relOcorrenciasClinicas[i].doenca.nome;		
		var ano = new Date($rootScope.relOcorrenciasClinicas[i].data).getFullYear();
		var presenteDoenca = false;
		var presenteAno = false;

		for (var j = 0; j < $scope.labelsDoenca.length; j++) {
			if ($scope.labelsDoenca[j] == doenca) {
				presenteDoenca = true;
			};
		};

		for (var j = 0; j < $scope.anos.length; j++) {
			if ($scope.anos[j] == ano) {
				presenteAno = true;
			};
		};

		if (presenteDoenca == false) {
			$scope.labelsDoenca.push(doenca);
		};

		if (presenteAno == false) {
			$scope.anos.push(ano);
		};
		
	};		

	$scope.dataDoenca = [];
	$scope.dataAno = [];

	$scope.anos.sort();	

	for (var j = 0; j < $scope.labelsDoenca.length; j++) {
		var aux = 0;

		for(var i = 0; i < $rootScope.relOcorrenciasClinicas.length; i++){
			if ($rootScope.relOcorrenciasClinicas[i].doenca.nome == $scope.labelsDoenca[j]) {
				aux++;
			};
		};

		$scope.dataDoenca.push(aux);				
	};	

	for (var j = 0; j < $scope.anos.length; j++) {
		var aux = 0;

		for(var i = 0; i < $rootScope.relOcorrenciasClinicas.length; i++){
			if (new Date($rootScope.relOcorrenciasClinicas[i].data).getFullYear() == $scope.anos[j]) {
				aux++;
			};
		};

		$scope.dataAno.push(aux);				
	};	

	$scope.voltar = function(){
		$state.go('opcoes.relatorios');
	};

}])