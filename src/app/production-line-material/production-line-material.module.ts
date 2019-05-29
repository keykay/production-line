import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSliderModule } from '@angular/material/slider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import {MatDividerModule} from '@angular/material/divider';

const MODULE_LIST = [
  MatToolbarModule,
  MatGridListModule,
  MatSliderModule,
  MatFormFieldModule,
  MatButtonModule,
  MatChipsModule,
  MatCardModule,
  MatIconModule,
  MatSnackBarModule,
  MatSidenavModule,
  MatInputModule,
  MatTableModule,
  MatDividerModule
];

@NgModule({
  imports: [...MODULE_LIST],
  exports: [...MODULE_LIST],
  declarations: []
})
export class ProductionLineMaterialModule { }
