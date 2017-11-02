angular.module('app.controllers')

.controller('rebanhoRelatorioCtrl', ['$scope', '$stateParams', '$ionicLoading', 'CaprioviService', '$state', '$rootScope'
, '$ionicPopup', 'CaprioviFactory',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $ionicLoading, CaprioviService, $state, $rootScope, $ionicPopup, CaprioviFactory) {

	//console.log(JSON.stringify(window.navigator))

	if ($rootScope.relatorio == "IntervaloGeracao") {
		$scope.umRebanho = true;
		$scope.intervaloGeracao = {};
	}else{
		$scope.umRebanho = false;
	}
	
	var rebanhosSelecionados = [];	
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
	
	$scope.relatorios = function(){		

		$scope.showLoading();

		if ($scope.umRebanho == false) {
			if (rebanhosSelecionados.length > 0) {
				for(var i = 0; i < rebanhosSelecionados.length; i++){		
					ids.push(rebanhosSelecionados[i].id);				
				}

				if ($rootScope.relatorio == "AnimaisPorEntrada") {
					CaprioviService.relAnimaisPorEntrada(ids)
					.then(function(response){
						$rootScope.animaisPorEntrada = response.data;
						$scope.hideLoading();
						$state.go('relAnimaisPorEntrada');				
					});
				}else if($rootScope.relatorio == "MovimentacaoAnimal"){
					CaprioviService.relMovimentacaoAnimal(ids)
					.then(function(response){
						$rootScope.relMovimentacoes = response.data;					
						$scope.hideLoading();
						$state.go('relMovimentacao');				
					});
				}else if ($rootScope.relatorio == "NumeroCrias") {
					CaprioviService.relNumeroCrias(ids)
					.then(function(response){
						$rootScope.relNumeroCrias = response.data;					
						$scope.hideLoading();
						$state.go('relNumeroCrias');				
					});
				}else if ($rootScope.relatorio == "OcorrenciasClinicas") {
					CaprioviService.relOcorrenciasClinicas(ids)
					.then(function(response){
						$rootScope.relOcorrenciasClinicas = response.data;					
						$scope.hideLoading();
						$state.go('relOcorrenciasClinicas');				
					});
				}else if ($rootScope.relatorio == "PrevisaoPartos") {
					CaprioviService.relPrevisaoPartos(ids)
					.then(function(response){					
						$rootScope.relPrevisaoPartos = response.data;					
						$scope.hideLoading();
						$state.go('relPrevisaoPartos');				
					});
				}else if ($rootScope.relatorio == "CoberturaReprodutor") {
					CaprioviService.relCoberturaReprodutor(ids)
					.then(function(response){					
						$rootScope.relCoberturaReprodutor = response.data;					
						$scope.hideLoading();
						$state.go('relCoberturaReprodutor');				
					});
				}else if ($rootScope.relatorio == "TamanhoEfetivo") {
					CaprioviService.relTamanhoEfetivo(ids)
					.then(function(response){					
						$rootScope.relTamanhoEfetivo = response.data;					
						$scope.hideLoading();
						$state.go('relTamanhoEfetivo');				
					});
				}else if ($rootScope.relatorio == "Vermifugacao") {
					CaprioviService.relVermifugacao(ids)
					.then(function(response){					
						$rootScope.relVermifugacao = response.data;					
						$scope.hideLoading();
						$state.go('relVermifugacao');				
					});
				}else if ($rootScope.relatorio == "FemeasIdadeReprodutiva") {
					CaprioviService.relFemeasIdadeReprodutiva(ids)
					.then(function(response){					
						$rootScope.relFemeasIdadeReprodutiva = response.data;					
						$scope.hideLoading();
						$state.go('relFemeasIdadeReprodutiva');				
					});
				}else if ($rootScope.relatorio == "Partos") {
					CaprioviService.relPartos(ids)
					.then(function(response){					
						$rootScope.relPartos = response.data;					
						$scope.hideLoading();
						$state.go('relPartos');				
					});
				}else if ($rootScope.relatorio == "ControleParasitario") {
					CaprioviService.relControleParasitario(ids)
					.then(function(response){					
						$rootScope.relControleParasitario = response.data;					
						$scope.hideLoading();
						$state.go('relControleParasitario');				
					});
				};

			}else{
				$scope.hideLoading();
				var alertPopup = $ionicPopup.alert({
			     	title: 'Erro na geração de relatório',
			     	template: 'Selecione ao menos um rebanho para gerar o relatório', 		
					okText: 'Ok'
	   			});
			}
		}else{
			if ($rootScope.relatorio == "IntervaloGeracao") {
				CaprioviService.relIntervaloGeracao($scope.intervaloGeracao.rebanho.id)
				.then(function(response){					
					$rootScope.relIntervaloGeracao = response.data;					
					$scope.hideLoading();
					$state.go('relIntervaloGeracao');				
				});
			}
		}
				
		
	};

	$scope.cancelar = function(){
		$rootScope.relatorio = "";
		$state.go('opcoes.relatorios');
	};

}])