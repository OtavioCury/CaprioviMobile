angular.module('app.controllers')

.controller('rebanhoRelatorioGanhoCtrl', ['$scope', '$stateParams', '$ionicLoading', 'CaprioviService', '$state', '$rootScope'
, '$ionicPopup', 'CaprioviFactory',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $ionicLoading, CaprioviService, $state, $rootScope, $ionicPopup, CaprioviFactory) {
	
	$scope.pattern="/^(\d+(?:[\.\,]\d{1})?)$/";
	$scope.ganho = {};
	var ids = [];

	/* LOADING FUNCTION */
	$scope.showLoading = function() {
		$ionicLoading.show()
	};
	$scope.hideLoading = function(){
		$ionicLoading.hide();
	};

	$scope.rebanhosSel = function(rebanho){

		var presente = false;		

		for(var i = 0; i < rebanhosSelecionados.length; i++){		
			if (rebanhosSelecionados[i].id == rebanho.id) {
				presente = true;
				rebanhosSelecionados.splice(i, 1);					
			};			
		}
		if (presente == false) {
			rebanhosSelecionados.push(rebanho);			
		};		
	};
	
	$scope.gerarRelatorio = function(ganhoGenetico){		
		
		$scope.showLoading();

		if (ganhoGenetico.propMachos == "5%") {
			ganhoGenetico.propMachos = 0.05;
			ganhoGenetico.intensidadeMacho = 2.06;
		}else if(ganhoGenetico.propMachos == "10%"){
			ganhoGenetico.propMacho = 0.1;
			ganhoGenetico.intensidadeMacho = 1.76;
		}else if(ganhoGenetico.propMachos == "15%"){
			ganhoGenetico.propMacho = 0.15;
			ganhoGenetico.intensidadeMacho = 1.56;
		}

		if (ganhoGenetico.propFemeas == "30%") {
			ganhoGenetico.propFemeas = 0.3;
			ganhoGenetico.intensidadeFemea = 1.16;
		}else if(ganhoGenetico.propFemeas == "40%"){
			ganhoGenetico.propFemeas = 0.4;
			ganhoGenetico.intensidadeFemea = 0.97;
		}else if(ganhoGenetico.propFemeas == "50%"){
			ganhoGenetico.propFemeas = 0.5;
			ganhoGenetico.intensidadeFemea = 0.8;
		}else if(ganhoGenetico.propFemeas == "60%"){
			ganhoGenetico.propFemeas = 0.6;
			ganhoGenetico.intensidadeFemea = 0.64;
		}else if(ganhoGenetico.propFemeas == "70%"){
			ganhoGenetico.propFemeas = 0.7;
			ganhoGenetico.intensidadeFemea = 0.5;
		}else if(ganhoGenetico.propFemeas == "80%"){
			ganhoGenetico.propFemeas = 0.8;
			ganhoGenetico.intensidadeFemea = 0.35;
		}

		if (ganhoGenetico.ajuste == "60 dias") {
			ganhoGenetico.ajuste = 60;
		}else if(ganhoGenetico.ajuste == "120 dias"){
			ganhoGenetico.ajuste = 120;
		}else if(ganhoGenetico.ajuste == "180 dias"){
			ganhoGenetico.ajuste = 180;
		}

		//$scope.ganho = ganhoGenetico;

		CaprioviService.relGanhoGenetico(ganhoGenetico)
		.then(function(response){					
			$rootScope.relGanhoGenetico = response.data;					
			$scope.hideLoading();
			$state.go('relGanhoGenetico');				
		});	
	};

	$scope.cancelar = function(){
		$rootScope.relatorio = "";
		$state.go('opcoes.relatorios');
	};

}])

.controller('relGanhoGeneticoCtrl', ['$scope', '$stateParams', '$ionicLoading', 'CaprioviService', '$state', '$rootScope'
, '$ionicPopup', 'CaprioviFactory',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $ionicLoading, CaprioviService, $state, $rootScope, $ionicPopup, CaprioviFactory) {

	/* LOADING FUNCTION */
	$scope.showLoading = function() {
		$ionicLoading.show()
	};
	$scope.hideLoading = function(){
		$ionicLoading.hide();
	};

	$scope.voltar = function(){
		$state.go('rebanhoRelatorioGanho');
	};
	

}])