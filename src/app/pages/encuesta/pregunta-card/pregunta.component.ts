import { Component, OnInit, AfterViewInit, Output, EventEmitter, ViewChild } from '@angular/core';
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
  @ViewChild('preguntas') pregunta;
  @Output() questionIndex = new EventEmitter<number>();
  @Output() qlength = new EventEmitter<number>();
  @Output() mensaje = new EventEmitter<string>();

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
  encuestadoId:string;
  questionsLength: number;
  selected = 0;

  isButtonDisabled: boolean;
  

  constructor(
    public router: Router,
    private db: FirestoreService,
    public loadingController: LoadingController,
  ) { }

  ngOnInit() {
    //this.isButtonDisabled = true;
    this.encuestadoId = this.db.getId();
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
    this.isButtonDisabled = true;
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
  next(back?:string) {
    this.pregunta.value = null;
    this.isButtonDisabled = false;
    if(back){
      this.selected --;
      this.questionIndex.emit(this.selected);
      this.textoBtn.msg = this.textoBtn.init;
      this.mensaje.emit(this.questions[this.selected].intro);
    }else{
      if (this.selected < this.questionsLength) {
        this.selected += 1;
        if (this.selected === this.questionsLength) {
          this.textoBtn.msg = this.textoBtn.end;
        }
        this.questionIndex.emit(this.selected);
        this.mensaje.emit(this.questions[this.selected].intro);
      } else {
        this.textoBtn.msg = this.textoBtn.init;
        this.selected = 0;
        this.router.navigate([`home/`]);
        return;
      }
    }
  }

  radioSelect(e: any){
    this.isButtonDisabled = false;
    const preguntaId = this.questions[this.selected].id; 
    const encuestadoId = this.encuestadoId;
    const respuestaSelected = e.detail;

    const respuesta = {
      [encuestadoId] : {
        encuestado: encuestadoId,
        preguntaId: preguntaId,
        respuesta: respuestaSelected
      }
    }
    
    this.db.createPregunta(respuesta, `respuestas/${preguntaId}/encuestados`, encuestadoId);
  }
  /*respuestaSelected(e): void {
    console.log(e.detail);
    console.log(e.detail.value);
  }*/
}
