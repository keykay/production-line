import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { interval } from 'rxjs/observable/interval';
import { filter, takeUntil, tap, shareReplay, scan, map, bufferCount, delay, mapTo } from 'rxjs/operators';
import { BlockOfSteel } from '../model/block-of-steel.model';
import { BlockOfCeramic } from '../model/block-of-ceramic.model';
import { Observable } from 'rxjs/Observable';
import { CeramicPan } from '../model/ceramic-pan';
import { SteelPanHandle } from '../model/steel-pan-handle.model';
import { Pan } from '../model/pan.model';
import 'rxjs/add/observable/zip';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-production-line',
  templateUrl: './production-line.component.html',
  styleUrls: ['./production-line.component.css']
})
export class ProductionLineComponent implements OnInit, OnDestroy {

  steelStockAmount = 0;
  ceramicStockAmount = 0;

  accumulatedBlocksOfSteelArray: BlockOfSteel[] = [];
  accumulatedBlocksOfCeramicArray: BlockOfCeramic[] = [];
  totalPansArray: Pan[] = [];

  shutdown$: Subject<any> = new Subject<any>();

  steelStock$: Subject<BlockOfSteel> = new Subject<BlockOfSteel>();
  lastDiscardedSteelBlock$: Subject<BlockOfSteel> = new Subject<BlockOfSteel>();
  accumulatedBlocksOfSteel$: Subject<BlockOfSteel[]> = new Subject<BlockOfSteel[]>();
  accumulatedBlocksOfCeramic$: Subject<BlockOfCeramic[]> = new Subject<BlockOfCeramic[]>();

  steelSmelterWorking$: Subject<boolean> = new Subject<boolean>();
  ceramicSmelterWorking$: Subject<boolean> = new Subject<boolean>();
  assemblerWorking$: Subject<boolean> = new Subject<boolean>();

  steelOperator1$: Observable<BlockOfSteel>;
  steelOperator2$: Observable<string>;
  steelOperator3$: Observable<string>;
  steelOperator4$: Observable<BlockOfSteel[]>;
  steelOperator5$: Observable<SteelPanHandle>;

  ceramicStock$: Subject<BlockOfCeramic> = new Subject<BlockOfCeramic>();
  lastDiscardedCeramicBlock$: Subject<BlockOfCeramic> = new Subject<BlockOfCeramic>();
  ceramicOperator1$: Observable<BlockOfCeramic>;
  ceramicOperator2$: Observable<string>;
  ceramicOperator3$: Observable<string>;
  ceramicOperator4$: Observable<BlockOfCeramic[]>;
  ceramicOperator5$: Observable<CeramicPan>;

  assemblerOperator$: Observable<Pan>;
  totalPans$: Subject<Pan[]> = new Subject<Pan[]>();

  interval1$ = interval(1000).pipe(
    takeUntil(this.shutdown$)
  );

  interval2$ = interval(1500).pipe(
    takeUntil(this.shutdown$)
  );

  constructor(public snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.interval1$.subscribe(
      next => {
        if (this.steelStockAmount && this.steelStockAmount === 5) {
          this.snackBar.open('Steel stock is low!', null, {
            duration: 1000
          });
        }
        if (this.steelStockAmount && this.steelStock$.observers.length) {
          this.steelStock$.next(new BlockOfSteel());
          this.steelStockAmount--;
        }
      }
    );

    this.interval2$.subscribe(
      next => {
        if (this.ceramicStockAmount && this.ceramicStockAmount === 5) {
          this.snackBar.open('Ceramic stock is low!', null, {
            duration: 1000
          });
        }

        if (this.ceramicStockAmount && this.ceramicStock$.observers.length) {
          this.ceramicStock$.next(new BlockOfCeramic());
          this.ceramicStockAmount--;
        }
      }
    );

    this.setProductionLine();
  }

  ngOnDestroy(): void {
    this.shutdown$.next();
    this.shutdown$.complete();
  }

  injectSteelStock($event: number): void {
    this.steelStockAmount += $event;
  }

  injectCeramicStock($event: number): void {
    this.ceramicStockAmount += $event;
  }

