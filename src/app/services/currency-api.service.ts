import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SymbolsResponse } from '../interface/symbols-response';
import { ConvertResponse } from '../interface/convert-response';
import { ConvertRequest } from '../interface/convert-request';

@Injectable({
  providedIn: 'root'
})
export class CurrencyApiService {
  private readonly apiLink = 'https://api.apilayer.com/fixer';
  private readonly headers = new HttpHeaders().set('apikey', 'IMZBQlIOAztdUmmEf8zmuhSOAdRibT1p');

  constructor(private readonly http: HttpClient) { }

  public getSymbols(): Observable<SymbolsResponse> {
    return this.http.get<SymbolsResponse>(`${this.apiLink}/symbols`, { headers: this.headers });
  }

  public convert({ from, to, amount }: ConvertRequest): Observable<ConvertResponse> {
    return this.http.get<ConvertResponse>(
      `${this.apiLink}/convert?from=${from}&to=${to}&amount=${amount}`,
      { headers: this.headers },
    );
  }
}
