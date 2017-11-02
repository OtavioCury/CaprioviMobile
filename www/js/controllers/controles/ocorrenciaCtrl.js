angular.module('app.controllers')

.controller('ocorrenciasCtrl', ['$scope', '$stateParams', '$ionicLoading', 'CaprioviService', '$state', '$rootScope'
, '$ionicPopup', 'CaprioviFactory', 'LocalFactory', '$timeout',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $ionicLoading, CaprioviService, $state, $rootScope, $ionicPopup, CaprioviFactory, LocalFactory, $timeout) {

	//coloca as ocorrências locais em um array
	$rootScope.ocorrenciasLocal = LocalFactory.getOcorrenciasLocal();
	$scope.vazio = false;
	if ($rootScope.ocorrenciasLocal.length == 0) {
		$scope.vazio = true;
	};
	$scope.sincronismoSucesso = false;
	var showLoadingMensage;
	//ids das fazendas
	var idsF = [];

	//ids dos rebanhos
	var idsR = [];			

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

	//coloca os ids dos rebanhos no array IdsR
	$scope.idsRebanhos = function(){		
		for(var i = 0; i < $rootScope.rebanhos.length; i++){		
			idsF.push($rootScope.rebanhos[i].id);			
		}		
	};

	$scope.testaVazio = function(){
		$rootScope.ocorrenciasLocal = LocalFactory.getOcorrenciasLocal();
		$scope.vazio = false;
		if ($rootScope.ocorrenciasLocal.length == 0) {
			$scope.vazio = true;
		};
	};

	$scope.mensagemSincronismo = function(){
		$scope.sincronismoSucesso = true;
		$timeout(function() {
			$scope.sincronismoSucesso = false;
		}, 5000);
	};
	
	/* LOADING FUNCTION */
	$scope.showLoading = function() {
		$ionicLoading.show()
	};

	$scope.hideLoading = function(){
		$ionicLoading.hide();
	};	

	//carrega os animais do usuário
	$scope.carregaAnimais = function(){
		CaprioviService.getAnimais(idsF)
		.then(function(response){
			if (response.data != null) {
				$scope.hideLoading();
				$rootScope.animais = response.data;														
				$state.go('cadastroOcorrencia');									
			}
		});
	};

	//carrega os doenças do usuário
	$scope.carregaDoencas = function(){
		var id;

		if ($rootScope.usuario.permissao == 'ROLE_PECUARISTA') {
			id = $rootScope.usuario.id;
		}else{
			id = $rootScope.usuario.fazenda.pecuarista.id;
		}
		CaprioviService.getDoenca(id)
		.then(function(response){				
			$scope.hideLoading();
			$rootScope.doencas = response.data;																							
		});
	};

	//chama as funções que carregam as entidades
	$scope.carregaEntidades = function(){
		$scope.idsFazendas();					
		$scope.carregaDoencas();
		$scope.carregaAnimais();
	};

	//carrega as fazendas do usuário
	$scope.carregaFazendas = function(){
		$scope.showLoading();
		if ($rootScope.online == true) {

			if ($rootScope.usuario.permissao == 'ROLE_PECUARISTA') {
				CaprioviService.getFazendas($rootScope.usuario.id)
				.then(function(response){			
					$rootScope.fazendas = response.data;
					$scope.carregaEntidades();												
				});
			}else{
				$scope.carregaEntidades();
			}
		}else{
			$scope.hideLoading();
			$state.go('cadastroOcorrencia');
		}
	};

	//função que redireciona para a página de adicionar ocorrência
	$scope.adicionar = function(){		
		CaprioviFactory.setOcorrencia(null);
		$scope.carregaFazendas();
	};

	//função que redireciona para a página de atualizar ocorrência
	$scope.atualizar = function(ocorrencia){		
		CaprioviFactory.setOcorrencia(ocorrencia);
		$scope.carregaFazendas();
	};

	$scope.ocorrenciasList = function(){
		if ($rootScope.online == true) {
			if ($rootScope.usuario.permissao == 'ROLE_PECUARISTA') {
				CaprioviService.getFazendas($rootScope.usuario.id)
				.then(function(response){					
					$rootScope.fazendas = response.data;			
					$scope.idsFazendas();							
					CaprioviService.getOcorrencia(idsF)
					.then(function(response){
						$scope.hideLoading();							
						$rootScope.ocorrencias = response.data;				
						$state.go('opcoes.ocorrencias');
					});								
				});
			}else{
				$scope.idsFazendas();							
				CaprioviService.getOcorrencia(idsF)
				.then(function(response){
					$scope.hideLoading();							
					$rootScope.ocorrencias = response.data;				
					$state.go('opcoes.ocorrencias');
				});
			}
		}else{
			$scope.hideLoading();
			$state.go('opcoes.ocorrencias');							
		}
		
	};

	//atualiza a lista de ocorrências
	$scope.atualizarList = function(){
		$scope.showLoading();  		
		$scope.ocorrenciasList();
		$scope.$broadcast('scroll.refreshComplete');
	};

	//função que deleta uma ocorrência
	$scope.deletar = function(ocorrencia){
		var confirmPopup = $ionicPopup.confirm({
     		title: 'Você tem certeza que deseja deletar esse ocorrência clínica?',
     		template: 'Ao deletar esse ocorrência, todos os dados ligados à ele serão também deletados',
     		cancelText: 'Cancelar',
        	okText: 'Deletar'
   		});

   		confirmPopup.then(function(res) {
     		if(res) {       			
       			$scope.showLoading();  		
				CaprioviService.deleteOcorrencia(ocorrencia.id)
				.then(function(response){
					if (response.status == 200) {
						$scope.ocorrenciasList();
					}		
				});		
     		} else {
	       		
    	 	}
   		});
	};

	//deleta uma ocorrência armazenada localmente
	$scope.deletarLocal = function(ocorrencia){
		var confirmPopup = $ionicPopup.confirm({
     		title: 'Você tem certeza que deseja deletar essa ocorrência clínica?',
     		template: 'Ao deletar essa ocorrência clínica, todos os outros dados ligados à ela serão deletados também',
	     	cancelText: 'Cancelar',
        	okText: 'Deletar'		
   		});
   		confirmPopup.then(function(res) {
     		if(res) {       			
       			$scope.showLoading();
				LocalFactory.removeOcorrenciaLocal(ocorrencia);
				$rootScope.ocorrenciasLocal = LocalFactory.getOcorrenciasLocal();
				$scope.testaVazio();
				$scope.hideLoading();		
     		} else {
	       		
    	 	}
   		});		
	};

	//mostra um modal na tela do aplicativo
	$scope.modal = function(title, template){
		var alertPopup = $ionicPopup.alert({
     		title: title,
     		template: template
   		});   		
	};

	//mostra um caixa de mensagem na tela do aplicativo
	$scope.sincronizando = function(title, template){
		showLoadingMensage = $ionicPopup.show({
     		title: title,
     		template: template
   		});   		
	};

	//faz o upload de uma ocorrência para o servidor
	$scope.atualizarServidor = function(ocorrencia){
		$scope.ocorrenciaFuncao = ocorrencia;
		if ($rootScope.online == true) {
			$scope.showLoading();
			$scope.usuarioMetodo = {};
			if ($rootScope.usuario.permissao == 'ROLE_PECUARISTA'){				
				$scope.usuarioMetodo = $rootScope.usuario;
				CaprioviService.getFazendas($rootScope.usuario.id)
				.then(function(response){		
					$rootScope.fazendas = response.data;
					$scope.idsFazendas();
					CaprioviService.getAnimais(idsF)
					.then(function(response){
						if (response.data != null) {
							$rootScope.animais = response.data;																					
						}
					});																																																														
				});				
			}else{
				$scope.usuarioMetodo = $rootScope.usuario.fazenda.pecuarista;
				$scope.idsFazendas();				
				CaprioviService.getAnimais(idsF)
				.then(function(response){
					if (response.data != null) {
						$rootScope.animais = response.data;																					
					}																																														
				});
			}

			CaprioviService.getDoenca($scope.usuarioMetodo.id)
			.then(function(response){
				$scope.hideLoading();
				if (response.data != null) {									
					$rootScope.doencas = response.data;	
				}
			});

			$scope.hideLoading();

				$ionicPopup.show({
				  template: '<style>.popup { width:500px; }</style><label class="item item-select"><select ng-model = "ocorrenciaFuncao.animal" ng-options = "animal.nomeNumero for animal in animais" ng-required = "true"><option value="" disabled selected>Animal</option></select></label><div class="spacer" style="width: 300px; height: 22px;"></div>' +
				  '<label class="item item-select"><select ng-model = "ocorrenciaFuncao.doenca" ng-options = "doenca.nome for doenca in doencas" ng-required = "true"><option value="" disabled selected>Doença</option></select></label><div class="spacer" style="width: 300px; height: 22px;"></div>' ,
				  title: 'Escolha o animal e a doença dessa ocorrência clínica',				  
				  scope: $scope,
				  buttons: [
				   { text: 'Cancelar',
				   	 type: 'button-assertive',
				   	 onTap: function() {  }
				   },
				   {
				     text: 'Sincronizar',
				     type: 'button-positive',
				     onTap: function(e) {
				     	if ($scope.ocorrenciaFuncao.animal != null && $scope.ocorrenciaFuncao.doenca != null) {
					     	$scope.sincronizando("Sincronizando",'<div align = "center"><img src = "img/gif.gif"></div>');
							CaprioviService.postOcorrencia($scope.ocorrenciaFuncao)
							.then(function(response){				
								if(response.status == 200){
									LocalFactory.removeOcorrenciaLocal(ocorrencia);
									$scope.testaVazio();
									showLoadingMensage.close();										
									$scope.ocorrenciasList();
									$scope.mensagemSincronismo();			
									$ionicPopup.close();		
								}else{
									showLoadingMensage.close();
									$scope.modal('Erro ao sincronizar seus dados', 'Tente novamente!');					
									return;
								}
							});
						}else{
							$scope.modal('Erro ao sincronizar seus dados', 'Você precisa selecionar o animal e a doença para sincronizar essa ocorrência');
						}    	
				     }
				   }
				  ]
				});			
		}else{			
			$scope.modal("Sem conexão","Você não possui conexão com a internet para sincronizar seus dados com o servidor!");
		}
	};
}])
          
