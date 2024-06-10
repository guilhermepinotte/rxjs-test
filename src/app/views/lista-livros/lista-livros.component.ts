import { EMPTY, catchError, debounceTime, distinctUntilChanged, filter, map, of, switchMap, throwError } from 'rxjs';
import { Component } from '@angular/core';
import { LivroService } from 'src/app/servico/livro.service';
import { Livro, LivrosResultado } from 'src/app/models/interfaces';
import { FormControl } from '@angular/forms';

const TEMPO_DE_PAUSA = 300;

@Component({
  selector: 'app-lista-livros',
  templateUrl: './lista-livros.component.html',
  styleUrls: ['./lista-livros.component.css'],
})
export class ListaLivrosComponent {
  listaLivros: Livro[];
  campoBusca = new FormControl();
  livro: Livro;
  mensagemErro = ''
  livrosResultado: LivrosResultado;

  constructor(private service: LivroService) {}

  totalDeLivros$ = this.campoBusca.valueChanges.pipe(
    debounceTime(TEMPO_DE_PAUSA),
    filter((valorDigitado) => valorDigitado.length > 3),
    distinctUntilChanged(),
    switchMap((valorDigitado) => this.service.buscar(valorDigitado)),
    map((resultado) => this.livrosResultado = resultado),
    catchError((erro) => {
      // this.mensagemErro = 'Ops, ocorreu um erro. Recarregue a aplicação!'
      // return EMPTY;
      console.error(erro);
      return of();
    })
  );

  livrosEncontrados$ = this.campoBusca.valueChanges.pipe(
    debounceTime(TEMPO_DE_PAUSA),
    filter((valorDigitado) => valorDigitado.length > 3),
    distinctUntilChanged(),
    switchMap((valorDigitado) => this.service.buscar(valorDigitado)),
    map((resultado) => resultado.items ?? []),
    map((items) => this.livrosResultadoParaLivros(items)),
    catchError((erro) => {
      // this.mensagemErro = 'Ops, ocorreu um erro. Recarregue a aplicação!'
      // return EMPTY;
      console.error(erro);
      return throwError(() => new Error(this.mensagemErro = 'Erro ao buscar os livros, por favor recarregue a página'));
    })
  );

  // buscarLivro() {
  //   this.subscription = this.service.buscar(this.campoBusca).subscribe({
  //     next: (items) => {
  //       this.listaLivros = this.livrosResultadoParaLivros(items);
  //     },
  //     error: (erro) => console.error(erro),
  //   });
  // }

  livrosResultadoParaLivros(items): Livro[] {
    const livros: Livro[] = [];

    items.forEach((item) => {
      livros.push(
        (this.livro = {
          title: item.volumeInfo?.title,
          authors: item.volumeInfo?.authors,
          publisher: item.volumeInfo?.publisher,
          publishedDate: item.volumeInfo?.publishedDate,
          description: item.volumeInfo?.description,
          previewLink: item.volumeInfo?.previewLink,
          thumbnail: item.volumeInfo?.imageLinks?.thumbnail,
        })
      );
    });

    return livros;
  }

}
