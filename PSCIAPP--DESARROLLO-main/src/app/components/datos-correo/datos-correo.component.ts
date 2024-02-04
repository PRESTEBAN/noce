import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { UserService } from '../../services/user.service';
import { Observable, of } from 'rxjs';  
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { CollectionReference, Query } from '@angular/fire/compat/firestore';


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

  dias: number[] = Array.from({ length: 31 }, (_, i) => i + 1);
  meses: number[] = Array.from({ length: 12 }, (_, i) => i + 1);
  anos: number[] = Array.from({ length: 27 }, (_, i) => 2004 + i);

  datosSubscription: Subscription | undefined;
  loading: any;
  datos$: Observable<any[]> = of([]); 

  constructor(
    private loadingController: LoadingController,
    private userService: UserService,
    private router: Router
  ) { }

  async submitForm() {
    this.loading = await this.loadingController.create({
      message: 'Cargando...',
      duration: 2000,
    });
    await this.loading.present();
  
    const userId = this.userService.getUserId();
    if (userId) {
      await this.userService.saveFormDataCorreo(userId, this.nombre, `${this.dia}/${this.mes}/${this.ano}`, this.genero);

      await this.userService.sendUserNameToServer(userId, this.nombre);
      localStorage.setItem(`correoContraseñaNombre_${userId}`, this.nombre);

      setTimeout(() => {
        this.loading.dismiss();
      }, 2000);
    }
    this.router.navigate(['/principal2', { nombre: this.nombre }]);
  }

  misDatos: any[] = [];

  async recibirDatos() {
    const userId = this.userService.getUserId();
  
    if (userId) {
      const formDataCollectionRef: AngularFirestoreCollection<any> = this.userService.getFirestore().collection<any>(`form-data-Correo`);
  
      if (formDataCollectionRef) {
        const whereFn: (field: string | CollectionReference | Query, operator: any, value: any) => Query = formDataCollectionRef.ref.where.bind(formDataCollectionRef.ref);
        const query: Query = whereFn('userId', '==', userId);
  
        query
          .get()
          .then((snapshot) => {
            const datos = snapshot.docs.map(doc => doc.data());
            console.log('Datos recibidos:', datos);
            this.misDatos = datos;
          })
          .catch((error) => {
            console.error("Error al recibir datos:", error);
          });
      } else {
        console.error("No se pudo obtener la referencia de la colección form-data-Correo.");
      }
    } else {
      console.error("No se pudo obtener el ID de usuario.");
    }
  }

  ngOnDestroy() {
    if (this.datosSubscription) {
      this.datosSubscription.unsubscribe();
    }
  }

  ngOnInit() {}

}