  setProductionLine(): void {

    // Ceramic Operator #1
    // - Takes ceramic blocks from stock
    this.ceramicOperator1$ = this.ceramicStock$.pipe(
      shareReplay()
    );

    // Ceramic Operator #2
    // - Takes discarded ceramic blocks
    // - Updates last discarded block
    // - Counts total discarded weight
    this.ceramicOperator2$ = this.ceramicOperator1$.pipe(
      filter(block => block.weight < 3),
      tap(block => this.lastDiscardedCeramicBlock$.next(block)),
      map(block => block.weight),
      scan((acc, cur) => acc + cur, 0),
      map(acc => acc.toFixed(2))
    );

    // Ceramic Operator #3
    // - Counts total kept ceramic
    this.ceramicOperator3$ = this.ceramicOperator1$.pipe(
      filter(block => block.weight >= 3),
      map(block => block.weight),
      scan((acc, cur) => acc + cur, 0),
      map(acc => acc.toFixed(2))
    );

    // Ceramic Operator #4
    // - Accumulates blocks in sets of 3, then emits as an array
    this.ceramicOperator4$ = this.ceramicOperator1$.pipe(
      filter(block => block.weight >= 3),
      tap(val => {
        this.accumulatedBlocksOfCeramicArray = [...this.accumulatedBlocksOfCeramicArray, val];
        this.accumulatedBlocksOfCeramic$.next([...this.accumulatedBlocksOfCeramicArray]);
      }),
      bufferCount(3),
      delay(500),
      tap(val => {
        this.accumulatedBlocksOfCeramicArray = [];
        this.accumulatedBlocksOfCeramic$.next([]);
      }),
    );

    // Ceramic Operator #5
    // - Melts 3 blocks of ceramic into a shaped pan top
    this.ceramicOperator5$ = this.ceramicOperator4$.pipe(
      tap(val => this.ceramicSmelterWorking$.next(true)),
      delay(1500),
      mapTo(new CeramicPan()),
      tap(val => this.ceramicSmelterWorking$.next(false))
    );

    // Steel Operator #1
    // - Takes steel blocks from stock
    this.steelOperator1$ = this.steelStock$.pipe(
      shareReplay()
    );

    // Steel Operator #2
    // - Takes discarded steel blocks
    // - Updates last discarded block
    // - Counts total discarded weight
    this.steelOperator2$ = this.steelOperator1$.pipe(
      filter(block => block.weight < 7.5),
      tap(block => this.lastDiscardedSteelBlock$.next(block)),
      map(block => block.weight),
      scan((acc, cur) => acc + cur, 0),
      map(acc => acc.toFixed(2))
    );

    // Steel Operator #3
    // - Counts total kept steel
    this.steelOperator3$ = this.steelOperator1$.pipe(
      filter(block => block.weight >= 7.5),
      map(block => block.weight),
      scan((acc, cur) => acc + cur, 0),
      map(acc => acc.toFixed(2))
    );

    // Steel Operator #4
    // - Accumulates blocks in sets of 5, then emits as an array
    this.steelOperator4$ = this.steelOperator1$.pipe(
      filter(block => block.weight >= 7.5),
      tap(val => {
        this.accumulatedBlocksOfSteelArray = [...this.accumulatedBlocksOfSteelArray, val];
        this.accumulatedBlocksOfSteel$.next([...this.accumulatedBlocksOfSteelArray]);
      }),
      bufferCount(5),
      delay(500),
      tap(val => {
        this.accumulatedBlocksOfSteelArray = [];
        this.accumulatedBlocksOfSteel$.next([]);
      })
    );

    // Steel Operator #5
    // - Melts 3 blocks of steel into a shaped pan handle
    this.steelOperator5$ = this.steelOperator4$.pipe(
      tap(val => this.steelSmelterWorking$.next(true)),
      delay(3000),
      mapTo(new SteelPanHandle()),
      tap(val => this.steelSmelterWorking$.next(false))
    );

    // Assembler Operator
    // - Assembles the 2 parts into a functional pan
    this.assemblerOperator$ = Observable.zip(
      this.steelOperator5$,
      this.ceramicOperator5$
    ).pipe(
      tap(next => this.assemblerWorking$.next(true)),
      delay(2000),
      map(next => new Pan(next[1], next[0])),
      tap(next => this.assemblerWorking$.next(false))
    );

    this.assemblerOperator$.pipe(
      takeUntil(this.shutdown$)
    ).subscribe(next => {
      this.totalPansArray = [...this.totalPansArray, next];
      this.totalPans$.next(this.totalPansArray);
    });
  }
}
