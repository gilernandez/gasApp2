import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuController, LoadingController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

import { PreguntaComponent } from './pregunta-card/pregunta.component';

@Component({
  selector: 'app-encuesta',
  templateUrl: './encuesta.page.html',
  styleUrls: ['./encuesta.page.scss'],
})
export class EncuestaPage implements OnInit {
  @ViewChild('ref', { read: PreguntaComponent })
  ref: PreguntaComponent;

  user: string;
  isAdmin: boolean;
  constructor(
    public menucontroler: MenuController,
    public loadingController: LoadingController,
    private auth: AuthService,
    public router: Router
  ) { }

  ngOnInit() {
    this.isLoggedIn();
  }

  openMenu() {
    this.menucontroler.open('principal');
  }
  isLoggedIn() {
    this.auth.isLogedIn().subscribe(
      res => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        res === false ? this.router.navigate([`login/`]) : null;
        if (sessionStorage.getItem('sesion')) {
          this.user = JSON.parse(sessionStorage.getItem('sesion')).id;
          this.isAdmin = JSON.parse(sessionStorage.getItem('sesion')).pos === 'admin';
        }
      }
    );
  }
  logOut() {
    this.auth.logout();
    this.user = null;
    this.isAdmin = null;
  }
  nextQuote(event) {
    this.ref.next();
  }

}
