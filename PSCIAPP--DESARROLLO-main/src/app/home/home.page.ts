import { Component } from '@angular/core';
import { FirestoreService } from '../services/firestore.service';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { User } from 'firebase/auth';



@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private userService: UserService, private router: Router, private auth: Auth) {}
  
  
  loginWithGoogle() {
    this.userService.loginWithGoogle()
      .then((userCredential) => {
        console.log('User Credential:' , userCredential);

        // Verificar si el usuario es nuevo
        const user = userCredential.user as User;
        console.log('User Metadata:', user.metadata);


        const isNewUser = user.metadata.creationTime === user.metadata.lastSignInTime || !user.metadata.lastSignInTime;
        console.log('Is New User:', isNewUser);

        
        if (isNewUser) {
          // El usuario está iniciando sesión por primera vez
          console.log('Usuario nuevo');
          
          this.router.navigate(['/datos']);
          // Puedes redirigir a una página de bienvenida o realizar acciones específicas para nuevos usuarios.
        } else if(!isNewUser) {
          // El usuario ya estaba logueado
          console.log('Usuario existente');
          this.router.navigate(['/principal']);
        }
      })
      .catch(error => console.log(error));
  }
  
  logout() {
    const userId = this.userService.getUserId();
    if (userId !== undefined) {
      // Limpiar los mensajes al cerrar sesión
      const userMessagesRef = this.userService.getUserMessagesRef(userId);
  
      if (userMessagesRef) {
        userMessagesRef.get().subscribe(snapshot => {
          snapshot.forEach(doc => {
            doc.ref.delete();
          });
        });
      } else {
        console.error('User Messages Reference is null');
      }
    }
  
    this.userService.logout().then(() => {
      this.router.navigate(['/home']);
    }).catch((error) => {
      console.error('Error al cerrar sesión:', error);
    });
  }

}
