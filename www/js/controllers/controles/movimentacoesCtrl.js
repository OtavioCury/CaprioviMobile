angular.module('app.controllers')

.controller('movimentacoesCtrl', ['$scope', '$stateParams', '$ionicLoading', 'CaprioviService', '$state', '$rootScope'
, '$ionicPopup', 'CaprioviFactory', 'LocalFactory', '$timeout',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $ionicLoading, CaprioviService, $state, $rootScope, $ionicPopup, CaprioviFactory, LocalFactory, $timeout) {

	//coloca os manejos locais em um array
	$rootScope.movimentacoesLocal = LocalFactory.getMovimentacoesLocal();
	$scope.vazio = false;
	if ($rootScope.movimentacoesLocal.length == 0) {
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

	/* LOADING FUNCTION */
	$scope.showLoading = function() {
		$ionicLoading.show()
	};

	$scope.hideLoading = function(){
		$ionicLoading.hide();
	};

	$scope.testaVazio = function(){
		$rootScope.movimentacoesLocal = LocalFactory.getMovimentacoesLocal();
		$scope.vazio = false;
		if ($rootScope.movimentacoesLocal.length == 0) {
			$scope.vazio = true;
		};
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
				$state.go('cadastroMovimentacao');									
			}
		});
	};

	//deleta uma movimentação armazenada localmente
	$scope.deletarLocal = function(movimentacao){
		var confirmPopup = $ionicPopup.confirm({
     		title: 'Você tem certeza que deseja deletar essa movimentação?',
     		template: 'Ao deletar esse movimentação, todos os outros dados ligados à ela serão deletados também',
	     	cancelText: 'Cancelar',
        	okText: 'Deletar'		
   		});
   		confirmPopup.then(function(res) {
     		if(res) {       			
       			$scope.showLoading();
				LocalFactory.removeMovimentacaoLocal(movimentacao);
				$rootScope.movimentacoesLocal = LocalFactory.getMovimentacoesLocal();
				$scope.testaVazio();
				$scope.hideLoading();		
     		} else {
	       		
    	 	}
   		});		
	};

	//função que redireciona para a página de adicionar movimentação
	$scope.adicionar = function(){		
		CaprioviFactory.setMovimentacao(null);
		$scope.carregaFazendas();
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
			}
		}else{
			$scope.hideLoading();
			$state.go('cadastroMovimentacao');	
		}
	};

	//função que redireciona para a página de atualizar movimentação
	$scope.atualizar = function(movimentacao){		
		CaprioviFactory.setMovimentacao(movimentacao);
		$scope.carregaFazendas();
	};

	//redireciona para a listagem de movimentações
	$scope.redirecionaMovimentacao = function(){
		$scope.idsFazendas();							
		CaprioviService.getMovimentacao(idsF)
		.then(function(response){
			$scope.hideLoading();							
			$rootScope.movimentacoes = response.data;				
			$state.go('opcoes.movimentacoes');
		});
	};

	$scope.movimentacaoList = function(){
		if ($rootScope.online == true) {
			if ($rootScope.usuario.permissao == 'ROLE_PECUARISTA') {
				CaprioviService.getFazendas($rootScope.usuario.id)
				.then(function(response){			
					$rootScope.fazendas = response.data;
					$scope.redirecionaMovimentacao();						
				});
			}else{
				$scope.redirecionaMovimentacao();						
			}
		}else{
			$scope.hideLoading();
			$state.go('opcoes.movimentacoes');
		}
	};

	//atualiza a lista de manejos
	$scope.atualizarList = function(){
		$scope.showLoading();  		
		$scope.movimentacaoList();
		$scope.$broadcast('scroll.refreshComplete');
	};

	//função que deleta uum manejo
	$scope.deletar = function(movimentacao){
		var confirmPopup = $ionicPopup.confirm({
     		title: 'Você tem certeza que deseja deletar esta movimentação?',
     		template: 'Ao deletar esta movimentação, todos os dados ligados à ele serão também deletados',
     		cancelText: 'Cancelar',
        	okText: 'Deletar'
   		});

   		confirmPopup.then(function(res) {
     		if(res) {       			
       			$scope.showLoading();  		
				CaprioviService.deleteMovimentacao(movimentacao.id)
				.then(function(response){
					if (response.status == 200) {
						$scope.movimentacaoList();
					}		
				});		
     		} else {
	       		
    	 	}
   		});
	};

	//mostra um caixa de mensagem na tela do aplicativo
	$scope.sincronizando = function(title, template){
		showLoadingMensage = $ionicPopup.show({
     		title: title,
     		template: template
   		});   		
	};

	//mostra um modal na tela do aplicativo
	$scope.modal = function(title, template){
		var alertPopup = $ionicPopup.alert({
     		title: title,
     		template: template
   		});   		
	};

	//faz o upload de uma movimentação para o servidor
	$scope.atualizarServidor = function(movimentacao){
		$scope.movimentacaoFuncao = movimentacao;
		if ($rootScope.online == true) {
			$scope.showLoading();
			if ($rootScope.usuario.permissao == 'ROLE_PECUARISTA'){				
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
				$scope.idsFazendas();				
				CaprioviService.getAnimais(idsF)
				.then(function(response){
					if (response.data != null) {
						$rootScope.animais = response.data;																					
					}																																														
				});
			}

			$scope.hideLoading();

				$ionicPopup.show({
				  template: '<style>.popup { width:500px; }</style><label class="item item-select"><select ng-model = "movimentacaoFuncao.animal" ng-options = "animal.nomeNumero for animal in animais" ng-required = "true"><option value="" disabled selected>Animal</option></select></label><div class="spacer" style="width: 300px; height: 22px;"></div>',
				  title: 'Escolha o animal dessa movimentação',				  
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
				     	if ($scope.movimentacaoFuncao.animal != null) {
					     	$scope.sincronizando("Sincronizando",'<div align = "center"><img src = "img/gif.gif"></div>');
							CaprioviService.postMovimentacao($scope.movimentacaoFuncao)
							.then(function(response){				
								if(response.status == 200){
									LocalFactory.removeMovimentacaoLocal(movimentacao);
									$scope.testaVazio();
									showLoadingMensage.close();														
									$scope.movimentacaoList();
									$scope.mensagemSincronismo();
									$ionicPopup.close();		
								}else{
									showLoadingMensage.close();
									$scope.modal('Erro ao sincronizar seus dados', 'Tente novamente!');					
									return;
								}
							});
						}else{							
							$scope.modal('Erro ao sincronizar seus dados', 'Você precisa selecionar o animal para sincronizar essa movimentação');
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

.controller('cadastroMovimentacaoCtrl', ['$scope', '$stateParams', '$ionicLoading','CaprioviService','$state',
'$rootScope', '$ionicPopup', 'CaprioviFactory', 'LocalFactory',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $ionicLoading, CaprioviService, $state, $rootScope, $ionicPopup, CaprioviFactory, LocalFactory) {

	var adicionar;	
	var idsF = [];	
	$scope.movimento = {};

	//testa se o usuário está cadastrando ou atualizando uma movimentação
	if (CaprioviFactory.getMovimentacao() == null) {
		adicionar = true;
	}else{
		adicionar = false;
		$scope.movimentacao = CaprioviFactory.getMovimentacao();
		$scope.movimentacao.data = new Date($scope.movimentacao.data);				

		if ($scope.movimentacao.motivoSaida == 'MOTIVO_VENDA') {
			$scope.movimentacao.motivoSaida = "Venda";
		}else if($scope.movimentacao.motivoSaida == 'MOTIVO_MORTE'){
			$scope.movimentacao.motivoSaida = "Morte";
		}else if($scope.movimentacao.motivoSaida == 'MOTIVO_ROUBO'){
			$scope.movimentacao.motivoSaida = "Roubo";
		}else if($scope.movimentacao.motivoSaida == 'MOTIVO_ALIMENTACAO'){
			$scope.movimentacao.motivoSaida = "Alimentação";
		}else if($scope.movimentacao.motivoSaida == 'MOTIVO_EMPRESTIMO'){
			$scope.movimentacao.motivoSaida = "Emprestimo";
		}else if($scope.movimentacao.motivoSaida == 'MOTIVO_OUTROS'){
			$scope.movimentacao.motivoSaida = "Outros";
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

	//função chamada pelo botão cancelar do cadastro de movimentações
	$scope.cancelar = function(){		
  		$scope.showLoading();  
  		$scope.movimentosList();		
  	};

  	//redireciona para a listagem de movimentações
	$scope.redirecionaMovimentacao = function(){
		$scope.idsFazendas();							
		CaprioviService.getMovimentacao(idsF)
		.then(function(response){
			$scope.hideLoading();							
			$rootScope.movimentacoes = response.data;				
			$state.go('opcoes.movimentacoes');
		});
	};

	$scope.movimentosList = function(){
		if ($rootScope.online == true) {
			if ($rootScope.usuario.permissao == 'ROLE_PECUARISTA') {
				CaprioviService.getFazendas($rootScope.usuario.id)
				.then(function(response){			
					$rootScope.fazendas = response.data;
					$scope.redirecionaMovimentacao();						
				});
			}else{
				$scope.redirecionaMovimentacao();						
			}
		}else{
			$scope.hideLoading();
			$state.go('opcoes.movimentacoes');
		}
	};

  	//função chamada pelo botão salvar do cadastro de movimentação
  	$scope.cadastrar = function (movimentacao){  	
  		
  		if (movimentacao.motivoSaida == 'Venda') {
			movimentacao.motivoSaida = 1;
		}else if(movimentacao.motivoSaida == 'Morte'){
			movimentacao.motivoSaida = 2;
		}else if(movimentacao.motivoSaida == 'Roubo'){
			movimentacao.motivoSaida = 3;
		}else if(movimentacao.motivoSaida == 'Alimentação'){
			movimentacao.motivoSaida = 4;
		}else if(movimentacao.motivoSaida == 'Emprestimo'){
			movimentacao.motivoSaida = 5;
		}else if(movimentacao.motivoSaida == 'Outros'){
			movimentacao.motivoSaida = 6;
		}

		$scope.showLoading();

  		if(adicionar == true){
  			if ($rootScope.online == true) {
  				$scope.movimento = movimentacao;
  				CaprioviService.postMovimentacao(movimentacao)
				.then(function(response){
					if(response.status == 200){
						$scope.movimentosList();
					}else{
						$scope.hideLoading();
						$scope.modal('Erro ao cadastrar a movimentação', 'Tente novamente!');					
						return;
					}
				});
  			}else{
  				LocalFactory.addMovimentacaoLocal(movimentacao);
				$scope.hideLoading();										
				$state.go('opcoes.movimentacoes');
  			}  			
  		}else{
  			if ($rootScope.online == true) {
	  			CaprioviService.updateMovimentacao(movimentacao)
				.then(function(response){
					if(response.status == 200){
						$scope.movimentosList();
					}else{
						$scope.hideLoading();
						$scope.modal('Erro ao atualizar a movimentação', 'Tente novamente!');					
						return;
					}
				});
			}else{
				for(var i = 0; i < LocalFactory.getMovimentacoesLocal().length; i++){
					if (LocalFactory.getMovimentacoesLocal()[i] == CaprioviFactory.getMovimentacao()) {
						LocalFactory.getMovimentacoesLocal()[i] = movimentacao;
						$scope.hideLoading();
						$state.go('opcoes.movimentacoes');
					}							
				}
			}
  		}	

	}

}])