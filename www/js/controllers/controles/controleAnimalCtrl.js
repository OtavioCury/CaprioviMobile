angular.module('app.controllers')

.controller('controleAnimalCtrl', ['$scope', '$stateParams', '$ionicLoading','CaprioviService','$state',
'$rootScope', '$ionicPopup',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $ionicLoading, CaprioviService, $state, $rootScope, $ionicPopup) {

	//mostra um modal na tela do aplicativo
	$scope.modal = function(title, template){
		var alertPopup = $ionicPopup.alert({
     		title: title,
     		template: template
   		});   		
	};

	//ids das fazendas
	var idsF = [];		

	//coloca os ids das fazendas no array IdsF
	$scope.idsFazendas = function(){
		if ($rootScope.usuario.permissao == 'ROLE_PECUARISTA') {		
		for(var i = 0; i < $rootScope.fazendas.length; i++){		
			idsF.push($rootScope.fazendas[i].id);			
		}
		}else{
			idsF.push($rootScope.usuario.fazenda.id);
		}		
	};	

	/* LOADING FUNCTION */
	$scope.showLoading = function() {
		$ionicLoading.show()
	};
	$scope.hideLoading = function(){
		$ionicLoading.hide();
	};

	//redireciona para a página de listagem de manejos
	$scope.manejosRedirecionamento = function(){
		$scope.idsFazendas();							
		CaprioviService.getManejos(idsF)
		.then(function(response){
			$scope.hideLoading();
			if (response.status == 200) {										
				$rootScope.manejos = response.data;					
				$state.go('opcoes.manejos');
			}else if(response.status == -1){
				$scope.modal('Não foi possível carregar os manejos cadastrados', 'Verfique sua conexão e tente novamente');
			}
		});	
	};

	//redireciona para a página de listagem de movimentações
	$scope.movimentacoesRedirecionamento = function(){
		$scope.idsFazendas();							
		CaprioviService.getMovimentacao(idsF)
		.then(function(response){
			$scope.hideLoading();
			if (response.status == 200) {										
				$rootScope.movimentacoes = response.data;					
				$state.go('opcoes.movimentacoes');
			}else if(response.status == -1){
				$scope.modal('Não foi possível carregar as movimentação cadastradas', 'Verfique sua conexão e tente novamente');
			}
		});	
	};

	//redireciona para a página de listagem de controles
	$scope.controlesRedirecionamento = function(){
		$scope.idsFazendas();							
		CaprioviService.getControle(idsF)
		.then(function(response){
			$scope.hideLoading();
			if (response.status == 200) {						
				$rootScope.controles = response.data;							
				$state.go('opcoes.controles');
			}else if(response.status == -1){
				$scope.modal('Não foi possível carregar os controles cadastrados', 'Verfique sua conexão e tente novamente');
			}
		});	
	};

	//redireciona para a página de listagem de ocorrências
	$scope.ocorrenciasRedirecionamento = function(){
		$scope.idsFazendas();							
		CaprioviService.getOcorrencia(idsF)
		.then(function(response){
			$scope.hideLoading();
			if (response.status == 200) {						
				$rootScope.ocorrencias = response.data;					
				$state.go('opcoes.ocorrencias');
			}else if(response.status == -1){
				$scope.modal('Não foi possível carregar as ocorrências cadastradas', 'Verfique sua conexão e tente novamente');
			}
		});	
	};

	/* Função que carrega os manejos do usuário*/
	$scope.manejos = function(){

		$scope.showLoading();    		
		if ($rootScope.online == true) {
			if ($rootScope.usuario.permissao == 'ROLE_PECUARISTA') {
		  		CaprioviService.getFazendas($rootScope.usuario.id)
				.then(function(response){
					if (response.status == 200) {	
						$rootScope.fazendas = response.data;
						$scope.manejosRedirecionamento();
					}else if(response.status == -1){
						$scope.hideLoading();
						$scope.modal('Não foi possível carregar os manejos cadastrados', 'Verfique sua conexão e tente novamente');
					}						
				}); 
			}else{
				$scope.manejosRedirecionamento();
			}	
		}else{
			$scope.hideLoading();
			$state.go('opcoes.manejos');
		}
		 		
	};

	/* Função que carrega as movimentações do usuário*/
	$scope.movimentacoes = function(){

		$scope.showLoading();
		if ($rootScope.online == true) {    		
			if ($rootScope.usuario.permissao == 'ROLE_PECUARISTA') {
		  		CaprioviService.getFazendas($rootScope.usuario.id)
				.then(function(response){			
					if (response.status == 200) {
						$rootScope.fazendas = response.data;
						$scope.movimentacoesRedirecionamento();								
					}else if(response.status == -1){
						$scope.hideLoading();
						$scope.modal('Não foi possível carregar as movimentações cadastradas', 'Verfique sua conexão e tente novamente');
					}
				});
			}else{
				$scope.movimentacoesRedirecionamento();
			}
		}else{
			$scope.hideLoading();
			$state.go('opcoes.movimentacoes');	
		}  		
	};

	/* Função que carrega os controles do usuário*/
	$scope.controles = function(){

		$scope.showLoading();
		if ($rootScope.online == true) {    		
			if ($rootScope.usuario.permissao == 'ROLE_PECUARISTA') {
		  		CaprioviService.getFazendas($rootScope.usuario.id)
				.then(function(response){	
					if (response.status == 200) {		
						$rootScope.fazendas = response.data;
						$scope.controlesRedirecionamento();
					}else if(response.status == -1){
						$scope.hideLoading();
						$scope.modal('Não foi possível carregar os controles cadastrados', 'Verfique sua conexão e tente novamente');
					}							
				});
			}else{
				$scope.controlesRedirecionamento();
			}
		}else{
			$scope.hideLoading();
			$state.go('opcoes.controles');
		}
	};

	/* Função que carrega as ocorrências do usuário*/
	$scope.ocorrencias = function(){

		$scope.showLoading();
		if ($rootScope.online == true) {    		
			if ($rootScope.usuario.permissao == 'ROLE_PECUARISTA') {
		  		CaprioviService.getFazendas($rootScope.usuario.id)
				.then(function(response){
					if (response.status == 200) {		
						$rootScope.fazendas = response.data;
						$scope.ocorrenciasRedirecionamento();								
					}else if(response.status == -1){
						$scope.hideLoading();
						$scope.modal('Não foi possível carregar as ocorrências cadastradas', 'Verfique sua conexão e tente novamente');
					}
				});
			}else{
				$scope.ocorrenciasRedirecionamento();
			}
		}else{
			$scope.hideLoading();
			$state.go('opcoes.ocorrencias');
		}
	};

	/* Função que carrega as vacinações do usuário*/
	$scope.vacinacoes = function(){

		$scope.showLoading();    						
		if ($rootScope.online == true) {
			var id;
			if ($rootScope.usuario.permissao == 'ROLE_PECUARISTA') {
				id = $rootScope.usuario.id;
			} else{
				id = $rootScope.usuario.fazenda.pecuarista.id;
			};
			
		  	CaprioviService.getVacinacao(id)
			.then(function(response){
				$scope.hideLoading();
				if (response.status == 200) {			
					$rootScope.vacinacoes = response.data;
					$state.go('opcoes.vacinacoes');
				}else if(response.status == -1){
					$scope.hideLoading();
					$scope.modal('Não foi possível carregar as vacinações cadastradas', 'Verfique sua conexão e tente novamente');
				}							
			});
		}else{
			$scope.hideLoading();
			$state.go('opcoes.vacinacoes');
		}	
	};

}])