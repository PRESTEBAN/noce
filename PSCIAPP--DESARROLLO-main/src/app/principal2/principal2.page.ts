import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from './../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-principal2',
  templateUrl: './principal2.page.html',
  styleUrls: ['./principal2.page.scss'],
})
export class Principal2Page implements OnInit {

  constructor(private route: ActivatedRoute,  private userService: UserService, private router: Router) { }

  nombreUsuarioCorreo: string = '';

  ngOnInit() {
    this. nombreUsuarioCorreo = this.userService.getUserNameCorreo();
  }

  irChat(){
    this.router.navigate(['/chat']);
  }

}
