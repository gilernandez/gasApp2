import { Component, OnInit, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { FirestoreService } from '../../../services/firestore.service';
import { Pregunta } from '../../../models';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-pregunta',
  styleUrls: ['./pregunta.component.scss'],
  templateUrl: './pregunta.component.html'

})
export class PreguntaComponent implements OnInit, AfterViewInit {

  @Output() questionIndex = new EventEmitter<number>();
  @Output() qlength = new EventEmitter<number>();

  loading: any;
  ready = false;
  questions: Pregunta[] = [
    {
      foto: null,
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
    private db: FirestoreService,
    public loadingController: LoadingController,
  ) { }

  ngOnInit() {
    this.presentLoading('', 'Cargando...', 10000);
    this.db.getCollection<Pregunta>('preguntas').subscribe(
      res => {
        const qlength = res.length;
        this.questions = res;
        this.questionsLength = this.questions.length - 1;
        this.textoBtn.msg = this.textoBtn.init;
        this.qlength.emit(qlength);
        this.ready = true;
        this.loading.dismiss();
      }
    );
  }
  ngAfterViewInit() {
  }

  async presentLoading(css?: string, message?: string, duration?: number) {
    this.loading = await this.loadingController.create({
      cssClass: css ? css : 'success',
      message: message ? message : 'Please wait...',
      duration: duration ? duration : 1500
    });
    await this.loading.present();

    const { role, data } = await this.loading.onDidDismiss();
  }
  next() {
    if (this.selected < this.questionsLength) {
      this.selected += 1;
      if (this.selected === this.questionsLength) {
        this.textoBtn.msg = this.textoBtn.end;
      }
      this.questionIndex.emit(this.selected);
    } else {
      this.textoBtn.msg = this.textoBtn.init;
      this.selected = 0;
      this.router.navigate([`home/`]);
      return;
    }
  }

  respuestaSelected(e): void {
    console.log(e.detail.value);
  }
}
