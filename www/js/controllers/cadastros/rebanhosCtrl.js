angular.module('app.controllers')

.controller('rebanhosCtrl', ['$scope', '$stateParams', '$ionicLoading','CaprioviService','$state',
'$rootScope', '$ionicPopup', 'CaprioviFactory', 'LocalFactory', '$timeout',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $ionicLoading, CaprioviService, $state, $rootScope, $ionicPopup, CaprioviFactory, LocalFactory, $timeout) {		

	$rootScope.rebanhosLocais = LocalFactory.getRebanhosLocal();
	$scope.vazio = false;
	if ($rootScope.rebanhosLocais.length == 0) {
		$scope.vazio = true;
	};
	$scope.sincronismoSucesso = false;
	var showLoadingMensage;
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

	$scope.testaVazio = function(){
		$rootScope.rebanhosLocais = LocalFactory.getRebanhosLocal();
		$scope.vazio = false;
		if ($rootScope.rebanhosLocais.length == 0) {
			$scope.vazio = true;
		};
	};

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

	$scope.redirecionamentoCadastro = function(){
		$scope.showLoading();
		if ($rootScope.online == true) {
			if ($rootScope.usuario.permissao == 'ROLE_PECUARISTA') {
				CaprioviService.getFazendas($rootScope.usuario.id)
				.then(function(response){
					$scope.hideLoading();
					if (response.status == 200) {	
						$rootScope.fazendas = response.data;						
						$state.go('cadastroRebanho');
					}else if(response.status == -1){
						$scope.modal('Não foi possível carregar suas fazendas para o cadastro de rebanho', 'Verfique sua conexão e tente novamente');
					}
				});
			}else{	
				$scope.hideLoading();
				$state.go('cadastroRebanho');
			}
		}else{
			$scope.hideLoading();
			$state.go('cadastroRebanho');
		}
	};

	$scope.redirecionamentoOpcoes = function(){
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
	};

	$scope.opcoes = function(){
		if ($rootScope.online == true) {
			if ($rootScope.usuario.permissao == 'ROLE_PECUARISTA'){
				CaprioviService.getFazendas($rootScope.usuario.id)
				.then(function(response){
					if (response.status == 200) {
						$rootScope.fazendas = response.data;											
						$scope.redirecionamentoOpcoes();
					}else if(response.status == -1){
						$scope.hideLoading();
						$scope.modal('Não foi possível carregar seus rebanhos', 'Verfique sua conexão e tente novamente');
					}
				}); 
			}else{			
				$scope.redirecionamentoOpcoes();
			}
		}else{
			$scope.hideLoading();
			$state.go('opcoes.rebanhos');
		}
	};

	//mostra um caixa de mensagem na tela do aplicativo
	$scope.sincronizando = function(title, template){
		showLoadingMensage = $ionicPopup.show({
     		title: title,
     		template: template
   		});   		
	}

	//adiciona um rebanho
	$scope.adicionar = function(){				
		CaprioviFactory.setRebanho(null);		
		$scope.redirecionamentoCadastro();
	};

	//atualiza um rebanho
	$scope.atualizar = function(rebanho){		
		CaprioviFactory.setRebanho(rebanho);					
		$scope.redirecionamentoCadastro();
	};

	$scope.modal = function(title, template){
		var alertPopup = $ionicPopup.alert({
     		title: title,
     		template: template
   		});   		
	}

	//atualiza a lista de rebanhos
	$scope.atualizarList = function(){
		$scope.showLoading();
		$scope.opcoes();	
		$scope.$broadcast('scroll.refreshComplete');
	};	

	//deleta um rebanho
	$scope.deletar = function(rebanho){
		var confirmPopup = $ionicPopup.confirm({
     		title: 'Você tem certeza que deseja deletar este rebanho?',
     		template: 'Ao deletar este rebanho, todos os animais e outros dados ligados à ele serão também deletados',
     		cancelText: 'Cancelar',
        	okText: 'Deletar'		
   		});

   		confirmPopup.then(function(res) {
     		if(res) {       			
       			$scope.showLoading();
				CaprioviService.deleteRebanho(rebanho.id)
				.then(function(response){
					if (response.status == 200) {						
						$scope.opcoes();												
					}else{
						$scope.hideLoading();
						$scope.modal('Não foi possível deletar este rebanho!', 'Tente novamente e tente novamente');
					}		
				});		
     		} else {
	       		
    	 	}
   		});
	};

	//deleta um rebanho armazenada localmente
	$scope.deletarLocal = function(rebanho){
		var confirmPopup = $ionicPopup.confirm({
     		title: 'Você tem certeza que deseja deletar este rebanho?',
     		template: 'Ao deletar este rebanho, todos os animais e outros dados ligados à ele serão deletados também',
	     	cancelText: 'Cancelar',
        	okText: 'Deletar'		
   		});
   		confirmPopup.then(function(res) {
     		if(res) {       			
       			$scope.showLoading();
				LocalFactory.removeRebanhoLocal(rebanho);
				$rootScope.rebanhosLocais = LocalFactory.getRebanhosLocal();
				$scope.testaVazio();
				$scope.hideLoading();		
     		} else {
	       		
    	 	}
   		});		
	};	

	//faz o upload de um rebanho para o servidor
	$scope.atualizarServidor = function(rebanho){
		$scope.rebanhoFuncao = rebanho;
		if ($rootScope.online == true) {
			if ($rootScope.usuario.permissao == 'ROLE_PECUARISTA'){				
				CaprioviService.getFazendas($rootScope.usuario.id)
				.then(function(response){		
					$rootScope.fazendas = response.data;															
				});				
				$ionicPopup.show({
				  template: '<style>.popup { width:500px; }</style><label class="item item-select"><select ng-model = "rebanhoFuncao.fazenda" ng-options = "fazenda.nome for fazenda in fazendas" ng-required = "true"><option value="" disabled selected>Fazenda</option></select></label>',
				  title: 'Escolha a fazenda à qual pertence esse rebanho',				  
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
				     	if ($scope.rebanhoFuncao.fazenda != null) {
					     	$scope.sincronizando("Sincronizando",'<div align = "center"><img src = "img/gif.gif"></div>');
							CaprioviService.postRebanho($scope.rebanhoFuncao)
							.then(function(response){				
								if(response.status == 200){
									LocalFactory.removeRebanhoLocal(rebanho);
									$scope.testaVazio();
									showLoadingMensage.close();														
									$scope.opcoes();
									$scope.mensagemSincronismo();	
									$ionicPopup.close();									
								}else{
									showLoadingMensage.close();				
									$scope.modal('Erro ao sincronizar seus dados', 'Tente novamente!');					
									return;
								}
							}); 
						}else{							
							$scope.modal('Erro ao sincronizar seus dados', 'Você precisa selecionar a fazenda à qual esse rebanho pertence');	
						}   	
				     }
				   }
				  ]
				});
			}else{
				$scope.sincronizando("Sincronizando",'<div align = "center"><img src = "img/gif.gif"></div>');
				$scope.rebanhoFuncao.fazenda = $rootScope.usuario.fazenda;
				CaprioviService.postRebanho($scope.rebanhoFuncao)
				.then(function(response){				
					if(response.status == 200){
						LocalFactory.removeRebanhoLocal(rebanho);
						$scope.testaVazio();
						showLoadingMensage.close();
						$scope.opcoes();
						$scope.mensagemSincronismo();			
					}else{
						showLoadingMensage.close();			
						$scope.modal('Erro ao sincronizar seus dados', 'Tente novamente!');					
						return;
					}
				});
			}			
		}else{			
			$scope.modal("Sem conexão","Você não possui conexão com a internet para sincronizar seus dados com o servidor!");
		}
	};
}])

