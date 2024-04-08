import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Message } from '../models/message.model';
import { OpenaiService } from '../services/openai.service';
import { UserService } from '../services/user.service';
import { IonContent } from '@ionic/angular';
import { CustomValidators } from '../utils/custom-validators';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';
import { AngularFirestore } from '@angular/fire/compat/firestore';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  @ViewChild(IonContent, { static: false }) content!: IonContent;

  messages: Message[] = [];


  form = new FormGroup({
    promt: new FormControl('', [Validators.required, CustomValidators.noWhiteSpace])
  })

  selectedCardImageUrl: string = '';

  loading: boolean = false;


  constructor(
    private openAi: OpenaiService,
    private userService: UserService,
    private router: Router,
    private firestore: AngularFirestore
  ) { }

  async ngOnInit() {

    try {
      const userId = await this.userService.getUserId();
  
      if (userId !== undefined) {
        const userMessagesRef = this.userService.getUserMessagesRef(userId);
  
        if (userMessagesRef) {
          // Verifica si ya hay mensajes en la colección
          userMessagesRef.ref.orderBy('timestamp').get().then(snapshot => {
            this.messages = []; // Limpia el array antes de agregar los nuevos mensajes
            snapshot.forEach(doc => {
              const message = doc.data() as Message;
              if (message.sender === 'user') {
                message.imageUrl = 'http://imgfz.com/i/dqtw7Qy.png'; // Aquí establece la URL de la imagen del usuario
              }
              this.messages.push(message);
            });
            // Actualiza los mensajes y habilita el formulario después de cargarlos
            this.scrollToBottom();
            this.form.enable();
          });
        } else {
          console.error('User Messages Reference is null');
        }

        // Consulta el valor de 'choice' en la colección 'Images'
        this.firestore.collection('users').doc(userId).get().subscribe(doc => {
          if (doc.exists) {
            const data = doc.data() as { choice?: number }; 
            console.log('URL de la imagen seleccionada:', this.getBotImageUrl(data.choice || 0)); // Agrega esta línea
            if (data && typeof data.choice === 'number') { // Comprueba si data.choice es un número
              // Establece la URL de la imagen del bot según la elección del usuario
              this.selectedCardImageUrl = this.getBotImageUrl(data.choice);
            } else {
              console.error('No se encontró el campo "choice" en el documento de Images o no es un número.');
            }
          } else {
            console.error('El documento de Images no existe.');
          }
        }, error => {
          console.error('Error al obtener el valor de choice desde la colección Images: ' + error);
        });
        
      } else {
        console.error('User ID is undefined');
      }
    } catch (error) {
      console.error('Error during user messages reference creation:', error);
    }
  }

  submit() {
    const userId = this.userService.getUserId();
    if (this.form.valid) {
      let promt = this.form.value.promt as string;

      // mensaje del usuario
      let userMsg: Message = { sender: 'me', content: promt };
      this.messages.push(userMsg);

      // mensaje del usuario
      let botMsg: Message = { sender: 'bot', content: '' };
      this.messages.push(botMsg);

      this.scrollToBottom();
      this.form.reset();
      this.form.disable();
      this.loading = true;

      // Obtén el ID de usuario después de la autenticación
      const userId = this.userService.getUserId();

      if (userId !== undefined) {
        this.openAi.sendQuestion(promt, userId).subscribe({
          next: (res: any) => {
            this.typeText(res.bot.content);
            this.loading = false;
            this.form.enable();
        
            // Guardar mensajes en la colección de mensajes del usuario
            this.openAi.sendQuestion(promt, res.bot.content);
          },
          error: (error: any) => {
            console.log(error);
          },
        });
      } else {
        console.error('Usuario no autenticado');
      }
    }
  }

  typeText(text: string) {
    let textIndex = 0;
    let messagesLastIndex = this.messages.length - 1;

    let interval = setInterval(() => {
      if (textIndex < text.length) {
        this.messages[messagesLastIndex].content += text.charAt(textIndex);
        textIndex++;
      } else {
        clearInterval(interval);
        this.scrollToBottom();
      }
    }, 15)
  }

  scrollToBottom() {
    this.content.scrollToBottom(2000);
  }

  volver2(){
    this.router.navigate(['/principal2']);
  }

  getBotImageUrl(choice: number): string {
    switch (choice) {
      case 1:
        return 'https://i.ibb.co/vw0LdKr/pesantez.png'
      case 2:
        return 'https://i.ibb.co/R4shwS8/Suri.png'
      case 3:
        return 'https://i.ibb.co/vsw4jKp/Panjon.png'
      case 4:
        return 'https://i.ibb.co/7S4H9tP/S-ria.png'
      case 5:
        return 'https://i.ibb.co/Tb6jRcn/Amelia.png'
      case 6:
        return 'https://i.ibb.co/Lv2wM6D/Sara.png'
      default:
        return 'url_por_defecto'; // En caso de elección inválida
    }
  }

  


}