.controller('cadastroOcorrenciaCtrl', ['$scope', '$stateParams', '$ionicLoading', 'CaprioviService', '$state', '$rootScope'
, '$ionicPopup', 'CaprioviFactory', 'LocalFactory',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $ionicLoading, CaprioviService, $state, $rootScope, $ionicPopup, CaprioviFactory, LocalFactory) {

	var adicionar;	
	var idsF = [];	

	//testa se o usuário está cadastrando ou atualizando uma ocorrência
	if (CaprioviFactory.getOcorrencia() == null) {
		adicionar = true;
	}else{
		adicionar = false;
		$scope.ocorrencia = CaprioviFactory.getOcorrencia();
		$scope.ocorrencia.data = new Date($scope.ocorrencia.data);					
	}		

	$scope.idsFazendas = function(){
		if ($rootScope.usuario.permissao == 'ROLE_PECUARISTA') {		
		for(var i = 0; i < $rootScope.fazendas.length; i++){		
			idsF.push($rootScope.fazendas[i].id);				
		}
		}else{
			idsF.push($rootScope.usuario.fazenda.id);
		}		
	};

	//função que mostra um modal
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

	//função chamada pelo botão cancelar do cadastro de ocorrências
	$scope.cancelar = function(){		
  		$scope.showLoading();  
  		$scope.ocorrenciasList();		
  	};

  	//carrrega as ocorrência
  	$scope.ocorrenciasList = function(){
  		if ($rootScope.online == true) {
  			if ($rootScope.usuario.permissao == 'ROLE_PECUARISTA') {	  		
		  		CaprioviService.getFazendas($rootScope.usuario.id)
				.then(function(response){			
					$rootScope.fazendas = response.data;
					$scope.idsFazendas();							
					CaprioviService.getOcorrencia(idsF)
					.then(function(response){
						$scope.hideLoading();							
						$rootScope.ocorrencias = response.data;					
						$state.go('opcoes.ocorrencias');
					});								
				});
			}else{
				$scope.idsFazendas();							
				CaprioviService.getOcorrencia(idsF)
				.then(function(response){
					$scope.hideLoading();							
					$rootScope.ocorrencias = response.data;				
					$state.go('opcoes.ocorrencias');
				});
			}
  		}else{
  			$scope.hideLoading();
  			$state.go('opcoes.ocorrencias');
  		}  		
  	};  	

  	//função chamada pelo botão salvar do cadastro de ocorrências
  	$scope.cadastrar = function (ocorrencia){  	  	  		

		$scope.showLoading();

  		if(adicionar == true){
  			if ($rootScope.online == true) {
  				CaprioviService.postOcorrencia(ocorrencia)
				.then(function(response){
					if(response.status == 200){
						$scope.ocorrenciasList();
					}else{
						$scope.hideLoading();
						$scope.modal('Erro ao cadastrar a ocorrência clínica', 'Tente novamente!');					
						return;
					}
				});	
  			}else{
  				LocalFactory.addOcorrenciaLocal(ocorrencia);
				$scope.hideLoading();										
				$state.go('opcoes.ocorrencias');
  			}
			
  		}else{
  			if ($rootScope.online == true) {
	  			CaprioviService.updateOcorrencia(ocorrencia)
				.then(function(response){
					if(response.status == 200){
						$scope.ocorrenciasList();
					}else{
						$scope.hideLoading();
						$scope.modal('Erro ao atualizar a ocorrência clínica', 'Tente novamente!');					
						return;
					}
				});
			}else{
				for(var i = 0; i < LocalFactory.getOcorrenciasLocal().length; i++){
					if (LocalFactory.getOcorrenciasLocal()[i] == CaprioviFactory.getOcorrencia()) {
						LocalFactory.getOcorrenciasLocal()[i] = ocorrencia;
						$scope.hideLoading();
						$state.go('opcoes.ocorrencias');
					}							
				}
			}
  		}	
	}

}])