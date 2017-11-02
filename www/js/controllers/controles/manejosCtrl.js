angular.module('app.controllers')

.controller('manejosCtrl', ['$scope', '$stateParams',  '$ionicLoading', 'CaprioviService', '$state', '$rootScope'
, '$ionicPopup', 'CaprioviFactory', 'LocalFactory', '$timeout',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $ionicLoading, CaprioviService, $state, $rootScope, $ionicPopup, CaprioviFactory, LocalFactory, $timeout) {

	//coloca os manejos locais em um array
	$rootScope.manejosLocais = LocalFactory.getManejosLocal();
	$scope.vazio = false;
	if ($rootScope.manejosLocais.length == 0) {
		$scope.vazio = true;
	};
	$scope.sincronismoSucesso = false;
	var showLoadingMensage;

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

	$scope.testaVazio = function(){
		$rootScope.manejosLocais = LocalFactory.getManejosLocal();
		$scope.vazio = false;
		if ($rootScope.manejosLocais.length == 0) {
			$scope.vazio = true;
		};
	};

	$scope.mensagemSincronismo = function(){
		$scope.sincronismoSucesso = true;
		$timeout(function() {
			$scope.sincronismoSucesso = false;
		}, 5000);
	};	

	//mostra um modal na tela do aplicativo
	$scope.modal = function(title, template){
		var alertPopup = $ionicPopup.alert({
     		title: title,
     		template: template
   		});   		
	};

	//separa os machos das fêmeas
	$scope.matrizesReprodutores = function(){
		$rootScope.matrizes = [];
		$rootScope.reprodutores = [];
		for(var i = 0; i < $rootScope.animais.length; i++){
			if ($rootScope.animais[i].sexo == "SEXO_MACHO") {
				$rootScope.reprodutores.push($rootScope.animais[i]);				
			}else{
				$rootScope.matrizes.push($rootScope.animais[i]);
			}
		}		
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
		CaprioviService.getRebanhos(idsF)
		.then(function(response){
			$rootScope.rebanhos = response.data;
			$scope.carregaAnimais();																																																
		});
	};

	//carrega os animais do usuário
	$scope.carregaAnimais = function(){
		CaprioviService.getAnimais(idsF)
		.then(function(response){
			if (response.data != null) {
				$scope.hideLoading();
				$rootScope.animais = response.data;	
				$scope.matrizesReprodutores();											
				$state.go('cadastroManejo');									
			}
		});
	};

	//chama as funções que carregam as entidades
	$scope.carregaEntidades = function(){
		$scope.idsFazendas();	
		$scope.carregaRebanhos();			
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
			$state.go('cadastroManejo');
		}
	};

	//função que redireciona para a página de adicionar manejo
	$scope.adicionar = function(){		
		CaprioviFactory.setManejo(null);
		$scope.carregaFazendas();
	};

	//função que redireciona para a página de atualizar manejo
	$scope.atualizar = function(manejo){		
		CaprioviFactory.setManejo(manejo);
		$scope.carregaFazendas();
	};

	//mostra um caixa de mensagem na tela do aplicativo
	$scope.sincronizando = function(title, template){
		showLoadingMensage = $ionicPopup.show({
     		title: title,
     		template: template
   		});   		
	};

	//deleta um manejo armazenada localmente
	$scope.deletarLocal = function(manejo){
		var confirmPopup = $ionicPopup.confirm({
     		title: 'Você tem certeza que deseja deletar esse manejo?',
     		template: 'Ao deletar esse manejo, todos os outros dados ligados à ele serão deletados também',
	     	cancelText: 'Cancelar',
        	okText: 'Deletar'		
   		});
   		confirmPopup.then(function(res) {
     		if(res) {       			
       			$scope.showLoading();
				LocalFactory.removeManejoLocal(manejo);
				$rootScope.manejosLocais = LocalFactory.getManejosLocal();
				$scope.testaVazio();
				$scope.hideLoading();		
     		} else {
	       		
    	 	}
   		});		
	};

	$scope.manejosList = function(){
		if ($rootScope.online == true) {
			if ($rootScope.usuario.permissao == 'ROLE_PECUARISTA') {
				CaprioviService.getFazendas($rootScope.usuario.id)
				.then(function(response){					
					$rootScope.fazendas = response.data;			
					$scope.idsFazendas();							
					CaprioviService.getManejos(idsF)
					.then(function(response){
						$scope.hideLoading();							
						$rootScope.manejos = response.data;				
						$state.go('opcoes.manejos');
					});								
				});
			}else{
				$scope.idsFazendas();							
				CaprioviService.getManejos(idsF)
				.then(function(response){
					$scope.hideLoading();							
					$rootScope.manejos = response.data;				
					$state.go('opcoes.manejos');
				});
			}
		}else{
			$scope.hideLoading();
			$state.go('opcoes.manejos');
		}
	};

	//atualiza a lista de manejos
	$scope.atualizarList = function(){
		$scope.showLoading();  		
		$scope.manejosList();
		$scope.$broadcast('scroll.refreshComplete');
	};

	//função que deleta um manejo
	$scope.deletar = function(manejo){
		var confirmPopup = $ionicPopup.confirm({
     		title: 'Você tem certeza que deseja deletar esse manejo reprodutivo?',
     		template: 'Ao deletar esse manejo, todos os dados ligados à ele serão também deletados',
     		cancelText: 'Cancelar',
        	okText: 'Deletar'
   		});

   		confirmPopup.then(function(res) {
     		if(res) {       			
       			$scope.showLoading();  		
				CaprioviService.deleteManejo(manejo.id)
				.then(function(response){
					if (response.status == 200) {
						$scope.manejosList();
					}		
				});		
     		} else {
	       		
    	 	}
   		});
	};

	//faz o upload de um manejo para o servidor
	$scope.atualizarServidor = function(manejo){
		$scope.manejoFuncao = manejo;
		if ($rootScope.online == true) {
			$scope.showLoading();
			if ($rootScope.usuario.permissao == 'ROLE_PECUARISTA'){				
				CaprioviService.getFazendas($rootScope.usuario.id)
				.then(function(response){		
					$rootScope.fazendas = response.data;
					$scope.idsFazendas();
					CaprioviService.getRebanhos(idsF)
					.then(function(response){
						$rootScope.rebanhos = response.data;
						CaprioviService.getAnimais(idsF)
						.then(function(response){
							if (response.data != null) {
								$rootScope.animais = response.data;	
								$scope.matrizesReprodutores();																				
							}
						});																																														
					});																					
				});
			}else{
				$scope.idsFazendas();
				CaprioviService.getRebanhos(idsF)
				.then(function(response){
					$rootScope.rebanhos = response.data;
					CaprioviService.getAnimais(idsF)
					.then(function(response){
						if (response.data != null) {
							$rootScope.animais = response.data;	
							$scope.matrizesReprodutores();																				
						}
					});																																														
				});
			}

			$scope.hideLoading();

				$ionicPopup.show({
				  template: '<style>.popup { width:500px; }</style><label class="item item-select"><select ng-model = "manejoFuncao.rebanho" ng-options = "rebanho.nome for rebanho in rebanhos" ng-required = "true"><option value="" disabled selected>Rebanho</option></select></label><div class="spacer" style="width: 300px; height: 22px;"></div>' +
				  '<label class="item item-select"><select ng-model = "manejoFuncao.matriz" ng-options = "matriz.nomeNumero for matriz in matrizes" ng-required = "true"><option value="" disabled selected>Matriz</option></select></label><div class="spacer" style="width: 300px; height: 22px;"></div>' +
				  '<label class="item item-select"><select ng-model = "manejoFuncao.reprodutor" ng-options = "reprodutor.nomeNumero for reprodutor in reprodutores" ng-required = "true"><option value="" disabled selected>Reprodutor</option></select></label><div class="spacer" style="width: 300px; height: 22px;"></div>',
				  title: 'Escolha o rebanho, a matriz e o reprodutor desse manejo',				  
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
				     	if ($scope.manejoFuncao.rebanho != null && $scope.manejoFuncao.matriz != null && $scope.manejoFuncao.reprodutor != null) {
					     	$scope.sincronizando("Sincronizando",'<div align = "center"><img src = "img/gif.gif"></div>');
							CaprioviService.postManejo($scope.manejoFuncao)
							.then(function(response){				
								if(response.status == 200){
									LocalFactory.removeManejoLocal(manejo);
									$scope.testaVazio();
									showLoadingMensage.close();													
									$scope.manejosList();
									$scope.mensagemSincronismo();	
									$ionicPopup.close();		
								}else{
									showLoadingMensage.close();
									$scope.modal('Erro ao sincronizar seus dados', 'Tente novamente!');					
									return;
								}
							});
						}else{
							$scope.modal('Erro ao sincronizar seus dados', 'Você precisa selecionar a matriz, o reprodutor e o rebanho para sincronizar esse manejo');	
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

.controller('cadastroManejoCtrl', ['$scope', '$stateParams', '$ionicLoading','CaprioviService','$state',
'$rootScope', '$ionicPopup', 'CaprioviFactory', 'LocalFactory',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $ionicLoading, CaprioviService, $state, $rootScope, $ionicPopup, CaprioviFactory, LocalFactory) {

	var adicionar;	
	var idsF = [];	
	//testa se o usuário está cadastrando ou atualizando um manejo
	if (CaprioviFactory.getManejo() == null) {
		adicionar = true;
	}else{
		adicionar = false;
		$scope.manejo = CaprioviFactory.getManejo();
		$scope.manejo.dataDaCobertura = new Date($scope.manejo.dataDaCobertura);				

		if ($scope.manejo.paricao == 'SIM') {
			$scope.manejo.paricao = "Sim";
		}else if($scope.manejo.paricao == 'NAO'){
			$scope.manejo.paricao = "Não";
		}else if($scope.manejo.paricao == 'EMANDAMENTO'){
			$scope.manejo.paricao = "Em andamento";
		}			
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

	//função chamada pelo botão cancelar do cadastro de manejos
	$scope.cancelar = function(){		
  		$scope.showLoading();  
  		$scope.manejosList();		
  	};

  	//carrrega os manejos
  	$scope.manejosList = function(){
  		if ($rootScope.online == true) {
  			if ($rootScope.usuario.permissao == 'ROLE_PECUARISTA') {
	  			CaprioviService.getFazendas($rootScope.usuario.id)
				.then(function(response){			
					$rootScope.fazendas = response.data;
					$scope.idsFazendas();							
					CaprioviService.getManejos(idsF)
					.then(function(response){							
						$rootScope.manejos = response.data;
						$scope.hideLoading();					
						$state.go('opcoes.manejos');
					});								
				});
			}else{
				$scope.idsFazendas();							
				CaprioviService.getManejos(idsF)
				.then(function(response){
					$scope.hideLoading();							
					$rootScope.manejos = response.data;					
					$state.go('opcoes.manejos');
				});
			}
  		}else{
  			$scope.hideLoading();
  			$state.go('opcoes.manejos');
  		}	  		
  	};  	

  	//função chamada pelo botão salvar do cadastro de manejos
  	$scope.cadastrar = function (manejo){  	
  		
  		if (manejo.paricao == 'Sim') {
			manejo.paricao = 1;
		}else if(manejo.paricao == 'Não'){
			manejo.paricao = 2;
		}else if(manejo.paricao == 'Em andamento'){
			manejo.paricao = 3;
		}

		$scope.showLoading();

  		if(adicionar == true){
  			if ($rootScope.online == true) {
  				CaprioviService.postManejo(manejo)
				.then(function(response){
					if(response.status == 200){
						$scope.manejosList();
					}else{
						$scope.hideLoading();
						$scope.modal('Erro ao cadastrar o manejo reprodutivo', 'Tente novamente!');					
						return;
					}
				});
  			}else{
  				LocalFactory.addManejoLocal(manejo);
				$scope.hideLoading();										
				$state.go('opcoes.manejos');
  			}			
  		}else{
  			if ($rootScope.online == true) {
	  			CaprioviService.updateManejo(manejo)
				.then(function(response){
					if(response.status == 200){
						$scope.manejosList();
					}else{
						$scope.hideLoading();
						$scope.modal('Erro ao atualizar o manejo', 'Tente novamente!');					
						return;
					}
				});
			}else{
				for(var i = 0; i < LocalFactory.getManejosLocal().length; i++){
					if (LocalFactory.getManejosLocal()[i] == CaprioviFactory.getManejo()) {
						LocalFactory.getManejosLocal()[i] = manejo;
						$scope.hideLoading();
						$state.go('opcoes.manejos');
					}							
				}
			}
  		}	

	}

}])