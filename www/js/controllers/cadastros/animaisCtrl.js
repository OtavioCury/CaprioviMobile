angular.module('app.controllers')

.controller('animaisCtrl', ['$scope', '$stateParams', '$ionicLoading', 'CaprioviService', '$state', '$rootScope'
, '$ionicPopup', 'CaprioviFactory', 'LocalFactory','$timeout',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $ionicLoading, CaprioviService, $state, $rootScope, $ionicPopup, CaprioviFactory, LocalFactory, $timeout) {

	$rootScope.animaisLocais = LocalFactory.getAnimaisLocal();	
	$scope.vazio = false;
	$scope.maisDeUm = false;
	if ($rootScope.animaisLocais.length == 0) {
		$scope.vazio = true;
	}else if($rootScope.animaisLocais.length > 1){
		$scope.maisDeUm = true;
	};
	$scope.sincronismoSucesso = false;
	var showLoadingMensage;

	var ids = [];
	var animaisSelecionados = [];		

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

	$scope.animaisSel = function(animal){
		var presente = false;		
		for(var i = 0; i < animaisSelecionados.length; i++){		
			if (animaisSelecionados[i].nomeNumero == animal.nomeNumero) {
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

	$scope.carregaEntidades = function(){
		$scope.showLoading();
		if ($rootScope.usuario.permissao == 'ROLE_PECUARISTA') {
			CaprioviService.getRacas($rootScope.usuario.id)
			.then(function(response){
				if (response.data != null) {				
					$rootScope.racas = response.data;
					CaprioviService.getFazendas($rootScope.usuario.id)
					.then(function(response){
						$rootScope.fazendas = response.data;
						$scope.carregaRebanhos();
					});																
				}
			});
		}else{
			CaprioviService.getRacas($rootScope.usuario.fazenda.pecuarista.id)
			.then(function(response){
				if (response.data != null) {				
					$rootScope.racas = response.data;
					$scope.carregaRebanhos();																
				}
			});
		}		
	};

	$scope.modal = function(title, template){
		var alertPopup = $ionicPopup.alert({
     		title: title,
     		template: template
   		});   		
	};

	//carrega os rebanhos do usuário
	$scope.carregaRebanhos = function(){
		$scope.idsFazendas();
		CaprioviService.getRebanhos(ids)
		.then(function(response){
			if (response.data != null) {
				$scope.hideLoading();
				$rootScope.rebanhos = response.data;
				$state.go('cadastroAnimal');															
			}
		});
	};

	$scope.redirecionamentoAnimais = function(){
		$scope.idsFazendas();
		CaprioviService.getAnimais(ids)
		.then(function(response){
			if (response.data != null) {
				$scope.hideLoading();
				$rootScope.animais = response.data;												
				$state.go('opcoes.animais');									
			}
		});
	};

	$scope.animal = function(){
		if ($rootScope.usuario.permissao == 'ROLE_PECUARISTA') {
			CaprioviService.getFazendas($rootScope.usuario.id)
			.then(function(response){
				$rootScope.fazendas = response.data;
				$scope.redirecionamentoAnimais();
			});
		}else{
			$scope.redirecionamentoAnimais();
		}
	};

	$scope.testaVazio = function(){
		$rootScope.animaisLocais = LocalFactory.getAnimaisLocal();	
		$scope.vazio = false;
		$scope.maisDeUm = false;
		if ($rootScope.animaisLocais.length == 0) {
			$scope.vazio = true;
		}else if($rootScope.animaisLocais.length > 1){
			$scope.maisDeUm = true;
		};
	};

	//chama a página de adicionar um animal
	$scope.adicionar = function(){
		CaprioviFactory.setAnimal(null);
		if ($rootScope.online == true) {
			$scope.carregaEntidades();
		}else{
			$state.go('cadastroAnimal');
		}
	};

	//chama a página de atualizar um animal
	$scope.atualizar = function(animal){
		CaprioviFactory.setAnimal(animal);
		if ($rootScope.online == true) {
			$scope.carregaEntidades();
		}else{
			$state.go('cadastroAnimal');
		}
	};	

	$scope.atualizarList = function(){
		$scope.showLoading();  		
		$scope.animal();
		$scope.$broadcast('scroll.refreshComplete');
	};

	//mostra um caixa de mensagem na tela do aplicativo
	$scope.sincronizando = function(title, template){
		showLoadingMensage = $ionicPopup.show({
     		title: title,
     		template: template
   		});   		
	}

	//deleta o animal (com conexão)
	$scope.deletar = function(animal){
		var confirmPopup = $ionicPopup.confirm({
     		title: 'Você tem certeza que deseja deletar esse animal?',
     		template: 'Ao deletar esse animal, todos os dados ligados à ele serão também deletados',
     		cancelText: 'Cancelar',
        	okText: 'Deletar'
   		});

   		confirmPopup.then(function(res) {
     		if(res) {       			
       			$scope.showLoading();  		
				CaprioviService.deleteAnimal(animal.id)
				.then(function(response){
					if (response.status == 200) {
						$scope.animal();																
					}		
				});		
     		} else {
	       		
    	 	}
   		});
	};

	//deleta um animal armazenado localmente
	$scope.deletarLocal = function(animal){
		var confirmPopup = $ionicPopup.confirm({
     		title: 'Você tem certeza que deseja deletar este animal?',
     		template: 'Ao deletar este animal, todos os dados ligados à ele serão deletados também',
	     	cancelText: 'Cancelar',
        	okText: 'Deletar'		
   		});
   		confirmPopup.then(function(res) {
     		if(res) {       			
       			$scope.showLoading();
				LocalFactory.removeAnimalLocal(animal);
				$rootScope.animaisLocais = LocalFactory.getAnimaisLocal();	
				$scope.testaVazio();
				$scope.hideLoading();	
     		} else {
	       		
    	 	}
   		});		
	};

	//faz o upload de vários animais para o servidor
	$scope.atualizarMaisDeUm = function(){		
		if ($rootScope.online == true) {
			$scope.animaisLocaisAux = $rootScope.animaisLocais;
			animaisSelecionados = [];		
			$scope.rebanhoUpload = {};
			$scope.racaUpload = {};
			$scope.showLoading();
			if ($rootScope.usuario.permissao == 'ROLE_PECUARISTA'){				
				CaprioviService.getFazendas($rootScope.usuario.id)
				.then(function(response){		
					$rootScope.fazendas = response.data;
					$scope.idsFazendas();
					CaprioviService.getRebanhos(ids)
					.then(function(response){
						if (response.data != null) {
							$rootScope.rebanhos = response.data;																					
						}
					});															
				});
			}else{
				$scope.idsFazendas();
				CaprioviService.getRebanhos(ids)
				.then(function(response){
					if (response.data != null) {
						$rootScope.rebanhos = response.data;																					
					}
				});
			}

			$scope.hideLoading();

				$ionicPopup.show({
				  template: '<style>.popup { width:500px; }</style><label class="item item-select"><select ng-model = "rebanhoUpload.rebanho" ng-options = "rebanho.nome for rebanho in rebanhos" ng-required = "true"><option value="" disabled selected>Rebanho</option></select></label><div class="spacer" style="width: 300px; height: 22px;"></div>' +
				  '<label class="item item-select"><ion-checkbox ng-repeat = "animal in animaisLocaisAux" ng-model="animaisSelecionados" ng-change="animaisSel(animal)" ng-checked="animal.marcado" >{{animal.nomeNumero}}</ion-checkbox></label><div class="spacer" style="width: 300px; height: 18px;"></div>',
				  title: 'Escolha o rebanho, e os animais a serem sincronizados',				  
				  scope: $scope,
				  buttons: [
				   { text: 'Cancelar',
				   	 type: 'button-assertive',
				   	 onTap: function() {
				   	 	for (var i = 0; i < animaisSelecionados.length; i++) {
				     		delete animaisSelecionados[i].marcado;
				     	}
					}
				   },
				   {
				     text: 'Sincronizar',
				     type: 'button-positive',
				     onTap: function(e) { 
				     	if ($scope.rebanhoUpload.rebanho != null && animaisSelecionados.length > 0) {
				     		$scope.sincronizando("Sincronizando",'<div align = "center"><img src = "img/gif.gif"></div>');
				     		for (var i = 0; i < animaisSelecionados.length; i++) {
				     			delete animaisSelecionados[i].marcado;
				     		}
				     		for (var i = 0; i < animaisSelecionados.length; i++) {								
								animaisSelecionados[i].rebanho = $scope.rebanhoUpload.rebanho;
								animaisSelecionados[i].raca = {};
								CaprioviService.postAnimal(animaisSelecionados[i])
								.then(function(response){				
									if(response.status == 200){									
										LocalFactory.removeAnimalLocal(animaisSelecionados[i]);
										$scope.testaVazio();
										showLoadingMensage.close();														
										$scope.redirecionamentoAnimais();
										$scope.mensagemSincronismo();		
										$ionicPopup.close();										
									}else if(response.status == 205){
										for (var i = 0; i < animaisSelecionados.length; i++) {
								     		delete animaisSelecionados[i].marcado;
								     	}
										showLoadingMensage.close();		
										$scope.modal('Erro ao cadastrar seu animal', 'Já existe um animal com o mesmo Nome/Número cadastrado nesta fazenda!');
										return;
									}else{
										for (var i = 0; i < animaisSelecionados.length; i++) {
								     		delete animaisSelecionados[i].marcado;
								     	}
										showLoadingMensage.close();
										$scope.modal('Erro ao sincronizar seus dados', 'Tente novamente!');					
										return;
									}
								});
							};						
				     	}else{
				     		for (var i = 0; i < animaisSelecionados.length; i++) {
					     		delete animaisSelecionados[i].marcado;
					     	}
				     		$scope.modal('Erro ao sincronizar seus dados', 'Você precisa selecionar o rebanho e os animais a serem sincronizados');
				     	}    	
				     }
				   }
				  ]
				});			
		}else{
			$scope.modal("Sem conexão","Você não possui conexão com a internet para sincronizar seus dados com o servidor!");
		}
	};

	//faz o upload de um animal para o servidor
	$scope.atualizarServidor = function(animal){
		$scope.animalFuncao = animal;
		if ($rootScope.online == true) {
			$scope.showLoading();
			if ($rootScope.usuario.permissao == 'ROLE_PECUARISTA'){				
				CaprioviService.getFazendas($rootScope.usuario.id)
				.then(function(response){		
					$rootScope.fazendas = response.data;
					$scope.idsFazendas();
					CaprioviService.getRebanhos(ids)
					.then(function(response){
						if (response.data != null) {
							$rootScope.rebanhos = response.data;																					
						}
					});															
				});
			}else{
				$scope.idsFazendas();
				CaprioviService.getRebanhos(ids)
				.then(function(response){
					if (response.data != null) {
						$rootScope.rebanhos = response.data;																					
					}
				});
			}

			$scope.hideLoading();

				$ionicPopup.show({
				  template: '<style>.popup { width:500px; }</style><label class="item item-select"><select ng-model = "animalFuncao.rebanho" ng-options = "rebanho.nome for rebanho in rebanhos" ng-required = "true"><option value="" disabled selected>Rebanho</option></select></label><div class="spacer" style="width: 300px; height: 22px;"></div>',
				  title: 'Escolha o rebanho desse animal',				  
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
				     	if ($scope.animalFuncao.rebanho != null) {
				     		$scope.animalFuncao.raca = {};
				     		$scope.sincronizando("Sincronizando",'<div align = "center"><img src = "img/gif.gif"></div>');
							CaprioviService.postAnimal($scope.animalFuncao)
							.then(function(response){				
								if(response.status == 200){									
									LocalFactory.removeAnimalLocal(animal);
									$scope.testaVazio();
									showLoadingMensage.close();														
									$scope.redirecionamentoAnimais();
									$scope.mensagemSincronismo();		
									$ionicPopup.close();										
								}else if(response.status == 205){
									showLoadingMensage.close();			
									$scope.modal('Erro ao cadastrar seu animal', 'Já existe um animal com o mesmo Nome/Número cadastrado nesta fazenda!');
									return;
								}else{
									showLoadingMensage.close();			
									$scope.modal('Erro ao sincronizar seus dados', 'Tente novamente!');					
									return;
								}
							}); 
				     	}else{
				     		showLoadingMensage.close();
				     		$scope.modal('Erro ao sincronizar seus dados', 'Você precisa selecionar o rebanho desse animal');	
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

.controller('cadastroAnimalCtrl', ['$scope', '$stateParams', '$ionicLoading','CaprioviService','$state',
'$rootScope', '$ionicPopup', 'CaprioviFactory','LocalFactory',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $ionicLoading, CaprioviService, $state, $rootScope, $ionicPopup, CaprioviFactory, LocalFactory) {

	var adicionar;	
	var ids = [];	

	if (CaprioviFactory.getAnimal() == null) {
		adicionar = true;
	}else{
		adicionar = false;
		$scope.animal = CaprioviFactory.getAnimal();
		$scope.animal.nascimento = new Date($scope.animal.nascimento);				

		if ($scope.animal.sexo == 'SEXO_MACHO') {
			$scope.animal.sexo = "Macho";
		}else if($scope.animal.sexo == 'SEXO_FEMEA'){
			$scope.animal.sexo = "Fêmea";
		};

		if ($scope.animal.motivoEntrada == 'Compra') {
			$scope.animal.motivoEntrada = "Compra";
		}else if($scope.animal.motivoEntrada == 'Nascimento'){
			$scope.animal.motivoEntrada = "Nascimento";
		}else if($scope.animal.motivoEntrada == 'Emprestimo'){
			$scope.animal.motivoEntrada = "Emprestimo";
		}else if($scope.animal.motivoEntrada == 'Outros'){
			$scope.animal.motivoEntrada = "Outros";
		};

		if ($scope.animal.parto == 'PARTO_SIMPLES') {
			$scope.animal.parto = "Simples";
		}else if($scope.animal.parto == 'PARTO_DUPLO'){
			$scope.animal.parto = "Duplo";
		}else if($scope.animal.parto == 'PARTO_TRIPLO'){
			$scope.animal.parto = "Triplo";
		}else if($scope.animal.parto == 'PARTO_QUADRUPLO'){
			$scope.animal.parto = "Quádruplo";
		};

		if ($scope.animal.finalidadeAnimal == 'FINALIDADE_REPRODUCAO') {
			$scope.animal.finalidadeAnimal = "Rreprodução";
		}else if($scope.animal.finalidadeAnimal == 'FINALIDADE_PRODUCAO'){
			$scope.animal.finalidadeAnimal = "Produção";
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

	$scope.redirecionamentoAnimais = function(){
		if ($rootScope.online == true) {
			$scope.idsFazendas();
			CaprioviService.getAnimais(ids)
			.then(function(response){
				if (response.data != null) {
					$scope.hideLoading();
					$rootScope.animais = response.data;												
					$state.go('opcoes.animais');									
				}
			});
		}else{
			$scope.hideLoading();
			$state.go('opcoes.animais');
		}
	};	

	$scope.animais = function(){
		if ($rootScope.usuario.permissao == 'ROLE_PECUARISTA') {
			CaprioviService.getFazendas($rootScope.usuario.id)
			.then(function(response){
				$scope.redirecionamentoAnimais();
			});
		}else{
			$scope.redirecionamentoAnimais();
		}
	};

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

	//função chamada pelo botão cancelar do cadastro de aniamis
	$scope.cancelar = function(){		
  		$scope.showLoading();  
  		$scope.animais();		
  	};  	  		  	

  	$scope.cadastrar = function (animal){ 

  		if (animal.raca == undefined) {
  			animal.raca == {};
  		};

  		if (animal.sexo == "Macho") {
			animal.sexo = 1;
		}else if(animal.sexo == "Fêmea"){
			animal.sexo = 2;
		};

		if (animal.motivoEntrada == "Compra") {
			animal.motivoEntrada = 1;
		}else if(animal.motivoEntrada == "Nascimento"){
			animal.motivoEntrada = 2;
		}else if(animal.motivoEntrada == "Emprestimo"){
			animal.motivoEntrada = 3;
		}else if(animal.motivoEntrada == "Outros"){
			animal.motivoEntrada = 4;
		};

		if (animal.parto == "Simples") {
			animal.parto = 1;
		}else if(animal.parto == "Duplo"){
			animal.parto = 2;
		}else if(animal.parto == "Triplo"){
			animal.parto = 3;
		}else if(animal.parto == "Quádruplo"){
			animal.parto = 4;
		};

		if (animal.finalidadeAnimal == "Reprodução") {
			animal.parto = 1;
		}else if(animal.parto == "Produção"){
			animal.parto = 2;
		};

		$scope.showLoading();

  		if(adicionar == true){
  			if ($rootScope.online == true) {		
				CaprioviService.postAnimal(animal)
				.then(function(response){
					if(response.status == 200){
						$scope.animais();
					}else if(response.status == 205){
						$scope.hideLoading();
						$scope.modal('Erro ao cadastrar seu animal', 'Já existe um animal com o mesmo Nome/Número cadastrado nesta fazenda!');					
						return;
					}else if(response.status == 206){
						$scope.hideLoading();
						$scope.modal('Erro ao cadastrar seu animal', 'A data de nascimento deve ser anterior à data atual!');					
						return;
					}else{
						$scope.hideLoading();
						$scope.modal('Erro ao cadastrar seu animal', 'Tente novamente!');					
						return;
					}
				});
			}else{
				var presente = false;
				for(var i = 0; i < LocalFactory.getAnimaisLocal().length; i++){
					if (LocalFactory.getAnimaisLocal()[i].nomeNumero == animal.nomeNumero) {
						presente = true;						
						$scope.hideLoading();
						$scope.modal('Nome/Número inválido', 'Você já cadastrou um animal com esse nome/número');					
					}							
				}
				if (presente == false) {
					LocalFactory.addAnimalLocal(animal);
					$scope.hideLoading();										
					$state.go('opcoes.animais');
				};				
			}
  		}else{
  			if ($rootScope.online == true) {
	  			CaprioviService.updateAnimal(animal)
				.then(function(response){
					if(response.status == 200){
						$scope.animais();
					}else{
						$scope.hideLoading();
						$scope.modal('Erro ao atualizar seu animal', 'Tente novamente!');					
						return;
					}
				});
			}else{
				var presente = false;
				for(var i = 0; i < LocalFactory.getAnimaisLocal().length; i++){
					if (LocalFactory.getAnimaisLocal()[i].nomeNumero == animal.nomeNumero
							&& i != LocalFactory.getAnimaisLocal().indexOf(animal)) {
						presente = true;						
						$scope.hideLoading();
						$scope.modal('Nome/Número inválido', 'Você já cadastrou um animal com esse nome/número');					
					}							
				}
				if (presente == false) {
					for(var i = 0; i < LocalFactory.getAnimaisLocal().length; i++){
						if (LocalFactory.getAnimaisLocal()[i] == CaprioviFactory.getAnimal()) {
							LocalFactory.getAnimaisLocal()[i] = animal;
							$scope.hideLoading();
							$state.go('opcoes.animais');
						}							
					}
				};				
			}
  		}	

	}

}])   