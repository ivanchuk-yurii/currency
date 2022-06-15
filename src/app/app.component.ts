import { Component } from '@angular/core';
import { CurrencyApiService } from './services/currency-api.service';
import {
  Observable,
  BehaviorSubject,
  debounceTime,
  filter,
  map,
  switchMap,
  tap,
  combineLatest,
  startWith,
} from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Symbols } from './interface/symbols';
import { ConvertRequest } from './interface/convert-request';
import { Converted } from "./interface/converted";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public readonly formGroup = new FormGroup({
    from: new FormControl(null),
    to: new FormControl(null),
    amount: new FormControl(null, Validators.min(1)),
  });

  private readonly symbols$ = new BehaviorSubject<Symbols[]>([]);
  public readonly symbolsFrom$ = combineLatest([
    this.symbols$,
    this.formGroup.controls['to'].valueChanges.pipe(startWith(null)),
  ]).pipe(map(values => this.filterSymbols(values)));
  public readonly symbolsTo$ = combineLatest([
    this.symbols$,
    this.formGroup.controls['from'].valueChanges.pipe(startWith(null)),
  ]).pipe(map(values => this.filterSymbols(values)));

  public readonly converted$ = new BehaviorSubject<Converted | null>(null);
  public readonly isLoading$ = new BehaviorSubject<boolean>(false);

  constructor(private readonly currencyApiService: CurrencyApiService) { }

  ngOnInit(): void {
    this.initGetSymbols();
    this.initConvert();
  }

  public swapFromTo(): void {
    const { from, to } = this.formGroup.value;
    this.formGroup.patchValue({ from: to, to: from });
  }

  private filterSymbols([symbols, value]: [Symbols[], string]): Symbols[] {
    return symbols.filter(({ key }) => key !== value);
  }

  private initGetSymbols(): void {
    this.currencyApiService.getSymbols().pipe(
      map(({ symbols}) => Object.entries(symbols)
        .map(([key, name]) => ({ key, name }))
      )
    ).subscribe(symbols => this.symbols$.next(symbols));
  }

  private initConvert(): void {
    (this.formGroup.valueChanges as Observable<ConvertRequest>)
      .pipe(
        tap(() => this.converted$.next(null)),
        debounceTime(300),
        filter(({ from, to, amount}) => Boolean(from && to && amount && this.formGroup.valid)),
        tap(() => this.isLoading$.next(true)),
        switchMap(value => this.currencyApiService.convert(value)),
        tap(() => this.isLoading$.next(false)),
        map(({ result, info }) => ({
          amount: result.toFixed(2),
          rate: info.rate.toFixed(2),
        }))
      )
      .subscribe(value => this.converted$.next(value));
  }
}
