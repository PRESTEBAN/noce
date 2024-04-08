import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { UserService } from '../../services/user.service';
import { Observable, of } from 'rxjs';  
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';



@Component({
  selector: 'app-datos-correo',
  templateUrl: './datos-correo.component.html',
  styleUrls: ['./datos-correo.component.scss'],
})
export class DatosCorreoComponent  implements OnInit {

  nombre: string = '';
  dia: number = 1;
  mes: number = 1;
  ano: number = 2004;
  genero: string = '';

  dias: number[] = [];
  meses: number[] = Array.from({ length: 12 }, (_, i) => i + 1);
  anos: number[] = Array.from({ length: 27 }, (_, i) => 2004 + i);


  loading: any;
  datos$: Observable<any[]> = of([]); 
  datosSubscription: Subscription | undefined;

  constructor(
    private loadingController: LoadingController,
    private userService: UserService,
    private router: Router,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.actualizarDias();
  }

  actualizarDias() {
    this.dias = [];
    const diasEnMes = new Date(this.ano, this.mes, 0).getDate(); // Obtiene la cantidad de días en el mes seleccionado
    for (let i = 1; i <= diasEnMes; i++) {
      this.dias.push(i);
    }
  }

  async submitForm() {

    if (!this.nombre || this.dia === undefined || this.mes === undefined || this.ano === undefined || !this.genero) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Por favor, complete todos los campos del formulario.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }
    
    this.loading = await this.loadingController.create({
      message: 'Cargando...',
      duration: 2000,
    });
    await this.loading.present();
  
    const userId = this.userService.getUserId();
    if (userId) {
      await this.userService.saveFormDataCorreo(userId, this.nombre, `${this.dia}/${this.mes}/${this.ano}`, this.genero);

      
      localStorage.setItem(`correoContraseñaNombre_${userId}`, this.nombre);

      setTimeout(() => {
        this.loading.dismiss();
      }, 2000);
    }
    this.router.navigate(['/principal2', { nombre: this.nombre }]);
  }


  misDatos: any[] = [];

  
  ngOnDestroy() {
    if (this.datosSubscription) {
      this.datosSubscription.unsubscribe();
    }
  }


}
