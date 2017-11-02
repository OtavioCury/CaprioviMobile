angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
    .state('opcoes', {
    url: '/incial',
    templateUrl: 'templates/opcoes.html',
    abstract:true
  })

  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  })

  .state('opcoes.cadastros', {
    url: '/cadastros',
    views: {
      'tab3': {
        templateUrl: 'templates/templateCadastros/cadastros.html',
        controller: 'cadastrosCtrl'
      }
    }
  })

  .state('opcoes.controleAnimal', {
    url: '/controle',
    views: {
      'tab1': {
        templateUrl: 'templates/templateControle/controleAnimal.html',
        controller: 'controleAnimalCtrl'
      }
    }
  })

  .state('opcoes.relatorios', {
    url: '/relatorios',
    views: {
      'tab2': {
        templateUrl: 'templates/templateRelatorio/relatorios.html',
        controller: 'relatoriosCtrl'
      }
    }
  })

  .state('opcoes.fazendas', {
    url: '/fazendas',
    views: {
      'tab3': {
        templateUrl: 'templates/templateCadastros/fazendas.html',
        controller: 'fazendasCtrl'
      }
    }
  })

  .state('opcoes.rebanhos', {
    url: '/rebanhos',
    views: {
      'tab3': {
        templateUrl: 'templates/templateCadastros/rebanhos.html',
        controller: 'rebanhosCtrl'
      }
    }
  })

  .state('opcoes.animais', {
    url: '/animais',
    views: {
      'tab3': {
        templateUrl: 'templates/templateCadastros/animais.html',
        controller: 'animaisCtrl'
      }
    }
  })

  .state('opcoes.manejos', {
    url: '/manejos',
    views: {
      'tab1': {
        templateUrl: 'templates/templateControle/manejos.html',
        controller: 'manejosCtrl'
      }
    }
  })

  .state('opcoes.movimentacoes', {
    url: '/movimentacoes',
    views: {
      'tab1': {
        templateUrl: 'templates/templateControle/movimentacoes.html',
        controller: 'movimentacoesCtrl'
      }
    }
  })

  .state('opcoes.ocorrencias', {
    url: '/ocorrencia',
    views: {
      'tab1': {
        templateUrl: 'templates/templateControle/ocorrencias.html',
        controller: 'ocorrenciasCtrl'
      }
    }
  })

  .state('opcoes.controles', {
    url: '/controleParasitario',
    views: {
      'tab1': {
        templateUrl: 'templates/templateControle/controles.html',
        controller: 'controlesCtrl'
      }
    }
  })

  .state('opcoes.vacinacoes', {
    url: '/vacinacoes',
    views: {
      'tab1': {
        templateUrl: 'templates/templateControle/vacinacoes.html',
        controller: 'vacinacoesCtrl'
      }
    }
  })

  .state('cadastroFazenda', {
    url: '/cadastroFazenda',
    templateUrl: 'templates/templateCadastros/cadastroFazenda.html',
    controller: 'cadastroFazendaCtrl'
  })

  .state('cadastroAnimal', {
    url: '/cadastroAnimal',
    templateUrl: 'templates/templateCadastros/cadastroAnimal.html',
    controller: 'cadastroAnimalCtrl'
  })

  .state('cadastroRebanho', {
    url: '/cadastroRebanho',
    templateUrl: 'templates/templateCadastros/cadastroRebanho.html',
    controller: 'cadastroRebanhoCtrl'
  })

  .state('cadastroManejo', {
    url: '/cadastroManejo',
    templateUrl: 'templates/templateControle/cadastroManejo.html',
    controller: 'cadastroManejoCtrl'
  })

  .state('cadastroMovimentacao', {
    url: '/cadastroMovimentacao',
    templateUrl: 'templates/templateControle/cadastroMovimentacao.html',
    controller: 'cadastroMovimentacaoCtrl'
  })

  .state('cadastroOcorrencia', {
    url: '/cadastroOcorrenciaa',
    templateUrl: 'templates/templateControle/cadastroOcorrencia.html',
    controller: 'cadastroOcorrenciaCtrl'
  })

  .state('cadastroControle', {
    url: '/cadastroControle',
    templateUrl: 'templates/templateControle/cadastroControle.html',
    controller: 'cadastroControleCtrl'
  })

  .state('cadastroVacinacao', {
    url: '/cadastroVacinacao',
    templateUrl: 'templates/templateControle/cadastroVacinacao.html',
    controller: 'cadastroVacinacaoCtrl'
  })

  .state('opcoes.medicamentos', {
    url: '/medicamentos',
    views: {
      'tab3': {
        templateUrl: 'templates/templateCadastros/medicamentos.html',
        controller: 'medicamentosCtrl'
      }
    }
  })

  .state('opcoes.doencas', {
    url: '/doencas',
    views: {
      'tab3': {
        templateUrl: 'templates/templateCadastros/doencas.html',
        controller: 'doencasCtrl'
      }
    }
  })

  .state('cadastroMedicamento', {
    url: '/cadastroMedicamento',
    templateUrl: 'templates/templateCadastros/cadastroMedicamento.html',
    controller: 'cadastroMedicamentoCtrl'
  })

  .state('opcoes.racas', {
    url: '/racas',
    views: {
      'tab3': {
        templateUrl: 'templates/templateCadastros/racas.html',
        controller: 'racasCtrl'
      }
    }
  })

  .state('cadastroRaca', {
    url: '/cadastroRaca',
    templateUrl: 'templates/templateCadastros/cadastroRaca.html',
    controller: 'cadastroRacaCtrl'
  })

  .state('cadastroDoenca', {
    url: '/cadastroDoenca',
    templateUrl: 'templates/templateCadastros/cadastroDoenca.html',
    controller: 'cadastroDoencaCtrl'
  })

  .state('relAnimaisPorEntrada', {
    url: '/relAnimaisPorEntrada',
    templateUrl: 'templates/templateRelatorio/relAnimaisPorEntrada.html',
    controller: 'relAnimaisPorEntradaCtrl'
  })

  .state('relVermifugacao', {
    url: '/relVermifugacao',
    templateUrl: 'templates/templateRelatorio/relVermifugacao.html',
    controller: 'relVermifugacaoCtrl'
  })

  .state('relControleParasitario', {
    url: '/relControleParasitario',
    templateUrl: 'templates/templateRelatorio/relControleParasitario.html',
    controller: 'relControleParasitarioCtrl'
  })

  .state('relFemeasIdadeReprodutiva', {
    url: '/relFemeasIdadeReprodutiva',
    templateUrl: 'templates/templateRelatorio/relFemeasIdadeReprodutiva.html',
    controller: 'relFemeasIdadeReprodutivaCtrl'
  })

  .state('relMovimentacao', {
    url: '/relMovimentacao',
    templateUrl: 'templates/templateRelatorio/relMovimentacao.html',
    controller: 'relMovimentacaoCtrl'
  })

  .state('relNumeroCrias', {
    url: '/relNumeroCrias',
    templateUrl: 'templates/templateRelatorio/relNumeroCrias.html',
    controller: 'relNumeroCriasCtrl'
  })

  .state('relOcorrenciasClinicas', {
    url: '/relOcorrenciasClinicas',
    templateUrl: 'templates/templateRelatorio/relOcorrenciasClinicas.html',
    controller: 'relOcorrenciasClinicasCtrl'
  })

  .state('relPrevisaoPartos', {
    url: '/relPrevisaoPartos',
    templateUrl: 'templates/templateRelatorio/relPrevisaoPartos.html',
    controller: 'relPrevisaoPartosCtrl'
  })

  .state('relCoberturaReprodutor', {
    url: '/relCoberturaReprodutor',
    templateUrl: 'templates/templateRelatorio/relCoberturaReprodutor.html',
    controller: 'relCoberturaReprodutorCtrl'
  })

  .state('relTamanhoEfetivo', {
    url: '/relTamanhoEfetivo',
    templateUrl: 'templates/templateRelatorio/relTamanhoEfetivo.html',
    controller: 'relTamanhoEfetivoCtrl'
  })

  .state('relPartos', {
    url: '/relPartos',
    templateUrl: 'templates/templateRelatorio/relPartos.html',
    controller: 'relPartosCtrl'
  })

  .state('relIntervaloGeracao', {
    url: '/relIntervaloGeracao',
    templateUrl: 'templates/templateRelatorio/relIntervaloGeracao.html',
    controller: 'relIntervaloGeracaoCtrl'
  })

  .state('rebanhoRelatorio', {
    url: '/rebanhoRelatorio',
    templateUrl: 'templates/templateRelatorio/rebanhoRelatorio.html',
    controller: 'rebanhoRelatorioCtrl'
  })

  .state('rebanhoRelatorioGanho', {
    url: '/rebanhoRelatorioGanho',
    templateUrl: 'templates/templateRelatorio/rebanhoRelatorioGanho.html',
    controller: 'rebanhoRelatorioGanhoCtrl'
  })

  .state('relGanhoGenetico', {
    url: '/relGanhoGenetico',
    templateUrl: 'templates/templateRelatorio/relGanhoGenetico.html',
    controller: 'relGanhoGeneticoCtrl'
  })

$urlRouterProvider.otherwise('/login')

});