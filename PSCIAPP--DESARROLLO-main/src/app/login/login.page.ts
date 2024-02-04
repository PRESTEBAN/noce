import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  formReg: FormGroup;

  constructor(
    private userService: UserService,
    private router: Router
  ) {
    this.formReg = new FormGroup({
      email: new FormControl(),
      password: new FormControl()
    })
  }

  ngOnInit(): void {
  }
  onSubmit() {
    this.userService.login(this.formReg.value)
      .then(response => {
        console.log('Login successful:', response);
        this.router.navigate(['/principal2']);
      })
      .catch(error => {
        console.error('Login error:', error);
        if (error.code === 'auth/invalid-email') {
          console.log('Correo electrónico inválido.');
        } else if (error.code === 'auth/wrong-password') {
          console.log('Contraseña incorrecta.');
        } else {
          console.log('Error de autenticación:', error.message);
        }
      });
  }

  loginWithGoogle() {
    this.userService.loginWithGoogle()
      .then(response => {
        console.log(response);
        this.router.navigate(['/chat']);
      })
      .catch(error => console.log(error));
  } 
}
