import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Router } from '@angular/router';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { UserService } from '../../services/user.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
@Component({
  selector: 'app-cards-personalidadcorreo',
  templateUrl: './cards-personalidadcorreo.component.html',
  styleUrls: ['./cards-personalidadcorreo.component.scss'],
  animations: [
    trigger('buttonAnimation', [
      state('clicked', style({
        transform: 'scale(1.1)',
        backgroundColor: '#4caf50', // Cambia el color de fondo según tus preferencias
      })),
      state('unclicked', style({
        transform: 'scale(1)',
        backgroundColor: '',
      })),
      transition('unclicked => clicked', animate('300ms ease-in-out')),
      transition('clicked => unclicked', animate('300ms ease-in-out')),
    ]),
  ],
})
export class CardsPersonalidadcorreoComponent  implements OnInit {
  buttonEnabled = false; // deshabilitar boton
  buttonClicked = 'unclicked';
  loading: any;

  cards = [
    { name: 'Levi: Levi es una IA relajada y calmada. Su enfoque se basa en inducir la tranquilidad y reducir el estrés. Proporciona meditaciones guiadas y consejos para mantener la calma. ',image: 'https://i.ibb.co/vw0LdKr/pesantez.png' },
    { name: 'Suri: Suri es una IA amigable y compasiva. Su enfoque principal es brindar apoyo emocional y proporcionar información tranquilizadora. Siempre trata a los usuarios con empatía y amabilidad ', image: 'https://i.ibb.co/R4shwS8/Suri.png' },
    { name: 'Adam: Adam es una IA práctica y analítica. Se centra en ofrecer soluciones basadas en datos y enfoques probados para abordar la ansiedad. Siempre busca proporcionar estrategias efectivas. ', image: 'https://i.ibb.co/vsw4jKp/Panjon.png' },
    { name: 'Lee:  Lee es una IA informativa y educativa. Se enfoca en proporcionar conocimiento sobre la ansiedad, sus causas y formas de manejarla. Busca empoderar a los usuarios a través de la comprensión', image: 'https://i.ibb.co/7S4H9tP/S-ria.png' },
    { name: 'Daya: Daya es una IA optimista y motivadora. Su objetivo es inspirar a los usuarios a superar la ansiedad. Proporciona sugerencias positivas y técnicas para manejar el estrés.  ', image: 'https://i.ibb.co/Tb6jRcn/Amelia.png"' },
    { name: 'Sara:  Sara es una IA comprensiva y paciente. Está diseñada para escuchar atentamente y ofrecer apoyo emocional personalizado. Siempre se preocupa por el bienestar del usuario.', image: 'https://i.ibb.co/Lv2wM6D/Sara.png' },
  ];

  selectedCard: number | null = null;

  async selectCard(index: number) {
    this.selectedCard = index;
    this.toggleButton();

    try {
      const user = await this.afAuth.currentUser; // Obtenemos el usuario actualmente autenticado
      if (user) {
        const userId = user.uid; // Obtenemos el ID del usuario
        // Guardamos la elección del usuario en Firestore
        this.userService.saveUserChoice(userId, index + 1); 
      } else {
        console.error('No hay usuario autenticado.');
      }
    } catch (error) {
      console.error('Error al obtener el usuario autenticado:', error);
    }
  }

 async toggleButton() {
    this.buttonEnabled = true;
}

  async goToChat() {//direccionamiento a chat
    this.router.navigate(['/datos-correo']);
  } 

  constructor(private router: Router, private sharedService: SharedServiceService, private userService: UserService,  private afAuth: AngularFireAuth   ) { }

  ngOnInit() {}

}
