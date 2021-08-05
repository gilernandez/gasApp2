import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirestoreService } from '../../../services/firestore.service';
import { Pregunta } from '../../../models';

@Component({
  selector: 'app-pregunta',
  styleUrls: ['./pregunta.component.scss'],
  templateUrl: './pregunta.component.html'

})
export class PreguntaComponent implements OnInit, AfterViewInit {

  questions: Pregunta[] = [
    {
      foto: '',
      fecha: null,
      id: '',
      order: 0,
      pregunta: '',
      respuestas: ['']
    }
  ];

  textoBtn = {
    msg: '',
    init: 'Siguente Pregunta',
    end: 'Finalizar Encuesta'
  };
  questionsLength: number;
  selected = 0;

  constructor(
    public router: Router,
    private db: FirestoreService
  ) { }

  ngOnInit() {
    this.db.getCollection<Pregunta>('preguntas').subscribe(
      res => {
        console.log(res);
        this.questions = res;
        this.questionsLength = this.questions.length - 1;
        this.textoBtn.msg = this.textoBtn.init;
      }
    );
  }
  ngAfterViewInit() { }

  next() {
    if (this.selected < this.questionsLength) {
      this.selected += 1;
      if (this.selected === this.questionsLength) {
        this.textoBtn.msg = this.textoBtn.end;
      }
    } else {
      this.textoBtn.msg = this.textoBtn.init;
      this.selected = 0;
      this.router.navigate([`home/`]);
      return;
    }
  }
}
