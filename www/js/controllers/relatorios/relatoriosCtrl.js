angular.module('app.controllers')

.controller('relatoriosCtrl', ['$scope', '$stateParams', '$ionicLoading', 'CaprioviService', '$state', '$rootScope'
, '$ionicPopup', 'CaprioviFactory', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $ionicLoading, CaprioviService, $state, $rootScope, $ionicPopup, CaprioviFactory) {

	var ids = [];			

	//coloca os ids das fazendas no array Ids
	$scope.idsFazendas = function(){
		if ($rootScope.usuario.permissao == 'ROLE_PECUARISTA') {		
			for(var i = 0; i < $rootScope.fazendas.length; i++){		
				ids.push($rootScope.fazendas[i].id);				
			}
		}else{
			ids.push($rootScope.usuario.fazenda.id);
		}		
	};

	//mostra um aviso na tela do aplicativo
	$scope.modal = function(title, template){
		var alertPopup = $ionicPopup.alert({
     		title: title,
     		template: template
   		});   		
	};

	/* LOADING FUNCTION */
	$scope.showLoading = function() {
		$ionicLoading.show()
	};
	$scope.hideLoading = function(){
		$ionicLoading.hide();
	};

	//carrega os rebanhos do usuário
	$scope.carregaRebanhos = function(){
		$scope.idsFazendas();
		CaprioviService.getRebanhos(ids)
		.then(function(response){			
			$scope.hideLoading();
			if (response.status == 200) {
				$rootScope.rebanhos = response.data;
				if ($rootScope.rebanhos.length == 0) {
					$scope.modal("Cadastre seus rebanhos",
							"Você ainda não possui nenhum rebanho cadastrado no sistema! Cadastre seus rebanhos para gerar relatórios");
				}else{
					$state.go('rebanhoRelatorio');
				}
			}else if(response.status == -1){
				$scope.hideLoading();
				$scope.modal('Não foi possível carregar seus dados', 'Verfique sua conexão e tente novamente');
			}																		
		});	
		
	};


	$scope.carregaRebanhosGanho = function(){
		$scope.idsFazendas();
		CaprioviService.getRebanhos(ids)
		.then(function(response){			
			$scope.hideLoading();
			if (response.status == 200) {
				$rootScope.rebanhos = response.data;
				if ($rootScope.rebanhos.length == 0) {
					$scope.modal("Cadastre seus rebanhos",
							"Você ainda não possui nenhum rebanho cadastrado no sistema! Cadastre seus rebanhos para gerar relatórios");
				}else{
					$state.go('rebanhoRelatorioGanho');
				}
			}else if(response.status == -1){
				$scope.hideLoading();
				$scope.modal('Não foi possível carregar seus dados', 'Verfique sua conexão e tente novamente');
			}																		
		});
	};

	//carrega as fazendas do usuário
	$scope.carregaFazendas = function(){		
		if ($rootScope.usuario.permissao == 'ROLE_PECUARISTA') {
			CaprioviService.getFazendas($rootScope.usuario.id)
			.then(function(response){
				if (response.status == 200) {
					$rootScope.fazendas = response.data;
					if ($rootScope.fazendas.length == 0) {
						$scope.modal("Cadastre suas fazendas",
							"Você ainda não possui nenhuma fazenda cadastrada no sistema! Cadastre suas fazendas e rebanhos para gerar relatórios");
					}else{
						$scope.carregaRebanhos();				
					}
				}else if(response.status == -1){
					$scope.hideLoading();
					$scope.modal('Não foi possível carregar seus dados', 'Verfique sua conexão e tente novamente');
				}			
			});
		}else{
			$scope.carregaRebanhos();
		}
	};

	//carrega as fazendas do usuário
	$scope.carregaFazendasGanho = function(){		
		if ($rootScope.usuario.permissao == 'ROLE_PECUARISTA') {
			CaprioviService.getFazendas($rootScope.usuario.id)
			.then(function(response){
				if (response.status == 200) {
					$rootScope.fazendas = response.data;
					if ($rootScope.fazendas.length == 0) {
						$scope.modal("Cadastre suas fazendas",
							"Você ainda não possui nenhuma fazenda cadastrada no sistema! Cadastre suas fazendas e rebanhos para gerar relatórios");
					}else{
						$scope.carregaRebanhosGanho();				
					}
				}else if(response.status == -1){
					$scope.hideLoading();
					$scope.modal('Não foi possível carregar seus dados', 'Verfique sua conexão e tente novamente');
				}			
			});
		}else{
			$scope.carregaRebanhosGanho();
		}
	};

	$scope.relatorioAnimaisPorEntrada = function(){
		if ($rootScope.online == true) {
			$rootScope.relatorio = "AnimaisPorEntrada";
			$scope.showLoading();
			$scope.carregaFazendas();
		}else{
			$scope.modal("Sem conexão","Você precisa de uma conexão com a internet para gerar relatórios!");
		}		
	};

	$scope.relatorioVermifugacao = function(){
		if ($rootScope.online == true) {
			$rootScope.relatorio = "Vermifugacao";
			$scope.showLoading();
			$scope.carregaFazendas();		
		}else{
			$scope.modal("Sem conexão","Você precisa de uma conexão com a internet para gerar relatórios!");
		}
	};

	$scope.relatorioMovimentacaoAnimal = function(){
		if ($rootScope.online == true) {
			$rootScope.relatorio = "MovimentacaoAnimal";
			$scope.showLoading();
			$scope.carregaFazendas();
		}else{
			$scope.modal("Sem conexão","Você precisa de uma conexão com a internet para gerar relatórios!");	
		}		
	};

	$scope.relatorioNumeroCrias = function(){
		if ($rootScope.online == true) {
			$rootScope.relatorio = "NumeroCrias";
			$scope.showLoading();
			$scope.carregaFazendas();		
		}else{
			$scope.modal("Sem conexão","Você precisa de uma conexão com a internet para gerar relatórios!");	
		}
	};

	$scope.relatorioOcorrenciasClinicas = function(){
		if ($rootScope.online == true) {
			$rootScope.relatorio = "OcorrenciasClinicas";
			$scope.showLoading();
			$scope.carregaFazendas();		
		}else{
			$scope.modal("Sem conexão","Você precisa de uma conexão com a internet para gerar relatórios!");		
		}
	};

	$scope.relatorioControleParasitario = function(){
		if ($rootScope.online == true) {
			$rootScope.relatorio = "ControleParasitario";
			$scope.showLoading();
			$scope.carregaFazendas();		
		}else{
			$scope.modal("Sem conexão","Você precisa de uma conexão com a internet para gerar relatórios!");		
		}
	};

	$scope.relatorioPrevisaoPartos = function(){
		if ($rootScope.online == true) {
			$rootScope.relatorio = "PrevisaoPartos";
			$scope.showLoading();
			$scope.carregaFazendas();		
		}else{
			$scope.modal("Sem conexão","Você precisa de uma conexão com a internet para gerar relatórios!");			
		}
	};

	$scope.relatorioCoberturaReprodutor = function(){
		if ($rootScope.online == true) {
			$rootScope.relatorio = "CoberturaReprodutor";
			$scope.showLoading();
			$scope.carregaFazendas();	
		}else{
			$scope.modal("Sem conexão","Você precisa de uma conexão com a internet para gerar relatórios!");				
		}	
	};

	$scope.relatorioFemeasIdadeReprodutiva = function(){
		if ($rootScope.online == true) {
			$rootScope.relatorio = "FemeasIdadeReprodutiva";
			$scope.showLoading();
			$scope.carregaFazendas();	
		}else{
			$scope.modal("Sem conexão","Você precisa de uma conexão com a internet para gerar relatórios!");				
		}	
	};

	$scope.relatorioTamanhoEfetivo = function(){
		if ($rootScope.online == true) {
			$rootScope.relatorio = "TamanhoEfetivo";
			$scope.showLoading();
			$scope.carregaFazendas();	
		}else{
			$scope.modal("Sem conexão","Você precisa de uma conexão com a internet para gerar relatórios!");				
		}	
	};

	$scope.relatorioPartos = function(){
		if ($rootScope.online == true) {
			$rootScope.relatorio = "Partos";
			$scope.showLoading();
			$scope.carregaFazendas();	
		}else{
			$scope.modal("Sem conexão","Você precisa de uma conexão com a internet para gerar relatórios!");				
		}	
	};

	$scope.relatorioGanhoGeneticoEsperado = function(){
		if ($rootScope.online == true) {
			$scope.showLoading();
			$scope.carregaFazendasGanho();	
		}else{
			$scope.modal("Sem conexão","Você precisa de uma conexão com a internet para gerar relatórios!");				
		}	
	};

	$scope.relatorioIntervaloGeracao = function(){
		if ($rootScope.online == true) {
			$rootScope.relatorio = "IntervaloGeracao";
			$scope.showLoading();
			$scope.carregaFazendas();	
		}else{
			$scope.modal("Sem conexão","Você precisa de uma conexão com a internet para gerar relatórios!");				
		}	
	};
}])