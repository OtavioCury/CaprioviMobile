angular.module('app.controllers')
     
.controller('loginCtrl', ['$scope', '$stateParams', 'CaprioviService','$state', '$ionicPopup', '$ionicLoading', 
'$rootScope', '$ionicSideMenuDelegate','LocalFactory', '$cordovaNetwork',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, CaprioviService, $state, $ionicPopup, $ionicLoading, 
	$rootScope, $ionicSideMenuDelegate, LocalFactory, $cordovaNetwork) {		

	$ionicSideMenuDelegate.canDragContent(false);

	if ($cordovaNetwork.getNetwork() == "none") {
		$rootScope.online = false;
	}else{
		$rootScope.online = true;
	}	

	//testa se o usuário já está logado no sistema
	if($rootScope.usuario != null){
		ionic.Platform.exitApp();
	}else if(LocalFactory.getUsuarioLocal().id != null){		
		$rootScope.usuario = LocalFactory.getUsuarioLocal();
		$ionicSideMenuDelegate.canDragContent(true);
		$state.go('opcoes.cadastros');
	}

	/* LOADING FUNCTION */
	$scope.showLoading = function() {
		$ionicLoading.show()
	};
	$scope.hideLoading = function(){
		$ionicLoading.hide();
	};

	$scope.modal = function(title, template){
		var alertPopup = $ionicPopup.alert({
     		title: title,
     		template: template
   		});   		
	}

	$scope.site = function(){
		$scope.modal('Capriovi web', 'Cadastre-se: www.capriovi.com.br');
	};	

	/* Função que realiza o login do usuário*/
	$scope.login = function(usuario)	 {
  		$scope.showLoading();  		   		
  		if (usuario.nome == null || usuario.senha == null) {
  			$scope.modal('Login inválido', 'Preencha todos os campos do login!');
  			$scope.hideLoading();
  		}else{  	  			  			  			  		
			CaprioviService.getUsuario(usuario.nome, usuario.senha)
			.then(function(response){
				$scope.hideLoading();
				if (response.status == 200) { 
					$rootScope.usuario = response.data;	
					LocalFactory.setUsuarioLocal($rootScope.usuario);
					if ($rootScope.usuario.permissao == 'ROLE_PECUARISTA') {
						$rootScope.image = "https://www.gravatar.com/avatar/" + md5($rootScope.usuario.email);
					}
					$ionicSideMenuDelegate.canDragContent(true);																												
					$state.go('opcoes.cadastros');													
				}else if(response.status == 204){
					$scope.modal('Login inválido', 'Se você ainda não possui uma conta, cadastre-se');
				}else if(response.status == -1){					
					$scope.modal('Não foi possível realizar o login', 'Verfique sua conexão e tente novamente');
				}
			});
		}

  	}; 

  	/* Função que realiza o login do usuário*/
	$rootScope.logout = function(usuario)	 {

		var confirmPopup = $ionicPopup.confirm({
	   		title: 'Confirmação!',
	    
	    	template: 'Tem certeza que deseja sair? Todos os dados ainda não sincronizados serão perdidos!',
	     	cancelText: 'Não',
	        okText: 'Sim'
	   	});

	   	confirmPopup.then(function(res) {
	   		if(res) {
	   			delete $rootScope.usuario;
	   			delete $rootScope.fazendas;
	   			delete $rootScope.animais;
	   			delete $rootScope.doencas;
	   			delete $rootScope.medicamentos;
	   			delete $rootScope.racas;
	   			delete $rootScope.controles;
	   			delete $rootScope.manejos;
	   			delete $rootScope.ocorrencias;
	   			delete $rootScope.vacinacoes;
	   			delete $rootScope.movimentacoes;
	   			delete $rootScope.relatorio;
				LocalFactory.removeUsuarioLocal();
				LocalFactory.removeAll();
		     	$state.go('login');		  		
		  	}else{

		  	}
		});  		
	 };		 	  

}])
