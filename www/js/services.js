angular.module('app.services', ['ngStorage'])

.factory('CaprioviFactory', [function(){

	var fazenda;
	var funcionario;
	var rebanho;
	var animal;
	var raca;
	var manejos;
	var movimentacao;
	var controle;
	var ocorrencia;
	var vacinacao;	
	var medicamento;
	var doenca;

	function setFazenda(fazendaData){
		fazenda = fazendaData;
	}

	function getFazenda(){
		return fazenda;
	}

	function setFuncionario(funcionarioData){
		funcionario = funcionarioData;
	}

	function getFuncionario(){
		return funcionario;
	}

	function setRebanho(rebanhoData){
		rebanho = rebanhoData;
	}

	function getRebanho(){
		return rebanho;
	}

	function setMovimentacao(movimentacaoData){
		movimentacao = movimentacaoData;
	}

	function getMovimentacao(){
		return movimentacao;
	}

	function setManejo(manejoData){
		manejo = manejoData;
	}

	function getManejo(){
		return manejo;
	}

	function setAnimal(animalData){
		animal = animalData;
	}

	function getAnimal(){
		return animal;
	}

	function setRaca(racaData){
		raca = racaData;
	}

	function getRaca(){
		return raca;
	}	

	function setControle(controleData){
		controle = controleData;
	}

	function getControle(){
		return controle;
	}

	function setOcorrencia(ocorrenciaData){
		ocorrencia = ocorrenciaData;
	}

	function getOcorrencia(){
		return ocorrencia;
	}

	function setVacinacao(vacinacaoData){
		vacinacao = vacinacaoData;
	}

	function getVacinacao(){
		return vacinacao;
	}

	function setMedicamento(medicamentoData){
		medicamento = medicamentoData;
	}

	function getMedicamento(){
		return medicamento;
	}

	function setDoenca(doencaData){
		doenca = doencaData;
	}

	function getDoenca(){
		return doenca;
	}

	return{
		getFazenda: getFazenda,
		setFazenda: setFazenda,
		getFuncionario: getFuncionario,
		setFuncionario: setFuncionario,
		getRebanho: getRebanho,
		setRebanho: setRebanho,
		getAnimal: getAnimal,
		setAnimal: setAnimal,
		getRaca: getRaca,
		setRaca: setRaca,
		getManejo: getManejo,
		setManejo: setManejo,
		getMovimentacao: getMovimentacao,
		setMovimentacao: setMovimentacao,
		getControle: getControle,
		setControle: setControle,
		getOcorrencia: getOcorrencia,
		setOcorrencia: setOcorrencia,
		getVacinacao: getVacinacao,
		setVacinacao: setVacinacao,
		getMedicamento: getMedicamento,
		setMedicamento: setMedicamento,
		getDoenca: getDoenca,
		setDoenca: setDoenca
	}

}])

