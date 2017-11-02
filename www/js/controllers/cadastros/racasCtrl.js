angular.module('app.controllers')

.controller('racasCtrl', ['$scope', '$stateParams', '$ionicLoading','CaprioviService','$state',
'$rootScope', '$ionicPopup', 'CaprioviFactory', 'LocalFactory','$timeout',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $ionicLoading, CaprioviService, $state, $rootScope, $ionicPopup, CaprioviFactory, LocalFactory, $timeout) {

	$rootScope.racasLocais = LocalFactory.getRacasLocal();
	$scope.vazio = false;
	if ($rootScope.racasLocais.length == 0) {
		$scope.vazio = true;
	};
	$scope.sincronismoSucesso = false;
	var showLoadingMensage;

	/* LOADING FUNCTION */
	$scope.showLoading = function() {
		$ionicLoading.show()
	};
	$scope.hideLoading = function(){
		$ionicLoading.hide();
	};

	$scope.mensagemSincronismo = function(){
		$scope.sincronismoSucesso = true;
		$timeout(function() {
			$scope.sincronismoSucesso = false;
		}, 5000);
	};

	$scope.testaVazio = function(){
		$rootScope.racasLocais = LocalFactory.getRacasLocal();
		$scope.vazio = false;
		if ($rootScope.racasLocais.length == 0) {
			$scope.vazio = true;
		};
	};

	//adiciona uma raça
	$scope.adicionar = function(){				
		CaprioviFactory.setRaca(null);		
		$state.go('cadastroRaca');
	};

	//atualiza uma raça
	$scope.atualizar = function(raca){		
		CaprioviFactory.setRaca(raca);					
		$state.go('cadastroRaca');
	};

	$scope.modal = function(title, template){
		var alertPopup = $ionicPopup.alert({
     		title: title,
     		template: template
   		});   		
	}

	//mostra um caixa de mensagem na tela do aplicativo
	$scope.sincronizando = function(title, template){
		showLoadingMensage = $ionicPopup.show({
     		title: title,
     		template: template
   		});   		
	}

	$scope.listagem = function(){
		if ($rootScope.usuario.permissao == 'ROLE_PECUARISTA') {
			CaprioviService.getRacas($rootScope.usuario.id)
			.then(function(response){
				$scope.hideLoading();
				if (response.data != null) {									
					$rootScope.racas = response.data;	
					$state.go('opcoes.racas');																				
				}
			});
		}else{
			CaprioviService.getRacas($rootScope.usuario.fazenda.pecuarista.id)
			.then(function(response){
				$scope.hideLoading();
				if (response.data != null) {				
					$rootScope.racas = response.data;																
					$state.go('opcoes.racas');
				}
			});
		}
	};

	//atualiza a listagem das raças
	$scope.atualizarList = function(){
		$scope.showLoading();
		$scope.listagem();
		$scope.$broadcast('scroll.refreshComplete');
	};	

	//deleta uma raça
	$scope.deletar = function(raca){
		var confirmPopup = $ionicPopup.confirm({
     		title: 'Você tem certeza que deseja deletar essa raça?',
     		template: 'Ao deletar essa raça, todas as informações ligadas à ela serão também deletadas',
     		cancelText: 'Cancelar',
        	okText: 'Deletar'
   		});

   		confirmPopup.then(function(res) {
     		if(res) {       			
       			$scope.showLoading();  		
				CaprioviService.deleteRaca(raca.id)
				.then(function(response){
					if (response.status == 200) {						
						$scope.listagem();
					}else{
						$scope.hideLoading();
						$scope.modal('Não foi possível deletar esta raça!', 'Tente novamente.');
					}		
				});		
     		} else {
	       		
    	 	}
   		});
	};

	//deleta uma raça armazenada localmente
	$scope.deletarLocal = function(raca){
		var confirmPopup = $ionicPopup.confirm({
     		title: 'Você tem certeza que deseja deletar essa raça?',
     		template: 'Ao deletar essa raca, todos os dados ligados à ela serão deletados também',
	     	cancelText: 'Cancelar',
        	okText: 'Deletar'		
   		});
   		confirmPopup.then(function(res) {
     		if(res) {       			
       			$scope.showLoading();
				LocalFactory.removeRacaLocal(raca);
				$rootScope.racasLocais = LocalFactory.getRacasLocal();
				$scope.testaVazio();
				$scope.hideLoading();		
     		} else {
	       		
    	 	}
   		});		
	};

	//faz o upload de uma raça para o servidor
	$scope.atualizarServidor = function(raca){
		if ($rootScope.online == true) {
			$scope.sincronizando("Sincronizando",'<div align = "center"><img src = "img/gif.gif"></div>');
			if ($rootScope.usuario.permissao == 'ROLE_PECUARISTA') {
				raca.usuario = $rootScope.usuario;
			}else{
				raca.usuario = $rootScope.usuario.fazenda.pecuarista;
			}
			CaprioviService.postRaca(raca)
			.then(function(response){				
				if(response.status == 200){
					LocalFactory.removeRacaLocal(raca);
					$scope.testaVazio();
					showLoadingMensage.close();
					$scope.listagem();
					$scope.mensagemSincronismo();		
				}else{
					showLoadingMensage.close();	
					$scope.modal('Erro ao sincronizar seus dados', 'Tente novamente!');					
					return;
				}
			});
			
		}else{			
			$scope.modal("Sem conexão","Você não possui conexão com a internet para sincronizar seus dados com o servidor!");
		}
	};

}])

