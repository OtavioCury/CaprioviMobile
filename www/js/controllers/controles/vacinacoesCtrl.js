angular.module('app.controllers')

.controller('vacinacoesCtrl', ['$scope', '$stateParams', '$ionicLoading','CaprioviService','$state',
'$rootScope', '$ionicPopup', 'CaprioviFactory', 'LocalFactory','$timeout',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $ionicLoading, CaprioviService, $state, $rootScope, $ionicPopup, CaprioviFactory, LocalFactory, $timeout) {

	//coloca as vacinações locais em um array
	$rootScope.vacinacoesLocal = LocalFactory.getVacinacoesLocal();
	$scope.vazio = false;
	if ($rootScope.vacinacoesLocal.length == 0) {
		$scope.vazio = true;
	};
	$scope.sincronismoSucesso = false;
	var showLoadingMensage;
	//ids das fazendas
	var idsF = [];		

	var animaisSelecionados = [];

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

	$scope.animaisSel = function(animal){
		
		var presente = false;		

		for(var i = 0; i < animaisSelecionados.length; i++){		
			if (animaisSelecionados[i].id == animal.id) {
				presente = true;
				animaisSelecionados.splice(i, 1);	
				animal.marcado = false;			
			};			
		}
		if (presente == false) {
			animaisSelecionados.push(animal);
			animal.marcado = true;
		};
		
	};

	$scope.testaVazio = function(){
		$rootScope.vacinacoesLocal = LocalFactory.getVacinacoesLocal();
		$scope.vazio = false;
		if ($rootScope.vacinacoesLocal.length == 0) {
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
		$scope.idsFazendas();
		CaprioviService.getAnimais(idsF)
		.then(function(response){
			if (response.data != null) {
				$scope.hideLoading();
				$rootScope.animais = response.data;	
				$scope.carregaMedicamentos();																														
			}
		});
	};

	//deleta uma vacinação armazenada localmente
	$scope.deletarLocal = function(vacinacao){
		var confirmPopup = $ionicPopup.confirm({
     		title: 'Você tem certeza que deseja deletar essa vacinação?',
     		template: 'Ao deletar essa vacinação, todos os outros dados ligados à ela serão deletados também',
	     	cancelText: 'Cancelar',
        	okText: 'Deletar'		
   		});
   		confirmPopup.then(function(res) {
     		if(res) {       			
       			$scope.showLoading();
				LocalFactory.removeVacinacaoLocal(vacinacao);
				$rootScope.vacinacoesLocal = LocalFactory.getVacinacoesLocal();
				$scope.testaVazio();
				$scope.hideLoading();		
     		} else {
	       		
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
				$state.go('cadastroVacinacao');										
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
				});
			}else{
				$scope.carregaAnimais();
				$scope.carregaMedicamentos();														
			}
		}else{
			$scope.hideLoading();
			$state.go('cadastroVacinacao');										
		}
	};

	//função que redireciona para a página de adicionar vacinação
	$scope.adicionar = function(){		
		CaprioviFactory.setVacinacao(null);
		$scope.carregaFazendas();
	};

	//função que redireciona para a página de atualizar vacinação
	$scope.atualizar = function(vacinacao){		
		CaprioviFactory.setVacinacao(vacinacao);
		$scope.carregaFazendas();
	};

	//redireciona para a listagem de controles
	$scope.redirecionaVacinacao = function(){
		$scope.idsFazendas();							
		CaprioviService.getControle(idsF)
		.then(function(response){
			$scope.hideLoading();							
			$rootScope.controles = response.data;				
			$state.go('opcoes.controles');
		});
	};

	//mostra um caixa de mensagem na tela do aplicativo
	$scope.sincronizando = function(title, template){
		showLoadingMensage = $ionicPopup.show({
     		title: title,
     		template: template
   		});   		
	};

	//atualiza a lista de controles
	$scope.atualizarList = function(){
		$scope.showLoading();  		
		$scope.vacinacaoList();
		$scope.$broadcast('scroll.refreshComplete');
	};

	$scope.vacinacaoList = function(){

		if ($rootScope.online == true) {
			var id;

			if ($rootScope.usuario.permissao == 'ROLE_PECUARISTA') {
				id = $rootScope.usuario.id;
			} else{
				id = $rootScope.usuario.fazenda.pecuarista.id;
			};
			
		  	CaprioviService.getVacinacao(id)
			.then(function(response){			
				$rootScope.vacinacoes = response.data;
				$scope.hideLoading();
				$state.go('opcoes.vacinacoes');								
			});
		}else{
			$scope.hideLoading();
			$state.go('opcoes.vacinacoes');
		}
		
	};

	//função que deleta um controle de parasita
	$scope.deletar = function(vacinacao){
		var confirmPopup = $ionicPopup.confirm({
     		title: 'Você tem certeza que deseja deletar este controle parasitário?',
     		template: 'Ao deletar este controle, todos os dados ligados à ele serão também deletados',
     		cancelText: 'Cancelar',
        	okText: 'Deletar'
   		});

   		confirmPopup.then(function(res) {
     		if(res) {       			
       			$scope.showLoading();  		
				CaprioviService.deleteVacinacao(vacinacao.id)
				.then(function(response){
					if (response.status == 200) {
						$scope.vacinacaoList();
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

	//faz o upload de uma vacinação para o servidor
	$scope.atualizarServidor = function(vacinacao){
		$scope.vacinacaoFuncao = vacinacao;
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
				  template: '<style>.popup { width:500px; }</style><label class="item item-select"><select ng-model = "vacinacaoFuncao.medicamento" ng-options = "medicamento.nome for medicamento in medicamentos" ng-required = "true"><option value="" disabled selected>Medicamentos</option></select></label><div class="spacer" style="width: 300px; height: 22px;"></div>' +
				  '<label class="item item-select"><ion-checkbox ng-repeat = "animal in animais" ng-model="animaisSelecionados" ng-change="animaisSel(animal)" ng-checked="animal.marcado" >{{animal.nomeNumero}}</ion-checkbox></label><div class="spacer" style="width: 300px; height: 18px;"></div>',
				  title: 'Escolha os animais e o medicamento utilizando nessa vacinação',				  
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
				     	if ((animaisSelecionados.length > 0) && $scope.vacinacaoFuncao.medicamento != null) {
					     	$scope.sincronizando("Sincronizando",'<div align = "center"><img src = "img/gif.gif"></div>');
					     	if ($rootScope.usuario.permissao == 'ROLE_PECUARISTA') {
								$scope.vacinacaoFuncao.usuario = $rootScope.usuario;
							} else{
								$scope.vacinacaoFuncao.usuario = $rootScope.usuario.fazenda.pecuarista;
							};
					     	for (var i = 0; i < animaisSelecionados.length; i++) {
								delete animaisSelecionados[i].marcado;
							};		

							$scope.vacinacaoFuncao.animais = animaisSelecionados;
							CaprioviService.postVacinacao($scope.vacinacaoFuncao)
							.then(function(response){				
								if(response.status == 200){
									LocalFactory.removeVacinacaoLocal(vacinacao);
									$scope.testaVazio();
									showLoadingMensage.close();											
									$scope.vacinacaoList();
									$scope.mensagemSincronismo();		
									$ionicPopup.close();		
								}else{
									showLoadingMensage.close();
									$scope.modal('Erro ao sincronizar seus dados', 'Tente novamente!');					
									return;
								}
							}); 
						}else{
							$scope.modal('Erro ao sincronizar seus dados', 'Você precisa selecionar o medicamento e pelo menos um animal para sincronizar essa vacinação');
						}    	
				     }
				   }
				  ]
				});			
		}else{			
			$scope.modal("Sem conexão","Você não possui conexão com a internet para sincronizar seus dados com o servidor!");
		};
	};
}])