.service('CaprioviService', ['$http', function($http){	
	var ip = 'http://192.168.100.4:8080/rest';
	return{		

		getUsuario: function(usuario, senha){
			URL = ip+'/usuario/login/'+usuario+'/'+senha;					
			return $http.get(URL, {timeout: 9000}).then(function(response){				
				return response;
			}).catch(function(response){											
				return response;
			});
		},

		getFazendas: function(id){
			URL = ip+'/fazenda/fazendas/'+id;					
			return $http.get(URL, {timeout: 9000}).then(function(response){							
				return response;
			}).catch(function(response){							
				return response;
			});
		},

		postFazenda: function(fazenda){
			URL = ip+'/fazenda/adicionar';

			body = {	          
	      		nome: fazenda.nome,
	      		municipio: fazenda.municipio,
	      		estado: fazenda.estado,
	      		telefone: fazenda.telefone,
	      		pecuarista: fazenda.pecuarista
	        }
	        return $http.post(URL, body).then(function(response){	        	
				return response;
			}).catch(function(response){				
				return response;
			});
		},

		deleteFazenda: function(idFazenda){
			URL = ip+'/fazenda/deletar/'+idFazenda;

			return $http.delete(URL).then(function(response){							
				return response;
			}).catch(function(response){							
				return response;
			});
		},

		updateFazenda: function(fazenda){
			URL = ip+'/fazenda/atualizar';

			body = {
				id: fazenda.id,	          
	      		nome: fazenda.nome,
	      		municipio: fazenda.municipio,
	      		estado: fazenda.estado,
	      		telefone: fazenda.telefone,
	      		pecuarista: fazenda.pecuarista     			
	        }

	        return $http.post(URL, body).then(function(response){	        	
				return response;
			}).catch(function(response){				
				return response;
			});
		},

		getRebanhos: function(ids){			

			URL = ip+'/rebanho/rebanhosFazendas';

			return $http.get(URL, {
				timeout: 9000,
				params: {ids: ids}
				}).then(function(response){							
				return response;
			}).catch(function(response){							
				return response;
			});
		},

		postRebanho: function(rebanho){
			URL = ip+'/rebanho/adicionar';

			body = {	          
	      		nome: rebanho.nome,
	      		fazenda: rebanho.fazenda,
	      		criacao: rebanho.criacao,
	      		manejo: rebanho.manejo,
	      		finalidade: rebanho.producao     			
	        }
	        return $http.post(URL, body).then(function(response){	        	
				return response;
			}).catch(function(response){				
				return response;
			});
		},

		deleteRebanho: function(idRebanho){
			URL = ip+'/rebanho/deletar/'+idRebanho;

			return $http.delete(URL).then(function(response){							
				return response;
			}).catch(function(response){							
				return response;
			});
		},

		updateRebanho: function(rebanho){
			URL = ip+'/rebanho/atualizar';

			body = {
				id: rebanho.id,	          
	      		nome: rebanho.nome,
	      		fazenda: rebanho.fazenda,
	      		criacao: rebanho.criacao,
	      		manejo: rebanho.manejo,
	      		finalidade: rebanho.producao     			
	        }

	        return $http.post(URL, body).then(function(response){	        	
				return response;
			}).catch(function(response){				
				return response;
			});
		},

		getAnimais: function(ids){			

			URL = ip+'/animal/animaisFazendas';

			return $http.get(URL, {
				timeout: 9000,
				params: {ids: ids}
				}).then(function(response){							
				return response;
			}).catch(function(response){							
				return response;
			});
		},

		postAnimal: function(animal){

			URL = ip+'/animal/adicionar';

			body = {	          
	      		nomeNumero: animal.nomeNumero,
	      		rebanho: animal.rebanho,
	      		nascimento: animal.nascimento,
	      		sexo: animal.sexo,
	      		raca: animal.raca,
	      		motivoEntrada: animal.motivoEntrada,     			
	      		parto: animal.parto,
	      		finalidadeAnimal: animal.finalidadeAnimal
	        }

	        return $http.post(URL, body).then(function(response){	        	
				return response;
			}).catch(function(response){				
				return response;
			});

		},

		deleteAnimal: function(idAnimal){
			URL = ip+'/animal/deletar/'+idAnimal;

			return $http.delete(URL).then(function(response){							
				return response;
			}).catch(function(response){							
				return response;
			});
		},

		updateAnimal: function(animal){
			URL = ip+'/animal/atualizar';

			body = {
				id: animal.id,
				nomeNumero: animal.nomeNumero,
	      		rebanho: animal.rebanho,
	      		nascimento: animal.nascimento,
	      		sexo: animal.sexo,
	      		raca: animal.raca,
	      		motivoEntrada: animal.motivoEntrada,
	      		parto: animal.parto     			
	        }

	        return $http.post(URL, body).then(function(response){	        	
				return response;
			}).catch(function(response){				
				return response;
			});
		},

		getRacas: function(id){			

			URL = ip+'/raca/racasUsuario';

			return $http.get(URL, {
				timeout: 9000,
				params: {id: id}
				}).then(function(response){							
				return response;
			}).catch(function(response){							
				return response;
			});
		},

		deleteRaca: function(idRaca){
			URL = ip+'/raca/deletar/'+idRaca;

			return $http.delete(URL).then(function(response){							
				return response;
			}).catch(function(response){							
				return response;
			});
		},

		postRaca: function(raca){

			URL = ip+'/raca/adicionar';

			body = {	          
	      		nome: raca.nome,
	      		usuario: raca.usuario,
	      		criacao: raca.criacao,
				aspectoGeral: raca.aspectoGeral,
				origem: raca.origem	      		     			
	        }	        

	        return $http.post(URL, body).then(function(response){	        	
				return response;
			}).catch(function(response){				
				return response;
			});

		},

		updateRaca: function(raca){
			URL = ip+'/raca/atualizar';

			body = {
				id: raca.id,
				nome: raca.nome,
	      		usuario: raca.usuario,
	      		criacao: raca.criacao,
				aspectoGeral: raca.aspectoGeral,
				origem: raca.origem	         			
	        }

	        return $http.post(URL, body).then(function(response){	        	
				return response;
			}).catch(function(response){				
				return response;
			});
		},

		getDoenca: function(id){			

			URL = ip+'/doenca/doencasUsuario';

			return $http.get(URL, {
				timeout: 9000,
				params: {id: id}
				}).then(function(response){							
				return response;
			}).catch(function(response){							
				return response;
			});
		},

		deleteDoenca: function(idDoenca){
			URL = ip+'/doenca/deletar/'+idDoenca;

			return $http.delete(URL).then(function(response){							
				return response;
			}).catch(function(response){							
				return response;
			});
		},

		postDoenca: function(doenca){

			URL = ip+'/doenca/adicionar';

			body = {	          
	      		usuario: doenca.usuario,
				nome: doenca.nome,
	      		causa: doenca.causa,
	      		sintomas: doenca.sintomas,
	      		profilaxia: doenca.profilaxia,
	      		tratamento: doenca.tratamento      		     			
	        }	        

	        return $http.post(URL, body).then(function(response){	        	
				return response;
			}).catch(function(response){				
				return response;
			});

		},

		updateDoenca: function(doenca){
			URL = ip+'/doenca/atualizar';

			body = {
				id: doenca.id,
				usuario: doenca.usuario,
				nome: doenca.nome,
	      		causa: doenca.causa,
	      		sintomas: doenca.sintomas,
	      		profilaxia: doenca.profilaxia,
	      		tratamento: doenca.tratamento
	        }

	        return $http.post(URL, body).then(function(response){	        	
				return response;
			}).catch(function(response){				
				return response;
			});
		},

		getManejos: function(ids){			

			URL = ip+'/manejo/manejosRebanhos';

			return $http.get(URL, {
				timeout: 9000,
				params: {ids: ids}
				}).then(function(response){											
				return response;
			}).catch(function(response){							
				return response;
			});
		},

		deleteManejo: function(idManejo){
			URL = ip+'/manejo/deletar/'+idManejo;

			return $http.delete(URL).then(function(response){							
				return response;
			}).catch(function(response){							
				return response;
			});
		},

		postManejo: function(manejo){			

			URL = ip+'/manejo/adicionar';

			body = {	   
				rebanho: manejo.rebanho,
				matriz: manejo.matriz,
				dataDaCobertura: manejo.dataDaCobertura,
				pesoMatriz: manejo.pesoMatriz,
				scoreCorporalmatriz: manejo.scoreCorporalmatriz,
				reprodutor: manejo.reprodutor,
				paricao: manejo.paricao,
				observacao: manejo.observacao,
				perimetroEscrotalReprodutor: manejo.perimetroEscrotalReprodutor       	      			     		
	        }	        

	        return $http.post(URL, body).then(function(response){	        	
				return response;
			}).catch(function(response){				
				return response;
			});

		},

		updateManejo: function(manejo){
			URL = ip+'/manejo/atualizar';

			body = {
				id: manejo.id,
				rebanho: manejo.rebanho,
				matriz: manejo.matriz,
				dataDaCobertura: manejo.dataDaCobertura,
				pesoMatriz: manejo.pesoMatriz,
				scoreCorporalmatriz: manejo.scoreCorporalmatriz,
				reprodutor: manejo.reprodutor,
				paricao: manejo.paricao,
				observacao: manejo.observacao,
				perimetroEscrotalReprodutor: manejo.perimetroEscrotalReprodutor 	         			
	        }

	        return $http.post(URL, body).then(function(response){	        	
				return response;
			}).catch(function(response){			
				return response;
			});
		},

		getMovimentacao: function(ids){			

			URL = ip+'/movimentacao/movimentosRebanhos';

			return $http.get(URL, {
				timeout: 9000,
				params: {ids: ids}
				}).then(function(response){											
				return response;
			}).catch(function(response){							
				return response;
			});
		},

		deleteMovimentacao: function(idMovimentacao){
			URL = ip+'/movimentacao/deletar/'+idMovimentacao;

			return $http.delete(URL).then(function(response){							
				return response;
			}).catch(function(response){							
				return response;
			});
		},

		postMovimentacao: function(movimentacao){			

			URL = ip+'/movimentacao/adicionar';

			body = {	   
				animal: movimentacao.animal,
				data: movimentacao.data,
				peso: movimentacao.peso,
				observacao: movimentacao.observacao,
				motivoSaida: movimentacao.motivoSaida,
				rebanho: movimentacao.animal.rebanho				       	      			     	
	        }	        

	        return $http.post(URL, body).then(function(response){	        	
				return response;
			}).catch(function(response){				
				return response;
			});

		},

		updateMovimentacao: function(movimentacao){

			URL = ip+'/movimentacao/atualizar';

			body = {
				id: movimentacao.id,
				animal: movimentacao.animal,
				data: movimentacao.data,
				peso: movimentacao.peso,
				observacao: movimentacao.observacao,
				motivoSaida: movimentacao.motivoSaida,
				rebanho: movimentacao.animal.rebanho 	         			
	        }

	        return $http.post(URL, body).then(function(response){	        	
				return response;
			}).catch(function(response){				
				return response;
			});
		},

		getControle: function(ids){			

			URL = ip+'/controleParasita/controlesRebanhos';

			return $http.get(URL, {
				timeout: 9000,
				params: {ids: ids}
				}).then(function(response){					
				return response;
			}).catch(function(response){							
				return response;
			});
		},

		deleteControle: function(idControle){
			URL = ip+'/controleParasita/deletar/'+idControle;

			return $http.delete(URL).then(function(response){							
				return response;
			}).catch(function(response){							
				return response;
			});
		},

		postControle: function(controle){			

			URL = ip+'/controleParasita/adicionar';

			body = {	   
				animal: controle.animal,
				dataVernifugacao: controle.dataVernifugacao,
				medicamento: controle.medicamento,	
				rebanho: controle.animal.rebanho						       	      			     	
	        }	        

	        return $http.post(URL, body).then(function(response){	        	
				return response;
			}).catch(function(response){				
				return response;
			});

		},

		updateControle: function(controle){

			URL = ip+'/controleParasita/atualizar';

			body = {
				id: controle.id,
				animal: controle.animal,
				dataVernifugacao: controle.dataVernifugacao,
				medicamento: controle.medicamento,
				rebanho: controle.animal.rebanho 	         			
	        }

	        return $http.post(URL, body).then(function(response){	        	
				return response;
			}).catch(function(response){				
				return response;
			});
		},

		getMedicamento: function(id){			

			URL = ip+'/medicamento/medicamentosUsuario/'+id;

			return $http.get(URL, {timeout: 9000}).then(function(response){					
				return response;
			}).catch(function(response){							
				return response;
			});
		},

		postMedicamento: function(medicamento){						

			URL = ip+'/medicamento/adicionar';			

			body = {	   				
				nome: medicamento.nome,
				descricao: medicamento.descricao,
				usuario: medicamento.usuario
	        }	        

	        return $http.post(URL, body).then(function(response){	        	
				return response;
			}).catch(function(response){				
				return response;
			});

		},

		deleteMedicamento: function(idMedicamento){
			URL = ip+'/medicamento/deletar/'+idMedicamento;

			return $http.delete(URL).then(function(response){							
				return response;
			}).catch(function(response){							
				return response;
			});
		},

		updateMedicamento: function(medicamento){						

			URL = ip+'/medicamento/atualizar';			

			body = {	
				id: medicamento.id,   				
				nome: medicamento.nome,
				descricao: medicamento.descricao,
				usuario: medicamento.usuario
	        }	        

	        return $http.post(URL, body).then(function(response){	        	
				return response;
			}).catch(function(response){				
				return response;
			});

		},

		getOcorrencia: function(ids){			

			URL = ip+'/ocorrencia/ocorrenciasRebanhos';

			return $http.get(URL, {
				timeout: 9000,
				params: {ids: ids}
				}).then(function(response){					
				return response;
			}).catch(function(response){							
				return response;
			});
		},

		deleteOcorrencia: function(idOcorrencia){
			URL = ip+'/ocorrencia/deletar/'+idOcorrencia;

			return $http.delete(URL).then(function(response){							
				return response;
			}).catch(function(response){							
				return response;
			});
		},

		postOcorrencia: function(ocorrencia){						

			URL = ip+'/ocorrencia/adicionar';			

			body = {	   				
				animal: ocorrencia.animal,
				rebanho: ocorrencia.animal.rebanho,
				doenca: ocorrencia.doenca,				
				data: ocorrencia.data,
				observacao: ocorrencia.observacao						       	      			     	
	        }	        

	        return $http.post(URL, body).then(function(response){	        	
				return response;
			}).catch(function(response){				
				return response;
			});

		},

		updateOcorrencia: function(ocorrencia){

			URL = ip+'/ocorrencia/atualizar';			

			body = {
				id: ocorrencia.id,
				rebanho: ocorrencia.animal.rebanho,
				animal: ocorrencia.animal,
				doenca: ocorrencia.doenca,				
				data: ocorrencia.data,
				observacao: ocorrencia.observacao 	         			
	        }

	        return $http.post(URL, body).then(function(response){	        	
				return response;
			}).catch(function(response){				
				return response;
			});
		},

		getDoenca: function(id){			

			URL = ip+'/doenca/doencasUsuario/'+id;

			return $http.get(URL, {timeout: 9000}).then(function(response){					
				return response;
			}).catch(function(response){							
				return response;
			});
		},

		getVacinacao: function(id){			

			URL = ip+'/vacinacao/vacinacoesUsuario/'+id;

			return $http.get(URL, {timeout: 9000}).then(function(response){					
				return response;
			}).catch(function(response){							
				return response;
			});
		},

		deleteVacinacao: function(idVacinacao){

			URL = ip+'/vacinacao/deletar/'+idVacinacao;

			return $http.delete(URL).then(function(response){							
				return response;
			}).catch(function(response){							
				return response;
			});
		},

		postVacinacao: function(vacinacao){						

			URL = ip+'/vacinacao/adicionar';			

			body = {	   				
				animais: vacinacao.animais,							
				data: vacinacao.data,
				medicamento: vacinacao.medicamento,
				usuario: vacinacao.usuario,
				observacao: vacinacao.observacao						       	      			     	
	        }	        

	        return $http.post(URL, body).then(function(response){	        	
				return response;
			}).catch(function(response){				
				return response;
			});

		},

		updateVacinacao: function(vacinacao){

			URL = ip+'/vacinacao/atualizar';			

			body = {
				id: vacinacao.id,
				animais: vacinacao.animais,							
				data: vacinacao.data,
				medicamento: vacinacao.medicamento,
				usuario: vacinacao.usuario,
				observacao: vacinacao.observacao 	         			
	        }

	        return $http.post(URL, body).then(function(response){	        	
				return response;
			}).catch(function(response){				
				return response;
			});
		},

		relAnimaisPorEntrada: function(ids){			

			URL = ip+'/relProducao/animaisPorEntrada';
			
			return $http.get(URL, {
				timeout: 9000,
				params: {ids: ids}
				}).then(function(response){					
				return response;
			}).catch(function(response){							
				return response;
			});
		},

		relMovimentacaoAnimal: function(ids){			

			URL = ip+'/relProducao/movimentacaoAnimal';
			
			return $http.get(URL, {
				timeout: 9000,
				params: {ids: ids}
				}).then(function(response){					
				return response;
			}).catch(function(response){							
				return response;
			});
		},


		relNumeroCrias: function(ids){			

			URL = ip+'/relProducao/numeroCrias';
			
			return $http.get(URL, {
				timeout: 9000,
				params: {ids: ids}
				}).then(function(response){					
				return response;
			}).catch(function(response){							
				return response;
			});
		},

		relOcorrenciasClinicas: function(ids){			

			URL = ip+'/relProducao/ocorrenciasClinicas';
			
			return $http.get(URL, {
				timeout: 9000,
				params: {ids: ids}
				}).then(function(response){					
				return response;
			}).catch(function(response){							
				return response;
			});
		},

		relControleParasitario: function(ids){			

			URL = ip+'/relProducao/controleParasitario';
			
			return $http.get(URL, {
				timeout: 9000,
				params: {ids: ids}
				}).then(function(response){					
				return response;
			}).catch(function(response){							
				return response;
			});
		},

		relVermifugacao: function(ids){			

			URL = ip+'/relProducao/vermifugacao';
			
			return $http.get(URL, {
				timeout: 9000,
				params: {ids: ids}
				}).then(function(response){					
				return response;
			}).catch(function(response){							
				return response;
			});
		},

		relPrevisaoPartos: function(ids){			

			URL = ip+'/relReproducao/previsaoPartos';
			
			return $http.get(URL, {
				timeout: 9000,
				params: {ids: ids}
				}).then(function(response){					
				return response;
			}).catch(function(response){							
				return response;
			});
		},

		relPartos: function(ids){			

			URL = ip+'/relReproducao/partos';
			
			return $http.get(URL, {
				timeout: 9000,
				params: {ids: ids}
				}).then(function(response){					
				return response;
			}).catch(function(response){							
				return response;
			});
		},

		relFemeasIdadeReprodutiva: function(ids){			

			URL = ip+'/relReproducao/femeasIdadeReprodutiva';
			
			return $http.get(URL, {
				timeout: 9000,
				params: {ids: ids}
				}).then(function(response){					
				return response;
			}).catch(function(response){							
				return response;
			});
		},


		relCoberturaReprodutor: function(ids){			

			URL = ip+'/relReproducao/coberturaReprodutor';
			
			return $http.get(URL, {
				timeout: 9000,
				params: {ids: ids}
				}).then(function(response){					
				return response;
			}).catch(function(response){							
				return response;
			});
		},

		relTamanhoEfetivo: function(ids){			

			URL = ip+'/relGenetico/tamanhoEfetivo';
			
			return $http.get(URL, {
				timeout: 9000,
				params: {ids: ids}
				}).then(function(response){					
				return response;
			}).catch(function(response){							
				return response;
			});
		},

		relIntervaloGeracao: function(id){			

			URL = ip+'/relGenetico/intervaloGeracao';
			
			return $http.get(URL, {
				timeout: 9000,
				params: {id: id}
				}).then(function(response){					
				return response;
			}).catch(function(response){							
				return response;
			});
		},

		relGanhoGenetico: function(ganhoGenetico){			

			URL = ip+'/relGenetico/ganhoGeneticoEsperado';
			
			return $http.get(URL, {
				timeout: 9000,
				params: {id: ganhoGenetico.rebanho.id,
						propMachos: ganhoGenetico.propMachos,
						propFemeas: ganhoGenetico.propFemeas,
						herdabilidade: ganhoGenetico.herdabilidade,
						ajuste: ganhoGenetico.ajuste,
						intensidadeFemea: ganhoGenetico.intensidadeFemea,
						intensidadeMacho: ganhoGenetico.intensidadeMacho}
				}).then(function(response){					
				return response;
			}).catch(function(response){							
				return response;
			});
		}

	}

}]);