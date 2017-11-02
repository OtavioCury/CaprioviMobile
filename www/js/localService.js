angular.module('app.services')

.factory('LocalFactory', ['$localStorage',function($localStorage){	

	$localStorage = $localStorage.$default({
  		fazendasLocal: [],
  		usuarioLocal: {},
  		rebanhosLocal: [],
  		animaisLocal: [],
  		doencasLocal: [],
  		racasLocal: [],
  		medicamentosLocal: [],
  		manejosLocal: [],
  		movimentacoesLocal: [],
  		controlesLocal: [],
  		ocorrenciasLocal: [],
  		vacinacoesLocal: []
	});

	//fazendas
	var getFazendasLocal = function () {
	  return $localStorage.fazendasLocal;
	}

	var addFazendaLocal = function (fazenda) {	  		  
	  $localStorage.fazendasLocal.push(fazenda);
	}

	var removeFazendaLocal = function (fazenda) {
	  $localStorage.fazendasLocal.splice($localStorage.fazendasLocal.indexOf(fazenda), 1);
	}

	var removeAllFazendas = function(){
		$localStorage.fazendasLocal = [];	
	}

	//usuario
	var getUsuarioLocal = function () {
	  return $localStorage.usuarioLocal;
	}

	var setUsuarioLocal = function (usuario) {	  		  
	  $localStorage.usuarioLocal = usuario;
	}

	var removeUsuarioLocal = function () {
	  $localStorage.usuarioLocal = {};
	}

	//rebanhos
	var getRebanhosLocal = function () {
	  return $localStorage.rebanhosLocal;
	}

	var addRebanhoLocal = function (rebanho) {	  		  
	  $localStorage.rebanhosLocal.push(rebanho);
	}

	var removeRebanhoLocal = function (rebanho) {
	  $localStorage.rebanhosLocal.splice($localStorage.rebanhosLocal.indexOf(rebanho), 1);
	}

	var removeAllRebanho = function(){
		$localStorage.rebanhosLocal = [];	
	}

	//animais
	var getAnimaisLocal = function () {
	  return $localStorage.animaisLocal;
	}

	var addAnimalLocal = function (animal) {	  		  
	  $localStorage.animaisLocal.push(animal);
	}

	var removeAnimalLocal = function (animal) {
	  $localStorage.animaisLocal.splice($localStorage.animaisLocal.indexOf(animal), 1);
	}

	var removeAllAnimal = function(){
		$localStorage.animaisLocal = [];	
	}

	//doenças
	var getDoencasLocal = function () {
	  return $localStorage.doencasLocal;
	}

	var addDoencaLocal = function (doenca) {	  		  
	  $localStorage.doencasLocal.push(doenca);
	}

	var removeDoencaLocal = function (doenca) {
	  $localStorage.doencasLocal.splice($localStorage.doencasLocal.indexOf(doenca), 1);
	}

	var removeAllDoenca = function(){
		$localStorage.doencasLocal = [];	
	}

	//medicamentos
	var getMedicamentosLocal = function () {
	  return $localStorage.medicamentosLocal;
	}

	var addMedicamentoLocal = function (medicamento) {	  		  
	  $localStorage.medicamentosLocal.push(medicamento);
	}

	var removeMedicamentoLocal = function (medicamento) {
	  $localStorage.medicamentosLocal.splice($localStorage.medicamentosLocal.indexOf(medicamento), 1);
	}

	var removeAllMedicamento = function(){
		$localStorage.medicamentosLocal = [];	
	}

	//raças
	var getRacasLocal = function () {
	  return $localStorage.racasLocal;
	}

	var addRacaLocal = function (raca) {	  		  
	  $localStorage.racasLocal.push(raca);
	}

	var removeRacaLocal = function (raca) {
	  $localStorage.racasLocal.splice($localStorage.racasLocal.indexOf(raca), 1);
	}

	var removeAllRaca = function(){
		$localStorage.racasLocal = [];	
	}

	//manejos
	var getManejosLocal = function () {
	  return $localStorage.manejosLocal;
	}

	var addManejoLocal = function (manejo) {	  		  
	  $localStorage.manejosLocal.push(manejo);
	}

	var removeManejoLocal = function (manejo) {
	  $localStorage.manejosLocal.splice($localStorage.manejosLocal.indexOf(manejo), 1);
	}

	var removeAllManejo = function(){
		$localStorage.manejosLocal = [];	
	}

	//movimentações
	var getMovimentacoesLocal = function () {
	  return $localStorage.movimentacoesLocal;
	}

	var addMovimentacaoLocal = function (movimentacao) {	  		  
	  $localStorage.movimentacoesLocal.push(movimentacao);
	}

	var removeMovimentacaoLocal = function (movimentacao) {
	  $localStorage.movimentacoesLocal.splice($localStorage.movimentacoesLocal.indexOf(movimentacao), 1);
	}

	var removeAllMovimentacao = function(){
		$localStorage.movimentacoesLocal = [];	
	}

	//controles
	var getControlesLocal = function () {
	  return $localStorage.controlesLocal;
	}

	var addControleLocal = function (controle) {	  		  
	  $localStorage.controlesLocal.push(controle);
	}

	var removeControleLocal = function (controle) {
	  $localStorage.controlesLocal.splice($localStorage.controlesLocal.indexOf(controle), 1);
	}

	var removeAllControle = function(){
		$localStorage.controlesLocal = [];	
	}

	//ocorrências
	var getOcorrenciasLocal = function () {
	  return $localStorage.ocorrenciasLocal;
	}

	var addOcorrenciaLocal = function (ocorrencia) {	  		  
	  $localStorage.ocorrenciasLocal.push(ocorrencia);
	}

	var removeOcorrenciaLocal = function (ocorrencia) {
	  $localStorage.ocorrenciasLocal.splice($localStorage.ocorrenciasLocal.indexOf(ocorrencia), 1);
	}

	var removeAllOcorrencia = function(){
		$localStorage.ocorrenciasLocal = [];	
	}

	//vacinações
	var getVacinacoesLocal = function () {
	  return $localStorage.vacinacoesLocal;
	}

	var addVacinacaoLocal = function (vacinacao) {	  		  
	  $localStorage.vacinacoesLocal.push(vacinacao);
	}

	var removeVacinacaoLocal = function (vacinacao) {
	  $localStorage.vacinacoesLocal.splice($localStorage.vacinacoesLocal.indexOf(vacinacao), 1);
	}

	var removeAllVacinacao = function(){
		$localStorage.vacinacoesLocal = [];	
	}

	var removeAll = function(){
		$localStorage.rebanhosLocal = [];	
		$localStorage.fazendasLocal = [];
		$localStorage.animaisLocal = [];
		$localStorage.doencasLocal = [];
		$localStorage.racasLocal = [];
		$localStorage.medicamentosLocal = [];
		$localStorage.manejosLocal = [];
		$localStorage.movimentacoesLocal = [];
		$localStorage.controlesLocal = [];
		$localStorage.ocorrenciasLocal = [];
		$localStorage.vacinacoesLocal = [];
	}

	return{
		//fazendas
	    getFazendasLocal: getFazendasLocal,
	    addFazendaLocal: addFazendaLocal,
	    removeFazendaLocal: removeFazendaLocal,
	    removeAllFazendas: removeAllFazendas,

	    //usuario
	    getUsuarioLocal: getUsuarioLocal,
	    setUsuarioLocal: setUsuarioLocal,
	    removeUsuarioLocal: removeUsuarioLocal,

	    //rebanho
	    getRebanhosLocal: getRebanhosLocal,
	    addRebanhoLocal: addRebanhoLocal,
	    removeRebanhoLocal: removeRebanhoLocal,
	    removeAllRebanho: removeAllRebanho,

	    //animal
	    getAnimaisLocal: getAnimaisLocal,
	    addAnimalLocal: addAnimalLocal,
	    removeAnimalLocal: removeAnimalLocal,
	    removeAllAnimal: removeAllAnimal,

	    //doenca
	    getDoencasLocal: getDoencasLocal,
	    addDoencaLocal: addDoencaLocal,
	    removeDoencaLocal: removeDoencaLocal,
	    removeAllDoenca: removeAllDoenca,

	    //raça
	    getRacasLocal: getRacasLocal,
	    addRacaLocal: addRacaLocal,
	    removeRacaLocal: removeRacaLocal,
	    removeAllRaca: removeAllRaca,

	    //medicamento
	    getMedicamentosLocal: getMedicamentosLocal,
	    addMedicamentoLocal: addMedicamentoLocal,
	    removeMedicamentoLocal: removeMedicamentoLocal,
	    removeAllMedicamento: removeAllMedicamento,

	    //manejos
	    getManejosLocal: getManejosLocal,
	    addManejoLocal: addManejoLocal,
	    removeManejoLocal: removeManejoLocal,
	    removeAllManejo: removeAllManejo,

	    //movimentacoes
	    getMovimentacoesLocal: getMovimentacoesLocal,
	    addMovimentacaoLocal: addMovimentacaoLocal,
	    removeMovimentacaoLocal: removeMovimentacaoLocal,
	    removeAllMovimentacao: removeAllMovimentacao,

	    //controles
	    getControlesLocal: getControlesLocal,
	    addControleLocal: addControleLocal,
	    removeControleLocal: removeControleLocal,
	    removeAllControle: removeAllControle,

	    //ocorrências
	    getOcorrenciasLocal: getOcorrenciasLocal,
	    addOcorrenciaLocal: addOcorrenciaLocal,
	    removeOcorrenciaLocal: removeOcorrenciaLocal,
	    removeAllOcorrencia: removeAllOcorrencia,

	    //ocorrências
	    getVacinacoesLocal: getVacinacoesLocal,
	    addVacinacaoLocal: addVacinacaoLocal,
	    removeVacinacaoLocal: removeVacinacaoLocal,
	    removeAllVacinacao: removeAllVacinacao,

	    removeAll: removeAll
	}
	
}])