.controller('cadastroRacaCtrl', ['$scope', '$stateParams', '$ionicLoading','CaprioviService','$state',
'$rootScope', '$ionicPopup', 'CaprioviFactory', 'LocalFactory',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $ionicLoading, CaprioviService, $state, $rootScope, $ionicPopup, CaprioviFactory, LocalFactory) {

	var adicionar;		

	if (CaprioviFactory.getRaca() == null) {
		adicionar = true;
	}else{
		adicionar = false;		
		$scope.raca = CaprioviFactory.getRaca();						

		if ($scope.raca.criacao == 'CRIACAO_CAPRINO') {
			$scope.raca.criacao = "Caprinos";
		}else if($scope.raca.criacao == 'CRIACAO_OVINO'){
			$scope.raca.criacao = "Ovinos";
		}else if($scope.raca.criacao == 'CRIACAO_AMBOS'){
			$scope.raca.criacao = "Ambos";
		}
	}

	$scope.modal = function(title, template){
		var alertPopup = $ionicPopup.alert({
     		title: title,
     		template: template
   		});   		
	}

	$scope.redirecionaRaca = function(){
		if ($rootScope.online == true) {
			var usuarioM = {};
			if ($rootScope.usuario.permissao == 'ROLE_PECUARISTA') {
				usuarioM = $rootScope.usuario;
			}else{
				usuarioM = $rootScope.usuario.fazenda.pecuarista;
			}	
			CaprioviService.getRacas(usuarioM.id)
			.then(function(response){
				$scope.hideLoading();
				if (response.data != null) {									
					$rootScope.racas = response.data;	
					$state.go('opcoes.racas');																				
				}
			});
		}else{
			$scope.hideLoading();
			$state.go('opcoes.racas');
		}
	};

	/* LOADING FUNCTION */
	$scope.showLoading = function() {
		$ionicLoading.show()
	};
	$scope.hideLoading = function(){
		$ionicLoading.hide();
	};

  	$scope.cancelar = function(){		
  		$scope.showLoading(); 
  		$scope.redirecionaRaca();  				
  	};		  	

  	$scope.cadastrar = function (raca){  	  			

		$scope.showLoading();

		if (raca.criacao == "Caprinos") {
			raca.criacao = 1;
		}else if(raca.criacao == "Ovinos"){
			raca.criacao = 2;
		}else if(raca.criacao == "Ambos"){
			raca.criacao = 3;
		}

  		if(adicionar == true){  
  			if ($rootScope.usuario.permissao == 'ROLE_PECUARISTA') {
				raca.usuario = $rootScope.usuario;
			}else{
				raca.usuario = $rootScope.usuario.fazenda.pecuarista;
			}
  			if ($rootScope.online == true) {
				CaprioviService.postRaca(raca)
				.then(function(response){
					if(response.status == 200){
						$scope.redirecionaRaca();
					}else{
						$scope.hideLoading();
						$scope.modal('Erro ao cadastrar raça', 'Tente novamente!');					
						return;
					}
				});
  			}else{
  				LocalFactory.addRacaLocal(raca);
				$scope.hideLoading();										
				$state.go('opcoes.racas');
  			}
  		}else{  		
  			if ($rootScope.online == true) {
	  			CaprioviService.updateRaca(raca)
				.then(function(response){
					if(response.status == 200){
						$scope.redirecionaRaca();
					}else{
						$scope.hideLoading();
						$scope.modal('Erro ao atualizar raça', 'Tente novamente!');					
						return;
					}
				});
			}else{
				for(var i = 0; i < LocalFactory.getRacasLocal().length; i++){
					if (LocalFactory.getRacasLocal()[i] == CaprioviFactory.getRaca()) {
						LocalFactory.getRacasLocal()[i] = raca;
						$scope.hideLoading();
						$state.go('opcoes.racas');
					}							
				}
			}
  		}	

	}
}])