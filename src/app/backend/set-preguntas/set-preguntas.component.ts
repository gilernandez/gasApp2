import { AfterViewInit, Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { MenuController } from '@ionic/angular';
import { FirestoreService } from '../../services/firestore.service';
import { Pregunta, Users } from '../../models';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-set-preguntas',
  templateUrl: './set-preguntas.component.html',
  styleUrls: ['./set-preguntas.component.scss'],
})
export class SetPreguntasComponent implements OnInit, AfterViewInit {
  nuevasPreguntasForm = new FormGroup({
    pregunta: new FormControl('')
  });
  pregunta = {
    id: this.db.getId(),
    placeholder: 'Ingrese una nueva pregunta',
    p: '',
    r: ['Si', 'No']
  };

  data: Pregunta = {
    pregunta: '',
    respuestas: this.pregunta.r,
    fecha: new Date(),
    foto: '',
    order: null,
    id: this.pregunta.id
  };
  title = {
    edit: 'Editar pregunta',
    new: 'Nueva Pregunta'
  };
  preguntaId: string;
  respuestas: any;
  hasRespuestas: boolean;
  newImage: string;

  constructor(
    public menucontroler: MenuController,
    private _fb: FormBuilder,
    public db: FirestoreService,
    private element: ElementRef,
    private renderer: Renderer2,
    private activatedRoute: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(res => {
      this.preguntaId = res.get('preguntaId');
      if (!res.has('preguntaId')) {
        return;
      }
      if ('new' === this.preguntaId) {
        this.nuevaPregunta();
        return;
      } else {
        this.db.getDoc<Pregunta>('preguntas/', this.preguntaId).subscribe(resp => {
          this.data = resp;
        });
      }
    });
  }

  ngAfterViewInit(): void {
    this.look4responses();
  }

  openMenu() {
    this.menucontroler.open('principal');
  }

  savePregunta() {
    this.look4responses();
    const resp: string[] = [];
    if (this.hasRespuestas) {
      // eslint-disable-next-line guard-for-in
      for (const i in this.respuestas) {
        if (this.respuestas[i].tagName === 'ION-INPUT') {
          resp.push(this.respuestas[i].value ? this.respuestas[i].value.trim() : this.respuestas[i].textContent.trim());
        }
      }
      const respuestas = resp.filter(el => el);
      this.data.respuestas = respuestas;

      this.data.id = (this.data.id) ? this.data.id : this.pregunta.id;
      this.data.order = this.data.order ? this.data.order : this.data.order = null;
      this.data.fecha = new Date();

      // eslint-disable-next-line max-len
      this.db[(false === !!this.preguntaId) ? 'createPregunta' : 'updateDoc'](this.data, 'preguntas/', this.data.id).then(this.router.navigate(['admin/']));
    }
  }

  addRespuesta() {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    (undefined === this.data.respuestas) ? this.data.respuestas = [''] : this.data.respuestas.push('');
  }

  nuevaPregunta() {
    this.data = {} as Pregunta;
    this.preguntaId = null;
    this.pregunta.id = this.db.getId();
  }

  deleteRespuesta(index: number) {
    this.data.respuestas.splice(index, 1);
  }

  uploadFile(e) {
    console.log(e);
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (image => {
        this.newImage = image.target.result as string;
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  }



  private look4responses() {
    this.respuestas = this.element.nativeElement.getElementsByClassName('respuesta');
    this.hasRespuestas = this.respuestas.length > 0;
  };
}