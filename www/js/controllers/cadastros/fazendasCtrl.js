angular.module('app.controllers')

.controller('fazendasCtrl', ['$scope', '$stateParams', '$ionicLoading','CaprioviService','$state',
'$rootScope', '$ionicPopup', 'CaprioviFactory', 'LocalFactory','$timeout',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $ionicLoading, CaprioviService, $state, $rootScope, $ionicPopup, CaprioviFactory, LocalFactory, $timeout) {				

	$rootScope.fazendasLocais = LocalFactory.getFazendasLocal();
	$scope.vazio = false;
	if ($rootScope.fazendasLocais.length == 0) {
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

	$scope.fazendasRedirecionamento = function(){		
		CaprioviService.getFazendas($rootScope.usuario.id)
		.then(function(response){
			$scope.hideLoading();	
			if (response.status == 200) {
				$rootScope.fazendas = response.data;
				$state.go('opcoes.fazendas');
			}else if(response.status == -1){
				$scope.modal('Não foi possível recarregar suas fazendas', 'Serviço indisponível');
				$state.go('opcoes.fazendas');
			}
		}); 		
	};

	$scope.testaVazio = function(){
		$rootScope.fazendasLocais = LocalFactory.getFazendasLocal();
		$scope.vazio = false;
		if ($rootScope.fazendasLocais.length == 0) {
			$scope.vazio = true;
		};
	};

	//adiciona uma fazenda
	$scope.adicionar = function(){				
		CaprioviFactory.setFazenda(null);		
		$state.go('cadastroFazenda');
	};

	//atualiza uma fazenda
	$scope.atualizar = function(fazenda){		
		CaprioviFactory.setFazenda(fazenda);					
		$state.go('cadastroFazenda');	
	};

	//mostra um modal na tela do aplicativo
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

	//atualiza a lista de rebanhos
	$scope.atualizarList = function(){
		$scope.showLoading();
		if ($rootScope.online == true) {
			$scope.fazendasRedirecionamento();
			$scope.$broadcast('scroll.refreshComplete');
		}else{
			$scope.hideLoading();
			$scope.$broadcast('scroll.refreshComplete');
		}	
		
	};	

	//deleta uma fazenda
	$scope.deletar = function(fazenda){
		var confirmPopup = $ionicPopup.confirm({
     		title: 'Você tem certeza que deseja deletar esta fazenda?',
     		template: 'Ao deletar essa fazenda, todos os rebanhos e outros dados ligados à ela serão deletados também',
	     	cancelText: 'Cancelar',
        	okText: 'Deletar'		
   		});

   		confirmPopup.then(function(res) {
     		if(res) {       			
       			$scope.showLoading();  		
				CaprioviService.deleteFazenda(fazenda.id)
				.then(function(response){
					if (response.status == 200) {						
						$scope.fazendasRedirecionamento();												
					}else{
						$scope.hideLoading();
						$scope.modal('Não foi possível deletar esta fazenda!', 'Tente novamente e tente novamente');
					}		
				});		
     		} else {
	       		
    	 	}
   		});
	};

	//faz o upload de uma fazenda para o servidor
	$scope.atualizarServidor = function(fazenda){
		if ($rootScope.online == true) {
			$scope.sincronizando("Sincronizando",'<div align = "center"><img src = "img/gif.gif"></div>');
			fazenda.pecuarista = $rootScope.usuario;
			CaprioviService.postFazenda(fazenda)
			.then(function(response){				
				if(response.status == 200){
					LocalFactory.removeFazendaLocal(fazenda);
					showLoadingMensage.close();
					$scope.fazendasRedirecionamento();
					$scope.mensagemSincronismo();
					$scope.testaVazio();	
				}else{					
					$scope.modal('Erro ao sincronizar seus dados', 'Tente novamente!');					
					return;
				}
			});
			
		}else{			
			$scope.modal("Sem conexão","Você não possui conexão com a internet para sincronizar seus dados com o servidor!");
		}
	};

	//deleta uma fazenda armazenada localmente
	$scope.deletarLocal = function(fazenda){
		var confirmPopup = $ionicPopup.confirm({
     		title: 'Você tem certeza que deseja deletar esta fazenda?',
     		template: 'Ao deletar este fazenda, todos os rebanhos e outros dados ligados à ela serão deletados também',
	     	cancelText: 'Cancelar',
        	okText: 'Deletar'		
   		});
   		confirmPopup.then(function(res) {
     		if(res) {       			
       			$scope.showLoading();
				LocalFactory.removeFazendaLocal(fazenda);
				$rootScope.fazendasLocais = LocalFactory.getFazendasLocal();
				$scope.testaVazio();	
				$scope.hideLoading();		
     		} else {
	       		
    	 	}
   		});		
	};
}])

