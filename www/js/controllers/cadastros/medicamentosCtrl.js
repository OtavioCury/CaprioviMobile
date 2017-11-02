angular.module('app.controllers')

.controller('medicamentosCtrl', ['$scope', '$stateParams', '$ionicLoading','CaprioviService','$state',
'$rootScope', '$ionicPopup', 'CaprioviFactory', 'LocalFactory','$timeout',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $ionicLoading, CaprioviService, $state, $rootScope, $ionicPopup, CaprioviFactory, LocalFactory, $timeout) {

	$rootScope.medicamentosLocais = LocalFactory.getMedicamentosLocal();
	$scope.vazio = false;
	if ($rootScope.medicamentosLocais.length == 0) {
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
		$rootScope.medicamentosLocais = LocalFactory.getMedicamentosLocal();
		$scope.vazio = false;
		if ($rootScope.medicamentosLocais.length == 0) {
			$scope.vazio = true;
		};
	};

	//adiciona um medicamento
	$scope.adicionar = function(){				
		CaprioviFactory.setMedicamento(null);		
		$state.go('cadastroMedicamento');
	};

	//mostra um caixa de mensagem na tela do aplicativo
	$scope.sincronizando = function(title, template){
		showLoadingMensage = $ionicPopup.show({
     		title: title,
     		template: template
   		});   		
	}

	//atualiza um medicamento
	$scope.atualizar = function(medicamento){		
		CaprioviFactory.setMedicamento(medicamento);					
		$state.go('cadastroMedicamento');
	};

	$scope.modal = function(title, template){
		var alertPopup = $ionicPopup.alert({
     		title: title,
     		template: template
   		});   		
	}	

	$scope.listagem = function(){
		if ($rootScope.online == true) {
			$scope.usuarioMetodo = {};
			if ($rootScope.usuario.permissao == 'ROLE_PECUARISTA') {
				$scope.usuarioMetodo = $rootScope.usuario;
			}else{
				$scope.usuarioMetodo = $rootScope.usuario.fazenda.pecuarista;
			}
			CaprioviService.getMedicamento($scope.usuarioMetodo.id)
			.then(function(response){
				$scope.hideLoading();
				if (response.data != null) {									
					$rootScope.medicamentos = response.data;	
					$state.go('opcoes.medicamentos');																				
				}
			});
		}else{
			$scope.hideLoading();
			$state.go('opcoes.medicamentos');
		}
	};

	//atualiza a listagem dos medicamentos
	$scope.atualizarList = function(){
		$scope.showLoading();
		$scope.listagem();
		$scope.$broadcast('scroll.refreshComplete');
	};	

	//deleta um medicamento
	$scope.deletar = function(medicamento){
		var confirmPopup = $ionicPopup.confirm({
     		title: 'Você tem certeza que deseja deletar este medicamento?',
     		template: 'Ao deletar este medicamento, todas as informações ligadas à ela serão também deletadas',
     		cancelText: 'Cancelar',
        	okText: 'Deletar'
   		});

   		confirmPopup.then(function(res) {
     		if(res) {       			
       			$scope.showLoading();  		
				CaprioviService.deleteMedicamento(medicamento.id)
				.then(function(response){
					if (response.status == 200) {						
						$scope.listagem();
					}else{
						$scope.hideLoading();
						$scope.modal('Não foi possível deletar este medicamento!', 'Tente novamente.');
					}		
				});		
     		} else {
	       		
    	 	}
   		});
	};

	//deleta um medicamento armazenada localmente
	$scope.deletarLocal = function(medicamento){
		var confirmPopup = $ionicPopup.confirm({
     		title: 'Você tem certeza que deseja deletar esse medicamento?',
     		template: 'Ao deletar essa medicamento, todos os dados ligados à ela serão deletados também',
	     	cancelText: 'Cancelar',
        	okText: 'Deletar'		
   		});
   		confirmPopup.then(function(res) {
     		if(res) {       			
       			$scope.showLoading();
				LocalFactory.removeMedicamentoLocal(medicamento);
				$rootScope.medicamentosLocais = LocalFactory.getMedicamentosLocal();
				$scope.testaVazio();
				$scope.hideLoading();		
     		} else {
	       		
    	 	}
   		});		
	};

	//faz o upload de um medicamento para o servidor
	$scope.atualizarServidor = function(medicamento){
		if ($rootScope.online == true) {
			$scope.sincronizando("Sincronizando",'<div align = "center"><img src = "img/gif.gif"></div>');
			if ($rootScope.usuario.permissao == 'ROLE_PECUARISTA') {
				medicamento.usuario = $rootScope.usuario;
			}else{
				medicamento.usuario = $rootScope.usuario.fazenda.pecuarista;
			}
			CaprioviService.postMedicamento(medicamento)
			.then(function(response){				
				if(response.status == 200){
					LocalFactory.removeMedicamentoLocal(medicamento);
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
   
.controller('cadastroMedicamentoCtrl', ['$scope', '$stateParams', '$ionicLoading','CaprioviService','$state',
'$rootScope', '$ionicPopup', 'CaprioviFactory', 'LocalFactory',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $ionicLoading, CaprioviService, $state, $rootScope, $ionicPopup, CaprioviFactory, LocalFactory) {

	var adicionar;		

	if (CaprioviFactory.getMedicamento() == null) {
		adicionar = true;
	}else{
		adicionar = false;		
		$scope.medicamento = CaprioviFactory.getMedicamento();								
	}

	$scope.modal = function(title, template){
		var alertPopup = $ionicPopup.alert({
     		title: title,
     		template: template
   		});   		
	}

	$scope.redirecionaMedicamento = function(){
		if ($rootScope.online == true) {
			$scope.usuarioMetodo = {};
			if ($rootScope.usuario.permissao == 'ROLE_PECUARISTA') {
				$scope.usuarioMetodo = $rootScope.usuario;
			}else{
				$scope.usuarioMetodo = $rootScope.usuario.fazenda.pecuarista;
			}
			CaprioviService.getMedicamento($rootScope.usuario.id)
			.then(function(response){
				$scope.hideLoading();
				if (response.data != null) {									
					$rootScope.medicamentos = response.data;	
					$state.go('opcoes.medicamentos');																				
				}
			});
		}else{
			$scope.hideLoading();
			$state.go('opcoes.medicamentos');
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
  		$scope.redirecionaMedicamento();  				
  	};		  	

  	$scope.cadastrar = function (medicamento){  	  			

		$scope.showLoading();			
		
  		if(adicionar == true){
  			if ($rootScope.usuario.permissao == 'ROLE_PECUARISTA') {
				medicamento.usuario = $rootScope.usuario;
			}else{
				medicamento.usuario = $rootScope.usuario.fazenda.pecuarista;
			}

  			if ($rootScope.online == true) {						
				CaprioviService.postMedicamento(medicamento)
				.then(function(response){
					if(response.status == 200){
						$scope.redirecionaMedicamento();
					}else{
						$scope.hideLoading();
						$scope.modal('Erro ao cadastrar o medicamento', 'Tente novamente!');					
						return;
					}
				});
  			}else{
  				LocalFactory.addMedicamentoLocal(medicamento);
				$scope.hideLoading();										
				$state.go('opcoes.medicamentos');
  			}
			
  		}else{  	
  			if ($rootScope.online == true) {
	  			CaprioviService.updateMedicamento(medicamento)
				.then(function(response){
					if(response.status == 200){
						$scope.redirecionaMedicamento();
					}else{
						$scope.hideLoading();
						$scope.modal('Erro ao atualizar medicamento', 'Tente novamente!');					
						return;
					}
				});
			}else{
				for(var i = 0; i < LocalFactory.getMedicamentosLocal().length; i++){
					if (LocalFactory.getMedicamentosLocal()[i] == CaprioviFactory.getMedicamento()) {
						LocalFactory.getMedicamentosLocal()[i] = medicamento;
						$scope.hideLoading();
						$state.go('opcoes.medicamentos');
					}							
				}
			}
  		}	

	}
}])