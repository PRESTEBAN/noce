import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from './../services/user.service';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
@Component({
  selector: 'app-principal2',
  templateUrl: './principal2.page.html',
  styleUrls: ['./principal2.page.scss'],
})
export class Principal2Page implements OnInit  {

  constructor(private route: ActivatedRoute,  private userService: UserService, private router: Router, private firestore: AngularFirestore) { }

  nombreUsuarioCorreo: string = '';
  cards: any[] = [];
  currentCard: any;
  secondCard: any;

  ngOnInit() {
    const userId = this.userService.getUserId();
    if (userId) {
      this.userService.getUserNameFromDatabase(userId).then(name => {
        this.nombreUsuarioCorreo = name;
        this.loadUserCards(userId);
        this.checkUserCardsUpdate(userId);
      });
    } else {
      this.nombreUsuarioCorreo = 'Invitado'; // Si no se encuentra el ID de usuario, establece el nombre como 'Invitado'
    }

    if (userId) {
      this.loadUserCards(userId);
      // Verificar si es medianoche y actualizar las tarjetas del usuario si es necesario
      this.checkUserCardsUpdate(userId);
    }
    
  }

 
  loadUserCards(userId: string) {
    const userCardsRef = this.firestore.collection('user_cards').doc(userId);
  
    userCardsRef.get().subscribe(snapshot => {
      if (snapshot.exists) {
        const userData = snapshot.data() as { currentCard: any, secondCard: any };
        this.currentCard = userData.currentCard;
        this.secondCard = userData.secondCard;
      } else {
        // If document doesn't exist, create it with default values
        userCardsRef.set({ currentCard: null, secondCard: null }).then(() => {
          console.log('User cards document created');
          // After creating the document, load random cards
          this.loadRandomCard(userId);
          this.loadSecondCard(userId);
        }).catch(error => {
          console.error('Error creating user cards document:', error);
        });
      }
    }, error => {
      console.error('Error loading user cards:', error);
    });
  }
  


  loadRandomCard(userId: string) {
    // Obtener una card aleatoria de la colección 'cards' de Firestore
    this.firestore.collection('cards').get().subscribe(querySnapshot => {
      const cards: { id: string, titulo: string, contenido: string, imagen: string }[] = [];
      querySnapshot.forEach(doc => {
        const data = doc.data() as {
          titulo: string,
          contenido: string,
          imagen: string
        };
        cards.push({
          id: doc.id,
          titulo: data.titulo,
          contenido: data.contenido,
          imagen: data.imagen
        });
      });
      // Obtener un índice aleatorio
      const randomIndex = Math.floor(Math.random() * cards.length);
      this.currentCard = cards[randomIndex];
      this.updateUserCard(userId, 'currentCard', this.currentCard);
    }, error => {
      console.error('Error al cargar la tarjeta aleatoria:', error);
    });
  }


  loadSecondCard(userId: string) {
    // Obtener una segunda tarjeta aleatoria de la colección 'cards' de Firestore
    this.firestore.collection('cards').get().subscribe(querySnapshot => {
      const cards: { id: string, titulo: string, contenido: string, imagen: string }[] = [];
      querySnapshot.forEach(doc => {
        const data = doc.data() as {
          titulo: string,
          contenido: string,
          imagen: string
        };
        cards.push({
          id: doc.id,
          titulo: data.titulo,
          contenido: data.contenido,
          imagen: data.imagen
        });
      });
  
      // Filtrar la segunda tarjeta para asegurarse de que sea diferente a la primera
      const filteredCards = cards.filter(card => card.id !== this.currentCard.id);
  
      // Obtener un índice aleatorio
      const randomIndex = Math.floor(Math.random() * filteredCards.length);
      this.secondCard = filteredCards[randomIndex];
      this.updateUserCard(userId, 'secondCard', this.secondCard);
    }, error => {
      console.error('Error al cargar la segunda tarjeta aleatoria:', error);
    });
  }

  updateUserCard(userId: string, cardType: string, cardData: any) {
    this.firestore.collection('user_cards').doc(userId).update({
      [cardType]: cardData
    }).then(() => {
      console.log(`Tarjeta ${cardType} actualizada para el usuario ${userId}`);
    }).catch(error => {
      console.error(`Error al actualizar la tarjeta ${cardType} para el usuario ${userId}:`, error);
    });
  }
  
  

 checkUserCardsUpdate(userId: string) {
  setInterval(() => {
    console.log('Verificando hora...');
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    // Verificar si es 11:00 - 11:25 o 10:55 - 10:59
    if (hours === 22 && minutes === 30 && seconds=== 0) {
      // Si cumple la condición, cargar nuevas tarjetas para el usuario
      console.log('Se cumple la condición de hora. Generando nuevas tarjetas...');
      this.loadRandomCard(userId);
      this.loadSecondCard(userId);
    }
  }, 1000); // Verificar cada minuto
}

  

  irChat(){
    this.router.navigate(['/chat']);
  }

  irPrincipal(){
    this.router.navigate(['/Principal2']);
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
