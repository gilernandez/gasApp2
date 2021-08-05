import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { SetPreguntasComponent } from './set-preguntas/set-preguntas.component';
import { PreguntasTableComponent } from './preguntas-table/preguntas-table.component';
import { RouterModule } from '@angular/router';




@NgModule({
  declarations: [SetPreguntasComponent, PreguntasTableComponent],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule
  ]
})
export class BackendModule { }
