import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth'

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private userService: UserService, private router: Router, private afAuth: AngularFireAuth) {}
  
  ngOnInit() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        // Usuario autenticado, redirige a la pantalla principal
        this.router.navigate(['/principal2']);
      }
    });
  }
  
}
