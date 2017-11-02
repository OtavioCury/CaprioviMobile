angular.module('app.controllers')

.controller('cadastrosCtrl', ['$scope', '$stateParams','$ionicLoading','CaprioviService','$state',
'$rootScope', '$ionicPopup',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $ionicLoading, CaprioviService, $state, $rootScope, $ionicPopup) {

	var ids = [];

	//mostra um modal na tela do aplicativo
	$scope.modal = function(title, template){
		var alertPopup = $ionicPopup.alert({
     		title: title,
     		template: template
   		});   		
	};		

	$scope.idsFazendas = function(){
		if ($rootScope.usuario.permissao == 'ROLE_PECUARISTA') {		
			for(var i = 0; i < $rootScope.fazendas.length; i++){		
				ids.push($rootScope.fazendas[i].id);			
			}
		}else{
			ids.push($rootScope.usuario.fazenda.id);
		}		
	};

	/* LOADING FUNCTION */
	$scope.showLoading = function() {
		$ionicLoading.show()
	};
	$scope.hideLoading = function(){
		$ionicLoading.hide();
	};		

	$scope.redirecionamentoAnimal = function(){
		if ($rootScope.online == true) {
			$scope.idsFazendas();
			CaprioviService.getAnimais(ids)
			.then(function(response){
				$scope.hideLoading();
				if (response.status == 200) {
					$rootScope.animais = response.data;									
					$state.go('opcoes.animais');									
				}else if(response.status == -1){
					$scope.modal('Não foi possível carregar seus animais', 'Verfique sua conexão e tente novamente');
				}
			});
		}else{
			$scope.hideLoading();
			$state.go('opcoes.animais');
		}
	};

	$scope.redirecionamentoRebanho = function(){		
		if ($rootScope.online == true) {
			$scope.idsFazendas();		
			CaprioviService.getRebanhos(ids)
			.then(function(response){
				$scope.hideLoading();
				if (response.status == 200) {
					$rootScope.rebanhos = response.data;											
					$state.go('opcoes.rebanhos');									
				}else if(response.status == -1){
					$scope.modal('Não foi possível carregar seus rebanhos', 'Verfique sua conexão e tente novamente');
				}
			});
		}else{			
			$scope.hideLoading();
			$state.go('opcoes.rebanhos');									
		}		
	};

	/* Função que carrega as fazendas do usuário*/
	$scope.fazendas = function(){
  		$scope.showLoading();
  		if ($rootScope.online == true) {
  			CaprioviService.getFazendas($rootScope.usuario.id)
			.then(function(response){
				$scope.hideLoading();
				if (response.status == 200) {
					$rootScope.fazendas = response.data;
					$state.go('opcoes.fazendas');
				}else if(response.status == -1){
					$scope.modal('Não foi possível carregar suas fazendas', 'Verfique sua conexão e tente novamente');
				}
			}); 
  		}else{
  			$scope.hideLoading();
  			$state.go('opcoes.fazendas');
  		} 		
  		 	  					
  	};

	/* Função que carrega os rebanhos do usuário*/
	$scope.rebanhos = function(){
  		$scope.showLoading();
  		if ($rootScope.online == true) {	
	  		if ($rootScope.usuario.permissao == 'ROLE_PECUARISTA') {
	  			CaprioviService.getFazendas($rootScope.usuario.id)
				.then(function(response){	
					if (response.status == 200) {		
						$rootScope.fazendas = response.data;		
						$scope.redirecionamentoRebanho();
					}else if(response.status == -1){
						$scope.hideLoading();
						$scope.modal('Não foi possível carregar seus rebanhos', 'Verfique sua conexão e tente novamente');
					}		
				});
	  		}else{
	  			$scope.redirecionamentoRebanho();
	  		}
	  	}else{
  			$scope.hideLoading();
  			$state.go('opcoes.rebanhos');
  		} 					
  	};

  	/* Função que carrega os animais do usuário*/
	$scope.animais = function(){
  		$scope.showLoading();
  		if ($rootScope.online == true) {
	  		if ($rootScope.usuario.permissao == 'ROLE_PECUARISTA'){
	  			CaprioviService.getFazendas($rootScope.usuario.id)
				.then(function(response){
					if (response.status == 200) {	
						$rootScope.fazendas = response.data;		
						$scope.redirecionamentoAnimal();
					}else if(response.status == -1){
						$scope.hideLoading();
						$scope.modal('Não foi possível carregar seus animais', 'Verfique sua conexão e tente novamente');
					}			
				});
	  		}else{
	  			$scope.redirecionamentoAnimal();
	  		}
	  	}else{
  			$scope.hideLoading();
  			$state.go('opcoes.animais');
  		} 

  	};

	/* Função que carrega as raças do usuário*/
	$scope.racas = function(){
  		$scope.showLoading();

  		if ($rootScope.online == true) {
  			$scope.usuarioMetodo = {};
	  		if ($rootScope.usuario.permissao == 'ROLE_PECUARISTA') {
	  			$scope.usuarioMetodo = $rootScope.usuario;
	  		}else{
	  			$scope.usuarioMetodo = $rootScope.usuario.fazenda.pecuarista; 
	  		}  
			CaprioviService.getRacas($scope.usuarioMetodo.id)
			.then(function(response){
				if (response.status == 200) {
					$scope.hideLoading();								
					$rootScope.racas = response.data;	
					$state.go('opcoes.racas');
				}else if(response.status == -1){
					$scope.hideLoading();
					$scope.modal('Não foi possível carregar as raças cadastradas', 'Verfique sua conexão e tente novamente');
				}																		
			});
  		}else{
  			$scope.hideLoading();
  			$state.go('opcoes.racas');
  		}
	};

	/* Função que carrega as raças do usuário*/
	$scope.medicamentos = function(){
  		$scope.showLoading();

  		if ($rootScope.online == true) {
  			$scope.usuarioMetodo = {};
	  		if ($rootScope.usuario.permissao == 'ROLE_PECUARISTA') {
	  			$scope.usuarioMetodo = $rootScope.usuario;
	  		}else{
	  			$scope.usuarioMetodo = $rootScope.usuario.fazenda.pecuarista; 
	  		}  
			CaprioviService.getMedicamento($scope.usuarioMetodo.id)
			.then(function(response){
				if (response.status == 200) {
					$scope.hideLoading();								
					$rootScope.medicamentos = response.data;	
					$state.go('opcoes.medicamentos');
				}else if(response.status == -1){
					$scope.hideLoading();
					$scope.modal('Não foi possível carregar os medicamentos cadastrados', 'Verfique sua conexão e tente novamente');
				}																				
			});
  		}else{
  			$scope.hideLoading();
  			$state.go('opcoes.medicamentos');
  		}
	};

	/* Função que carrega as doenças do usuário*/
	$scope.doencas = function(){
  		$scope.showLoading();

  		if ($rootScope.online == true) {
  			$scope.usuarioMetodo = {};
	  		if ($rootScope.usuario.permissao == 'ROLE_PECUARISTA') {
	  			$scope.usuarioMetodo = $rootScope.usuario;
	  		}else{
	  			$scope.usuarioMetodo = $rootScope.usuario.fazenda.pecuarista; 
	  		}  
			CaprioviService.getDoenca($scope.usuarioMetodo.id)
			.then(function(response){
				if (response.status == 200) {
					$scope.hideLoading();							
					$rootScope.doencas = response.data;	
					$state.go('opcoes.doencas');
				}else if(response.status == -1){
					$scope.hideLoading();
					$scope.modal('Não foi possível carregar os medicamentos cadastrados', 'Verfique sua conexão e tente novamente');
				}
			});
  		}else{
  			$scope.hideLoading();
  			$state.go('opcoes.doencas');
  		}
	};

}])