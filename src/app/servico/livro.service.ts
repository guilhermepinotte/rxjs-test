import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { Item, Livro, LivrosResultado } from '../models/interfaces';
import { LivroVolumeInfo } from '../models/livroVolumeInfo';

@Injectable({
  providedIn: 'root',
})
export class LivroService {
  private readonly API = 'https://www.googleapis.com/books/v1/volumes';
  private livro: Livro;

  constructor(private http: HttpClient) {}

  buscar(valorDigitado: string): Observable<LivrosResultado> {
    const params = new HttpParams().append('q', valorDigitado);

    return this.http.get<LivrosResultado>(this.API, { params })
      // .pipe(
      //   tap((returnAPI) => console.log(returnAPI)),
      //   map((resultado) => resultado.items ?? [])
      // );
  }

  getLivro(): Livro {
    return this.livro;
  }

  setLivro(livro: Livro) {
    this.livro = livro;
  }
}
