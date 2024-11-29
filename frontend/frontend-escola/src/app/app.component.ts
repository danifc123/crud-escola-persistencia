import { Component } from '@angular/core';
import { PaginaInicialService } from './editar-professor/services/pagina-inicial.services';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'frontend-escola';
  mostrarTabela: boolean = true;
  constructor(
    private paginaInicial: PaginaInicialService,
    private router: Router
  ) {}
  ngOnInit() {
    this.carregarInicio();

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.verificarRota(event.urlAfterRedirects);
      }
    });
  }

  displayedColumns: string[] = [
    'professor',
    'turma',
    'disciplina',
    'sala',
    'status',
  ];
  pesquisaResultados: any[] = [];
  nomePesquisa: string = '';

  verificarRota(url: string) {
    const rotasOcultarTabela = [
      '/pagina-inicial',
      '/adicionar-professor',
      '/adicionar-disciplina',
      '/adicionar-turma',
      '/adicionar-sala',
      '/editar-professor',
      '/editar-disciplina',
      '/editar-turma',
      '/editar-sala',
      '/disciplinas',
      '/turmas',
      '/salas',
      '/professores',
      '/reativar-disciplina',
      '/reativar-turma',
      '/reativar-sala',
      '/reativar-professor',
      '/alunos',
      '/adicionar-aluno',
      '/reativar-aluno',
      '/editar-aluno',
      '/turma-has-alunos',
      '/adicionar-turma-has-aluno',
      '/editar-turma-has-aluno',
    ];

    const rotaComParametroId =
      /\/editar-(sala|disciplina|professor|turma|aluno|turma-has-aluno)\/\d+$/;
    this.mostrarTabela =
      !rotasOcultarTabela.includes(url) && !rotaComParametroId.test(url);
  }

  carregarInicio() {
    this.paginaInicial.getInicio().subscribe((data) => {
      console.log('Dados recebidos:', data);
      this.pesquisaResultados = data;
    });
  }
  pesquisarProfessor() {
    if (this.nomePesquisa.trim() === '') {
      alert('Por favor, insira o nome do professor para pesquisar.');
      return;
    }

    this.paginaInicial.pesquisarProfessor(this.nomePesquisa).subscribe(
      (resultados) => {
        console.log('Resultados da pesquisa:', resultados);
        this.pesquisaResultados = resultados;
      },
      (error) => {
        alert('Erro ao buscar professor: ' + error.message);
      }
    );
  }
  ngOnDestroy(): void {
    this.displayedColumns = [];
  }
}