.controller('cadastroRebanhoCtrl', ['$scope', '$stateParams', '$ionicLoading','CaprioviService','$state',
'$rootScope', '$ionicPopup', 'CaprioviFactory', 'LocalFactory',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $ionicLoading, CaprioviService, $state, $rootScope, $ionicPopup, CaprioviFactory, LocalFactory) {			

	var adicionar;	
	var ids = [];		
		

	//Verifica se o usuário está atualizando ou adicionando
	if (CaprioviFactory.getRebanho() == null) {
		adicionar = true;
	}else{
		adicionar = false;		
		$scope.rebanho = CaprioviFactory.getRebanho();						

		if ($scope.rebanho.criacao == 'CRIACAO_CAPRINO') {
			$scope.rebanho.criacao = "Caprinos";
		}else if($scope.rebanho.criacao == 'CRIACAO_OVINO'){
			$scope.rebanho.criacao = "Ovinos";
		}else if ($scope.rebanho.criacao == 'CRIACAO_AMBOS') {
			$scope.rebanho.criacao = "Ambos";
		};

		if ($scope.rebanho.manejo == 'MANEJO_INTENSIVO') {
			$scope.rebanho.manejo = "Intensivo";
		}else if($scope.rebanho.manejo == 'MANEJO_EXTENSIVO'){
			$scope.rebanho.manejo = "Extensivo";
		}else if ($scope.rebanho.manejo == 'MANEJO_SEMI') {
			$scope.rebanho.manejo = "Semi-intensivo";
		};

		if ($scope.rebanho.finalidade == 'FINALIDADE_CARNE') {
			$scope.rebanho.producao = "Carne";
		}else if($scope.rebanho.finalidade == 'FINALIDADE_LEITE'){
			$scope.rebanho.producao = "Leite";
		}else if ($scope.rebanho.finalidade == 'FINALIDADE_MISTO') {
			$scope.rebanho.producao = "Misto";
		};
	}		

	$scope.idsFazendas = function(){
		if ($rootScope.usuario.permissao == 'ROLE_PECUARISTA') {		
			for(var i = 0; i < $rootScope.fazendas.length; i++){		
				ids.push($rootScope.fazendas[i].id);					
			}
		}else{
			ids.push($rootScope.usuario.fazenda.id);
		}		
	};	

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

	$scope.redirecionamentoRebanhos = function(){				
		$scope.idsFazendas();
		CaprioviService.getRebanhos(ids)
		.then(function(response){
			$scope.hideLoading();
			if (response.status == 200) {
				$rootScope.rebanhos = response.data;					
				$state.go('opcoes.rebanhos');									
			}else if(response.status == -1){
				$state.go('opcoes.rebanhos');
			}
		});
	};

	$scope.rebanhos = function(){
		if ($rootScope.online == true) {
			if ($rootScope.usuario.permissao == 'ROLE_PECUARISTA') {
		  		CaprioviService.getFazendas($rootScope.usuario.id)
				.then(function(response){
					if (response.status == 200) {			 		
						$scope.redirecionamentoRebanhos();
					}else if(response.status == -1){
						$scope.hideLoading();
						$state.go('opcoes.rebanhos');
					}								
				});
		  	}else{  			 		
				$scope.redirecionamentoRebanhos();
	  		}
		}else{
			$scope.hideLoading();
			$state.go('opcoes.rebanhos');
		}
	};

	$scope.cancelar = function(){		
  		$scope.showLoading(); 
  		$scope.rebanhos();  				
  	};  	  		  	

  	//cadastra um rebanhos local ou online
  	$scope.cadastrar = function (rebanho){  	

  		if ($rootScope.usuario.permissao == 'ROLE_FUNCIONARIO') {
			rebanho.fazenda = $rootScope.usuario.fazenda;
		};

  		if (rebanho.criacao == "Caprinos") {
			rebanho.criacao = 1;
		}else if(rebanho.criacao == "Ovinos"){
			rebanho.criacao = 2;
		}else if(rebanho.criacao == "Ambos"){
			rebanho.criacao = 3;
		};

		if (rebanho.manejo == "Extensivo") {
			rebanho.manejo = 2;
		}else if(rebanho.manejo == "Semi-intensivo"){
			rebanho.manejo = 3;
		}else if(rebanho.manejo == "Intensivo"){
			rebanho.manejo = 1;
		};

		if (rebanho.producao == "Carne") {
			rebanho.producao = 1;
		}else if(rebanho.producao == "Leite"){
			rebanho.producao = 2;
		}else if(rebanho.producao == "Misto"){
			rebanho.producao = 3;
		};	

		$scope.showLoading();

  		if(adicionar == true){  
  			if ($rootScope.online == true) {
  				CaprioviService.postRebanho(rebanho)
				.then(function(response){
					if(response.status == 200){
						$scope.rebanhos();
					}else{
						$scope.hideLoading();
						$scope.modal('Erro ao cadastrar seu rebanho', 'Tente novamente!');					
						return;
					}
				});
  			}else{
  				LocalFactory.addRebanhoLocal(rebanho);
				$scope.hideLoading();										
				$state.go('opcoes.rebanhos');
  			}			
						
  		}else{  
  			if ($rootScope.online == true) {			
	  			CaprioviService.updateRebanho(rebanho)
				.then(function(response){
					if(response.status == 200){
						$scope.rebanhos();
					}else{
						$scope.hideLoading();
						$scope.modal('Erro ao atualizar seu rebanho', 'Tente novamente!');					
						return;
					}
				});
			}else{
				for(var i = 0; i < LocalFactory.getRebanhosLocal().length; i++){
					if (LocalFactory.getRebanhosLocal()[i] == CaprioviFactory.getRebanho()) {
						LocalFactory.getRebanhosLocal()[i] = rebanho;
						$scope.hideLoading();
						$state.go('opcoes.rebanhos');
					}							
				}
			}
  		}	

	}			  	

}])