.controller('cadastroVacinacaoCtrl', ['$scope', '$stateParams', '$ionicLoading','CaprioviService','$state',
'$rootScope', '$ionicPopup', 'CaprioviFactory', 'LocalFactory',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $ionicLoading, CaprioviService, $state, $rootScope, $ionicPopup, CaprioviFactory, LocalFactory) {

	var adicionar;	
	var idsF = [];	
	var animaisSelecionados = [];	
	$scope.vacinacaoLocal = {};

	//testa se o usuário está cadastrando ou atualizando uma vacinação
	if (CaprioviFactory.getVacinacao() == null) {
		adicionar = true;								
	}else{				
		$scope.vacinacao = CaprioviFactory.getVacinacao();	
		$scope.vacinacao.data = new Date($scope.vacinacao.data);
		animaisSelecionados = $scope.vacinacao.animais;					

		for(var i = 0; i < $scope.vacinacao.animais.length; i++){									
			for(var j = 0; j < $rootScope.animais.length; j++){									
				if ($scope.vacinacao.animais[i].id == $rootScope.animais[j].id) {
					$rootScope.animais[j].marcado = true;
				};					
			}			
		}		

		for(var i = 0; i < animaisSelecionados.length; i++){									
			animaisSelecionados[i].marcado = true;			
		}					
	}			

	$scope.animaisSel = function(animal){
		
		var presente = false;		

		for(var i = 0; i < animaisSelecionados.length; i++){		
			if (animaisSelecionados[i].id == animal.id) {
				presente = true;
				animaisSelecionados.splice(i, 1);	
				animal.marcado = false;			
			};			
		}
		if (presente == false) {
			animaisSelecionados.push(animal);
			animal.marcado = true;
		};
		
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

	//função chamada pelo botão cancelar do cadastro de vacinação
	$scope.cancelar = function(){		
  		$scope.showLoading();  
  		$scope.vacinacaoList();		
  	};  	

	$scope.vacinacaoList = function(){
		if ($rootScope.online == true) {
			var id;

			if ($rootScope.usuario.permissao == 'ROLE_PECUARISTA') {
				id = $rootScope.usuario.id;
			} else{
				id = $rootScope.usuario.fazenda.pecuarista.id;
			};
			
		  	CaprioviService.getVacinacao(id)
			.then(function(response){			
				$rootScope.vacinacoes = response.data;
				$scope.hideLoading();
				$state.go('opcoes.vacinacoes');								
			});
		}else{
			$scope.hideLoading();
			$state.go('opcoes.vacinacoes');
		}
	};

  	//função chamada pelo botão salvar do cadastro de vacinação
  	$scope.cadastrar = function (vacinacao){  	
  		  	
		$scope.showLoading();

		for (var i = 0; i < animaisSelecionados.length; i++) {
			delete animaisSelecionados[i].marcado;
		};		

		vacinacao.animais = animaisSelecionados;

		if ($rootScope.usuario.permissao == 'ROLE_PECUARISTA') {
			vacinacao.usuario = $rootScope.usuario;
		} else{
			vacinacao.usuario = $rootScope.usuario.fazenda.pecuarista;
		};

  		if(adicionar == true){
  			if ($rootScope.online == true) {
  				$scope.vacinacaoLocal = vacinacao;
  				CaprioviService.postVacinacao(vacinacao)
				.then(function(response){
					if(response.status == 200){
						$scope.vacinacaoList();
					}else{
						$scope.hideLoading();
						$scope.modal('Erro ao cadastrar a vacinação', 'Tente novamente!');					
						return;
					}
				});
  			}else{
  				LocalFactory.addVacinacaoLocal(vacinacao);
				$scope.hideLoading();										
				$state.go('opcoes.vacinacoes');
  			}			
			
  		}else{
  			if ($rootScope.online == true) {
	  			CaprioviService.updateVacinacao(vacinacao)
				.then(function(response){
					if(response.status == 200){
						$scope.vacinacaoList();
					}else{
						$scope.hideLoading();
						$scope.modal('Erro ao atualizar a vacinação', 'Tente novamente!');					
						return;
					}
				});
			}else{
				for(var i = 0; i < LocalFactory.getVacinacoesLocal().length; i++){
					if (LocalFactory.getVacinacoesLocal()[i] == CaprioviFactory.getVacinacao()) {
						LocalFactory.getVacinacoesLocal()[i] = vacinacao;
						$scope.hideLoading();
						$state.go('opcoes.vacinacoes');
					}							
				}
			}
  		}	

	}

}])   