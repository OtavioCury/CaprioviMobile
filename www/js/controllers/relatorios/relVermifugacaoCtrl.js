angular.module('app.controllers')

.controller('relVermifugacaoCtrl', ['$scope', '$stateParams', '$ionicLoading', 'CaprioviService', '$state', '$rootScope'
, '$ionicPopup', 'CaprioviFactory',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $ionicLoading, CaprioviService, $state, $rootScope, $ionicPopup, CaprioviFactory) {	

	$scope.vazio = false;
	if ($rootScope.relVermifugacao.length == 0) {
		$scope.vazio = true;
	};
	var naoVermifugar = 0, alerta = 0, vermifugar = 0, atencao = 0, risco = 0;
	$scope.labels = ["Não Vermifugar","Alerta","Vermifugar","Atenção", "Risco"];		

	for(var i = 0; i < $rootScope.relVermifugacao.length; i++){	

		if ($rootScope.relVermifugacao[i].listaNotas[$rootScope.relVermifugacao[i].listaNotas.length-1].statusVermifuga == 'DESNECESSARIO') {
			naoVermifugar++;
		}else if($rootScope.relVermifugacao[i].listaNotas[$rootScope.relVermifugacao[i].listaNotas.length-1].statusVermifuga == 'ALERTA'){
			alerta++;
		}else if($rootScope.relVermifugacao[i].listaNotas[$rootScope.relVermifugacao[i].listaNotas.length-1].statusVermifuga == 'NECESSARIO'){
			vermifugar++;
		}else if($rootScope.relVermifugacao[i].listaNotas[$rootScope.relVermifugacao[i].listaNotas.length-1].statusVermifuga == 'ATENCAO'){
			atencao++;
		}else if($rootScope.relVermifugacao[i].listaNotas[$rootScope.relVermifugacao[i].listaNotas.length-1].statusVermifuga == 'RISCO'){
			risco++;
		};
	}		



	$scope.data = [naoVermifugar, alerta, vermifugar, atencao, risco];

	$scope.voltar = function(){
		$state.go('opcoes.relatorios');
	};

}])