.controller('cadastroFazendaCtrl', ['$scope', '$stateParams', '$ionicLoading','CaprioviService','$state',
'$rootScope', '$ionicPopup', 'CaprioviFactory','LocalFactory',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $ionicLoading, CaprioviService, $state, $rootScope, $ionicPopup, CaprioviFactory, LocalFactory) {

	var adicionar;				
	$scope.estados = [];
	$scope.estados.push("Acre");
	$scope.estados.push("Alagoas");
	$scope.estados.push("Amapá");
	$scope.estados.push("Amazonas");
	$scope.estados.push("Bahia");
	$scope.estados.push("Ceará");
	$scope.estados.push("Distrito Federal");
	$scope.estados.push("Espírito Santo");
	$scope.estados.push("Goiás");
	$scope.estados.push("Maranhão");
	$scope.estados.push("Mato Grosso");
	$scope.estados.push("Mato Grosso do Sul");
	$scope.estados.push("Minas Gerais");
	$scope.estados.push("Pará");
	$scope.estados.push("Paraíba");
	$scope.estados.push("Paraná");
	$scope.estados.push("Pernambuco");
	$scope.estados.push("Piauí");
	$scope.estados.push("Rio de Janeiro");
	$scope.estados.push("Rio Grande do Norte");
	$scope.estados.push("Rio Grande do Sul");
	$scope.estados.push("Rondônia");
	$scope.estados.push("Roraima");
	$scope.estados.push("Santa Catarina");
	$scope.estados.push("São Paulo");
	$scope.estados.push("Sergipe");
	$scope.estados.push("Tocantins");

	//Verifica se o usuário está atualizando ou adicionando
	if (CaprioviFactory.getFazenda() == null) {
		adicionar = true;
	}else{
		adicionar = false;		
		$scope.fazenda = CaprioviFactory.getFazenda();								
	}		

	$scope.modal = function(title, template){
		var alertPopup = $ionicPopup.alert({
     		title: title,
     		template: template
   		});   		
	}

	/* LOADING FUNCTION */
	$scope.showLoading = function() {
		$ionicLoading.show()
	};
	$scope.hideLoading = function(){
		$ionicLoading.hide();
	};			

	$scope.fazendasRedirecionamento = function(){
		if ($rootScope.online == true) {
			CaprioviService.getFazendas($rootScope.usuario.id)
			.then(function(response){	
				$scope.hideLoading();
				if (response.status == 200) {			 		
					$rootScope.fazendas = response.data;															
					$state.go('opcoes.fazendas');
				}else if(response.status == -1){
					$state.go('opcoes.fazendas');
				}
			});
		}else{
			$scope.hideLoading();										
			$state.go('opcoes.fazendas');
		}		  		  		
	};

	$scope.cancelar = function(){		
  		$scope.showLoading(); 
  		$scope.fazendasRedirecionamento();  				
  	};  	  		  	

  	$scope.cadastrar = function (fazenda){  	

  		$scope.showLoading();  		  	  		

  		if(adicionar == true){  
  			fazenda.pecuarista = $rootScope.usuario;	  			
			
			if ($rootScope.online == true) {
				CaprioviService.postFazenda(fazenda)
				.then(function(response){				
					if(response.status == 200){
						$scope.fazendasRedirecionamento();
					}else{					
						$scope.modal('Erro ao cadastrar sua fazenda', 'Tente novamente!');					
						return;
					}
				});
			}else{
				LocalFactory.addFazendaLocal(fazenda);
				$scope.hideLoading();										
				$state.go('opcoes.fazendas');
			}						

  		}else{  		
  			if ($rootScope.online == true) {
  				CaprioviService.updateFazenda(fazenda)
				.then(function(response){				
					if(response.status == 200){
						$scope.fazendasRedirecionamento();
					}else{
						$scope.hideLoading();
						$scope.modal('Erro ao atualizar sua fazenda', 'Tente novamente!');					
						return;
					}
				});
  			}else{
				for(var i = 0; i < LocalFactory.getFazendasLocal().length; i++){
					if (LocalFactory.getFazendasLocal()[i] == CaprioviFactory.getFazenda()) {
						LocalFactory.getFazendasLocal()[i] = fazenda;
						$scope.hideLoading();
						$state.go('opcoes.fazendas');
					}							
				}  				
  			}	  			
  		}	

	}
}])	