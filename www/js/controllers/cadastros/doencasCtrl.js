angular.module('app.controllers')

.controller('doencasCtrl', ['$scope', '$stateParams', '$ionicLoading','CaprioviService','$state',
'$rootScope', '$ionicPopup', 'CaprioviFactory', 'LocalFactory','$timeout',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $ionicLoading, CaprioviService, $state, $rootScope, $ionicPopup, CaprioviFactory, LocalFactory, $timeout) {

	$rootScope.doencasLocais = LocalFactory.getDoencasLocal();
	$scope.vazio = false;
	if ($rootScope.doencasLocais.length == 0) {
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
		$rootScope.doencasLocais = LocalFactory.getDoencasLocal();
		$scope.vazio = false;
		if ($rootScope.doencasLocais.length == 0) {
			$scope.vazio = true;
		};
	};

	//adiciona uma raça
	$scope.adicionar = function(){				
		CaprioviFactory.setDoenca(null);		
		$state.go('cadastroDoenca');
	};

	//atualiza uma doença
	$scope.atualizar = function(doenca){		
		CaprioviFactory.setDoenca(doenca);					
		$state.go('cadastroDoenca');
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
			CaprioviService.getDoenca($rootScope.usuario.id)
			.then(function(response){
				$scope.hideLoading();
				if (response.data != null) {									
					$rootScope.doencas = response.data;	
					$state.go('opcoes.doencas');																				
				}
			});
		}else{
			CaprioviService.getDoenca($rootScope.usuario.fazenda.pecuarista.id)
			.then(function(response){
				$scope.hideLoading();
				if (response.data != null) {				
					$rootScope.doencas = response.data;																
					$state.go('opcoes.doencas');
				}
			});
		}
	};

	//atualiza a listagem das doenças
	$scope.atualizarList = function(){
		$scope.showLoading();
		$scope.listagem();
		$scope.$broadcast('scroll.refreshComplete');
	};	

	//deleta uma doença
	$scope.deletar = function(doenca){
		var confirmPopup = $ionicPopup.confirm({
     		title: 'Você tem certeza que deseja deletar esta doença?',
     		template: 'Ao deletar esta doença, todas as informações ligadas à ela serão deletadas também',
     		cancelText: 'Cancelar',
        	okText: 'Deletar'
   		});

   		confirmPopup.then(function(res) {
     		if(res) {       			
       			$scope.showLoading();  		
				CaprioviService.deleteDoenca(doenca.id)
				.then(function(response){
					if (response.status == 200) {						
						$scope.listagem();
					}else{
						$scope.hideLoading();
						$scope.modal('Não foi possível deletar esta doença!', 'Tente novamente.');
					}		
				});		
     		} else {
	       		
    	 	}
   		});
	};

	//deleta uma doença armazenada localmente
	$scope.deletarLocal = function(doenca){
		var confirmPopup = $ionicPopup.confirm({
     		title: 'Você tem certeza que deseja deletar essa doença?',
     		template: 'Ao deletar essa doença, todos os dados ligados à ela serão deletados também',
	     	cancelText: 'Cancelar',
        	okText: 'Deletar'		
   		});
   		confirmPopup.then(function(res) {
     		if(res) {       			
       			$scope.showLoading();
				LocalFactory.removeDoencaLocal(doenca);
				$rootScope.doencasLocais = LocalFactory.getDoencasLocal();
				$scope.testaVazio();	
				$scope.hideLoading();		
     		} else {
	       		
    	 	}
   		});		
	};

	//faz o upload de uma doença para o servidor
	$scope.atualizarServidor = function(doenca){
		if ($rootScope.online == true) {
			$scope.sincronizando("Sincronizando",'<div align = "center"><img src = "img/gif.gif"></div>');
			if ($rootScope.usuario.permissao == 'ROLE_PECUARISTA') {
				doenca.usuario = $rootScope.usuario;
			}else{
				doenca.usuario = $rootScope.usuario.fazenda.pecuarista;
			}
			CaprioviService.postDoenca(doenca)
			.then(function(response){				
				if(response.status == 200){
					LocalFactory.removeDoencaLocal(doenca);
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

.controller('cadastroDoencaCtrl', ['$scope', '$stateParams', '$ionicLoading','CaprioviService','$state',
'$rootScope', '$ionicPopup', 'CaprioviFactory', 'LocalFactory',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $ionicLoading, CaprioviService, $state, $rootScope, $ionicPopup, CaprioviFactory, LocalFactory) {

	var adicionar;		

	if (CaprioviFactory.getDoenca() == null) {
		adicionar = true;
	}else{
		adicionar = false;		
		$scope.doenca = CaprioviFactory.getDoenca();						
	}

	$scope.modal = function(title, template){
		var alertPopup = $ionicPopup.alert({
     		title: title,
     		template: template
   		});   		
	}

	$scope.redirecionaDoenca = function(){
		if ($rootScope.online == true) {
			$scope.usuario = {};
			if ($rootScope.usuario.permissao == 'ROLE_PECUARISTA') {
				$scope.usuario = $rootScope.usuario;
			}else{
				$scope.usuario = $rootScope.usuario.fazenda.pecuarista;
			}
			CaprioviService.getDoenca($rootScope.usuario.id)
			.then(function(response){
				$scope.hideLoading();
				if (response.data != null) {									
					$rootScope.doencas = response.data;	
					$state.go('opcoes.doencas');																				
				}
			});
		}else{
			$scope.hideLoading();
			$state.go('opcoes.doencas');
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
  		$scope.redirecionaDoenca();  				
  	};		  	

  	$scope.cadastrar = function (doenca){  	  			

		$scope.showLoading();		

  		if(adicionar == true){  
  			if ($rootScope.usuario.permissao == 'ROLE_PECUARISTA') {
				doenca.usuario = $rootScope.usuario;
			}else{
				doenca.usuario = $rootScope.usuario.fazenda.pecuarista;
			}		
				
  			if ($rootScope.online == true) {	
				CaprioviService.postDoenca(doenca)
				.then(function(response){
					if(response.status == 200){
						$scope.redirecionaDoenca();
					}else{
						$scope.hideLoading();
						$scope.modal('Erro ao cadastrar doença', 'Tente novamente!');					
						return;
					}
				});
  			}else{
  				LocalFactory.addDoencaLocal(doenca);
				$scope.hideLoading();										
				$state.go('opcoes.doencas');
  			}
  		}else{  		
  			if ($rootScope.online == true) {
	  			CaprioviService.updateDoenca(doenca)
				.then(function(response){
					if(response.status == 200){
						$scope.redirecionaDoenca();
					}else{
						$scope.hideLoading();
						$scope.modal('Erro ao atualizar doença', 'Tente novamente!');					
						return;
					}
				});
			}else{
				for(var i = 0; i < LocalFactory.getDoencasLocal().length; i++){
					if (LocalFactory.getDoencasLocal()[i] == CaprioviFactory.getDoenca()) {
						LocalFactory.getDoencasLocal()[i] = doenca;
						$scope.hideLoading();
						$state.go('opcoes.doencas');
					}							
				}
			}
  		}	

	}
}])