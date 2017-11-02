angular.module('app.controllers')

.controller('relMovimentacaoCtrl', ['$scope', '$stateParams', '$ionicLoading', 'CaprioviService', '$state', '$rootScope'
, '$ionicPopup', 'CaprioviFactory',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $ionicLoading, CaprioviService, $state, $rootScope, $ionicPopup, CaprioviFactory) {	

	$scope.vazio = false;
	if ($rootScope.relMovimentacoes.length == 0) {
		$scope.vazio = true;
	};
	$scope.anos = [];
	var venda = 0, morte = 0, roubo = 0, alimentacao = 0, emprestimo = 0, outros = 0;
	$scope.labels = ["Venda","Morte","Roubo","Alimentação","Emprestimo","Outros"];		

	for(var i = 0; i < $rootScope.relMovimentacoes.length; i++){		

		if ($rootScope.relMovimentacoes[i].motivoSaida == 'MOTIVO_VENDA') {
			venda++;
		}else if($rootScope.relMovimentacoes[i].motivoSaida == 'MOTIVO_MORTE'){
			morte++;
		}else if($rootScope.relMovimentacoes[i].motivoSaida == 'MOTIVO_ROUBO'){
			roubo++;
		}else if($rootScope.relMovimentacoes[i].motivoSaida == 'MOTIVO_ALIMENTACAO'){
			alimentacao++;
		}else if($rootScope.relMovimentacoes[i].motivoSaida == 'MOTIVO_EMPRESTIMO'){
			emprestimo++;
		}else if($rootScope.relMovimentacoes[i].motivoSaida == 'MOTIVO_OUTROS'){
			outros++;
		}

		var date = new Date($rootScope.relMovimentacoes[i].data);
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

	$scope.data = [venda, morte, roubo, alimentacao, emprestimo, outros];

	$scope.anos.sort();

	$scope.labelsMorte = $scope.anos;	

	$scope.dataMorte = [];	

	$scope.vendaAno = function(ano){
		var quantVenda = 0;
		for(var i = 0; i < $rootScope.relMovimentacoes.length; i++){
			var date = new Date($rootScope.relMovimentacoes[i].data);
			var anoSaida = date.getFullYear();

			if (ano == anoSaida) {
				if ($rootScope.relMovimentacoes[i].motivoSaida == 'MOTIVO_VENDA') {
					quantVenda++;
				}
			}
		}
		return quantVenda;
	};

	$scope.morteAno = function(ano){
		var quantMorte = 0;
		for(var i = 0; i < $rootScope.relMovimentacoes.length; i++){
			var date = new Date($rootScope.relMovimentacoes[i].data);
			var anoSaida = date.getFullYear();

			if (ano == anoSaida) {
				if ($rootScope.relMovimentacoes[i].motivoSaida == 'MOTIVO_MORTE') {
					quantMorte++;
				}
			}
		}
		return quantMorte;
	};

	for(var i = 0; i < $scope.anos.length; i++){		
		$scope.dataMorte.push($scope.morteAno($scope.anos[i]));	
	}

	$scope.rouboAno = function(ano){
		var quantRoubo = 0;
		for(var i = 0; i < $rootScope.relMovimentacoes.length; i++){
			var date = new Date($rootScope.relMovimentacoes[i].data);
			var anoSaida = date.getFullYear();

			if (ano == anoSaida) {
				if ($rootScope.relMovimentacoes[i].motivoSaida == 'MOTIVO_ROUBO') {
					quantRoubo++;
				}	
			}
		}
		return quantRoubo;
	};

	$scope.alimentacaoAno = function(ano){
		var quantAlimentacao = 0;
		for(var i = 0; i < $rootScope.relMovimentacoes.length; i++){
			var date = new Date($rootScope.relMovimentacoes[i].data);
			var anoEntrada = date.getFullYear();

			if (ano == anoEntrada) {
				if ($rootScope.relMovimentacoes[i].motivoSaida == 'MOTIVO_ALIMENTACAO') {
					quantAlimentacao++;
				}
			}
		}
		return quantAlimentacao;
	};

	$scope.emprestimoAno = function(ano){
		var quantEmprestimo = 0;
		for(var i = 0; i < $rootScope.relMovimentacoes.length; i++){
			var date = new Date($rootScope.relMovimentacoes[i].data);
			var anoEntrada = date.getFullYear();

			if (ano == anoEntrada) {
				if ($rootScope.relMovimentacoes[i].motivoSaida == 'MOTIVO_EMPRESTIMO') {
					quantEmprestimo++;
				}
			}
		}
		return quantEmprestimo;
	};

	$scope.outrosAno = function(ano){
		var quantOutros = 0;
		for(var i = 0; i < $rootScope.relMovimentacoes.length; i++){
			var date = new Date($rootScope.relMovimentacoes[i].data);
			var anoEntrada = date.getFullYear();

			if (ano == anoEntrada) {
				if ($rootScope.relMovimentacoes[i].motivoSaida == 'MOTIVO_OUTROS') {
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