import { Component, OnInit } from '@angular/core';
import { Colour, simulateHttpSearch } from './simulate-http-search';
import { FormControl } from '@angular/forms';
import { debounceTime, takeUntil, distinctUntilChanged, delay, map, concatMap, tap, mapTo } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';
import { interval } from 'rxjs/observable/interval';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  debounceSearchInputControl = new FormControl();
  throttlesearchinputControl = new FormControl();

  colours$: Subject<Colour[]> = new Subject<Colour[]>();
  destroyer$: Subject<any> = new Subject<any>();

  constructor() {

    of('Hello')
      .pipe(
        map(next => next + ' World')
      ).subscribe(console.log);

    // Hello World


  }

  ngOnInit() {

    /*  const theRace$ = race(
        interval(1000).pipe(concatMap(val => of(val).pipe(delay(val * 1000))), mapTo('#1')),
        interval(4000).pipe(mapTo('#2'))
      );
      theRace$.
  
      const source$ = of(1, 2, 3).pipe(
        tap(val => console.log(`Value before map: ${val}`)),
        map(x => x * 10),
        tap(val => console.log(`Value after map: ${val}`))
      );
      source$.subscribe(console.log);
  
  
  
  
  
  
  
  
      this.debounceSearchInputControl
        .valueChanges
        .pipe(
          takeUntil(this.destroyer$),
          debounceTime(1000),
          distinctUntilChanged()
        ).subscribe(
          term => {
            simulateHttpSearch(term).subscribe(
              colours => this.colours$.next(colours)
            );
          }
        );
  
        */
  }

}
