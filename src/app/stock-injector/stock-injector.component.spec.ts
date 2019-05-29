import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockInjectorComponent } from './stock-injector.component';

describe('StockInjectorComponent', () => {
  let component: StockInjectorComponent;
  let fixture: ComponentFixture<StockInjectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockInjectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockInjectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
