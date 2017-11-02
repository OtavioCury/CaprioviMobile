angular.module('app.controllers')

.controller('controlesCtrl', ['$scope', '$stateParams', '$ionicLoading','CaprioviService','$state',
'$rootScope', '$ionicPopup', 'CaprioviFactory', 'LocalFactory','$timeout',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $ionicLoading, CaprioviService, $state, $rootScope, $ionicPopup, CaprioviFactory, LocalFactory, $timeout) {

	//coloca os manejos locais em um array
	$rootScope.controlesLocal = LocalFactory.getControlesLocal();
	$scope.vazio = false;
	if ($rootScope.controlesLocal.length == 0) {
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
		$rootScope.controlesLocal = LocalFactory.getControlesLocal();
		$scope.vazio = false;
		if ($rootScope.controlesLocal.length == 0) {
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

	//carrega os animais do usuário
	$scope.carregaAnimais = function(){
		$scope.idsFazendas();
		CaprioviService.getAnimais(idsF)
		.then(function(response){
			if (response.data != null) {
				$scope.hideLoading();
				$rootScope.animais = response.data;																														
			}
		});
	};

	//carrega os medicamentos do usuário
	$scope.carregaMedicamentos = function(){		
		var id;
		if ($rootScope.usuario.permissao == 'ROLE_PECUARISTA') {
			id = $rootScope.usuario.id;
		} else{
			id = $rootScope.usuario.fazenda.pecuarista.id;
		};
		CaprioviService.getMedicamento(id)
		.then(function(response){
			if (response.data != null) {
				$scope.hideLoading();
				$rootScope.medicamentos = response.data;	
				$state.go('cadastroControle');										
			}
		});
	};

	//carrega as fazendas do usuário
	$scope.carregaFazendas = function(){
		$scope.showLoading();
		if ($rootScope.online == true) {
			if ($rootScope.usuario.permissao == 'ROLE_PECUARISTA') {
				CaprioviService.getFazendas($rootScope.usuario.id)
				.then(function(response){				
					$rootScope.fazendas = response.data;																	
					$scope.carregaAnimais();
					$scope.carregaMedicamentos();														
				});
			}else{
				$scope.carregaAnimais();
				$scope.carregaMedicamentos();														
			}
		}else{
			$scope.hideLoading();
			$state.go('cadastroControle');
		}	
	};

	//função que redireciona para a página de adicionar controle
	$scope.adicionar = function(){		
		CaprioviFactory.setControle(null);
		$scope.carregaFazendas();
	};

	//função que redireciona para a página de atualizar controle
	$scope.atualizar = function(controle){		
		CaprioviFactory.setControle(controle);
		$scope.carregaFazendas();
	};

	//redireciona para a listagem de controles
	$scope.redirecionaControle = function(){
		if ($rootScope.online == true) {
			$scope.idsFazendas();							
			CaprioviService.getControle(idsF)
			.then(function(response){
				$scope.hideLoading();							
				$rootScope.controles = response.data;				
				$state.go('opcoes.controles');
			});
		}else{
			$scope.hideLoading();
			$state.go('opcoes.controles');
		}
	};


	$scope.controleList = function(){
		if ($rootScope.usuario.permissao == 'ROLE_PECUARISTA') {
			CaprioviService.getFazendas($rootScope.usuario.id)
			.then(function(response){			
				$rootScope.fazendas = response.data;
				$scope.redirecionaControle();						
			});
		}else{
			$scope.redirecionaControle();						
		}
	};

	//deleta um controle armazenada localmente
	$scope.deletarLocal = function(controle){
		var confirmPopup = $ionicPopup.confirm({
     		title: 'Você tem certeza que deseja deletar esse controle parasitário?',
     		template: 'Ao deletar esse controle, todos os outros dados ligados à ele serão deletados também',
	     	cancelText: 'Cancelar',
        	okText: 'Deletar'		
   		});
   		confirmPopup.then(function(res) {
     		if(res) {       			
       			$scope.showLoading();
				LocalFactory.removeControleLocal(controle);
				$rootScope.controlesLocal = LocalFactory.getControlesLocal();
				$scope.testaVazio();
				$scope.hideLoading();		
     		} else {
	       		
    	 	}
   		});		
	};

	//atualiza a lista de controles
	$scope.atualizarList = function(){
		$scope.showLoading();  		
		$scope.controleList();
		$scope.$broadcast('scroll.refreshComplete');
	};

	//função que deleta um controle de parasita
	$scope.deletar = function(controle){
		var confirmPopup = $ionicPopup.confirm({
     		title: 'Você tem certeza que deseja deletar este controle parasitário?',
     		template: 'Ao deletar este controle, todos os dados ligados à ele serão também deletados',
     		cancelText: 'Cancelar',
        	okText: 'Deletar'
   		});

   		confirmPopup.then(function(res) {
     		if(res) {       			
       			$scope.showLoading();  		
				CaprioviService.deleteControle(controle.id)
				.then(function(response){
					if (response.status == 200) {
						$scope.controleList();
					}		
				});		
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

	//faz o upload de um controle para o servidor
	$scope.atualizarServidor = function(controle){
		$scope.controleFuncao = controle;
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

			CaprioviService.getMedicamento($scope.usuarioMetodo.id)
			.then(function(response){
				$scope.hideLoading();
				if (response.data != null) {									
					$rootScope.medicamentos = response.data;	
				}
			});

			$scope.hideLoading();

				$ionicPopup.show({
				  template: '<style>.popup { width:500px; }</style><label class="item item-select"><select ng-model = "controleFuncao.animal" ng-options = "animal.nomeNumero for animal in animais" ng-required = "true"><option value="" disabled selected>Animal</option></select></label><div class="spacer" style="width: 300px; height: 22px;"></div>' +
				  '<label class="item item-select"><select ng-model = "controleFuncao.medicamento" ng-options = "medicamento.nome for medicamento in medicamentos" ng-required = "true"><option value="" disabled selected>Medicamento</option></select></label><div class="spacer" style="width: 300px; height: 22px;"></div>' ,
				  title: 'Escolha o animal e o medicamento desse controle parasitário',				  
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
				     	if ($scope.controleFuncao.animal != null && $scope.controleFuncao.medicamento != null) {
					     	$scope.sincronizando("Sincronizando",'<div align = "center"><img src = "img/gif.gif"></div>');
							CaprioviService.postControle($scope.controleFuncao)
							.then(function(response){				
								if(response.status == 200){
									LocalFactory.removeControleLocal(controle);
									$scope.testaVazio();
									showLoadingMensage.close();													
									$scope.controleList();
									$scope.mensagemSincronismo();	
									$ionicPopup.close();		
								}else{
									showLoadingMensage.close();
									$scope.modal('Erro ao sincronizar seus dados', 'Tente novamente!');					
									return;
								}
							});
						}else{							
							$scope.modal('Erro ao sincronizar seus dados', 'Você precisa selecionar o animal e o medicamento para sincronizar esse controle parasitário');					
							return;
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

.controller('cadastroControleCtrl', ['$scope', '$stateParams', '$ionicLoading','CaprioviService','$state',
'$rootScope', '$ionicPopup', 'CaprioviFactory', 'LocalFactory',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $ionicLoading, CaprioviService, $state, $rootScope, $ionicPopup, CaprioviFactory, LocalFactory) {

	var adicionar;	
	var idsF = [];	

	//testa se o usuário está cadastrando ou atualizando um controle
	if (CaprioviFactory.getControle() == null) {
		adicionar = true;
	}else{
		adicionar = false;
		$scope.controle = CaprioviFactory.getControle();
		$scope.controle.dataVernifugacao = new Date($scope.controle.dataVernifugacao);						
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
  		$scope.controlesList();		
  	};

  	//redireciona para a listagem de movimentações
	$scope.redirecionaControle = function(){
		$scope.idsFazendas();							
		CaprioviService.getControle(idsF)
		.then(function(response){
			$scope.hideLoading();							
			$rootScope.controles = response.data;				
			$state.go('opcoes.controles');
		});
	};

	$scope.controlesList = function(){
		if ($rootScope.online == true) {
			if ($rootScope.usuario.permissao == 'ROLE_PECUARISTA') {
				CaprioviService.getFazendas($rootScope.usuario.id)
				.then(function(response){			
					$rootScope.fazendas = response.data;
					$scope.redirecionaControle();						
				});
			}else{
				$scope.redirecionaControle();						
			}
		}else{
			$scope.hideLoading();
			$state.go('opcoes.controles');
		}
	};

  	//função chamada pelo botão salvar do cadastro de manejos
  	$scope.cadastrar = function (controle){  	
  		  	
		$scope.showLoading();

  		if(adicionar == true){  	
	  		if ($rootScope.online == true) {		
				CaprioviService.postControle(controle)
				.then(function(response){
					if(response.status == 200){
						$scope.controlesList();
					}else{
						$scope.hideLoading();
						$scope.modal('Erro ao cadastrar o controle parasitário', 'Tente novamente!');					
						return;
					}
				});
			}else{
				LocalFactory.addControleLocal(controle);
				$scope.hideLoading();										
				$state.go('opcoes.controles');
			}
  		}else{
  			if ($rootScope.online == true) {
	  			CaprioviService.updateControle(controle)
				.then(function(response){
					if(response.status == 200){
						$scope.controlesList();
					}else{
						$scope.hideLoading();
						$scope.modal('Erro ao atualizar o controle parasitário', 'Tente novamente!');					
						return;
					}
				});
			}else{
				for(var i = 0; i < LocalFactory.getControlesLocal().length; i++){
					if (LocalFactory.getControlesLocal()[i] == CaprioviFactory.getControle()) {
						LocalFactory.getControlesLocal()[i] = controle;
						$scope.hideLoading();
						$state.go('opcoes.controles');
					}							
				}
			}
  		}	

	}

}])   