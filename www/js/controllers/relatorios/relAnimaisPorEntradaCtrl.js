angular.module('app.controllers')

.controller('relAnimaisPorEntradaCtrl', ['$scope', '$stateParams', '$ionicLoading', 'CaprioviService', '$state', '$rootScope'
, '$ionicPopup', 'CaprioviFactory',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $ionicLoading, CaprioviService, $state, $rootScope, $ionicPopup, CaprioviFactory) {	

	$scope.vazio = false;
	if ($rootScope.animaisPorEntrada.length == 0) {
		$scope.vazio = true;
	};
	$scope.anos = [];
	var compra = 0, nascimento = 0, emprestimo = 0, outros = 0;
	$scope.labels = ["Compra","Nascimento","Emprestimo","Outros"];		

	for(var i = 0; i < $rootScope.animaisPorEntrada.length; i++){		

		if ($rootScope.animaisPorEntrada[i].motivoEntrada == 'Compra') {
			compra++;
		}else if($rootScope.animaisPorEntrada[i].motivoEntrada == 'Nascimento'){
			nascimento++;
		}else if($rootScope.animaisPorEntrada[i].motivoEntrada == 'Emprestimo'){
			emprestimo++;
		}else if($rootScope.animaisPorEntrada[i].motivoEntrada == 'Outros'){
			outros++;
		};

		var date = new Date($rootScope.animaisPorEntrada[i].dataEntrada);
		var ano = date.getFullYear();
		var presente = false;				

		for(var j = 0; j < $scope.anos.length; j++){		
			if ($scope.anos[j] == ano) {
				presente = true;						
			};			
		}

		if (presente == false) {
			$scope.anos.push(ano);			
		}
	}		

	$scope.data = [compra, nascimento, emprestimo, outros];

	$scope.anos.sort();

	$scope.labelsCompra = $scope.anos;	

	$scope.dataCompra = [];	

	$scope.compraAno = function(ano){
		var quantCompra = 0;
		for(var i = 0; i < $rootScope.animaisPorEntrada.length; i++){
			var date = new Date($rootScope.animaisPorEntrada[i].dataEntrada);
			var anoEntrada = date.getFullYear();

			if (ano == anoEntrada) {
				if ($rootScope.animaisPorEntrada[i].motivoEntrada == 'Compra') {
					quantCompra++;
				}
			}
		}
		return quantCompra;
	};

	for(var i = 0; i < $scope.anos.length; i++){		
		$scope.dataCompra.push($scope.compraAno($scope.anos[i]));	
	}

	$scope.nascimentoAno = function(ano){
		var quantNascimento = 0;
		for(var i = 0; i < $rootScope.animaisPorEntrada.length; i++){
			var date = new Date($rootScope.animaisPorEntrada[i].dataEntrada);
			var anoEntrada = date.getFullYear();

			if (ano == anoEntrada) {
				if ($rootScope.animaisPorEntrada[i].motivoEntrada == 'Nascimento') {
					quantNascimento++;
				}
			}
		}
		return quantNascimento;
	};

	$scope.emprestimoAno = function(ano){
		var quantEmprestimo = 0;
		for(var i = 0; i < $rootScope.animaisPorEntrada.length; i++){
			var date = new Date($rootScope.animaisPorEntrada[i].dataEntrada);
			var anoEntrada = date.getFullYear();

			if (ano == anoEntrada) {
				if ($rootScope.animaisPorEntrada[i].motivoEntrada == 'Emprestimo') {
					quantEmprestimo++;
				}
			}
		}
		return quantEmprestimo;
	};

	$scope.outrosAno = function(ano){
		var quantOutros = 0;
		for(var i = 0; i < $rootScope.animaisPorEntrada.length; i++){
			var date = new Date($rootScope.animaisPorEntrada[i].dataEntrada);
			var anoEntrada = date.getFullYear();

			if (ano == anoEntrada) {
				if ($rootScope.animaisPorEntrada[i].motivoEntrada == 'Outros') {
					quantOutros++;
				}
			}
		}
		return quantOutros;
	};


	$scope.voltar = function(){
		$state.go('opcoes.relatorios');
	};

}])