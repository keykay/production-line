import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';

@Component({
  selector: 'app-stock-injector',
  templateUrl: './stock-injector.component.html',
  styleUrls: ['./stock-injector.component.css']
})
export class StockInjectorComponent implements OnInit {

  @Input() min: number;
  @Input() max: number;
  @Input() step: number;
  @Output() injectStockCallback: EventEmitter<number> = new EventEmitter<number>();
  amount = 0;

  constructor() { }

  ngOnInit() {
  }

  injectStock(): void {
    this.injectStockCallback.emit(this.amount);
  }

  updateSliderAmount($event: MatSliderChange) {
    this.amount = $event.value;
  }
}
