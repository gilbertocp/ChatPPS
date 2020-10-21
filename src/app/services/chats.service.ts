import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Chat } from '../models/chat';
import { Mensaje } from '../models/message';

@Injectable({
  providedIn: 'root'
})
export class ChatsService {

  constructor(private db: AngularFirestore) { }

  getChatRooms() {
    return this.db.collection('chats').snapshotChanges().pipe(map(
      chats => chats.map(chat => {
        const data = chat.payload.doc.data() as Chat;
        data.id = chat.payload.doc.id;
        return data;
      })
    ));
  }

  getChatRoom(id: string) {
    return this.db.collection('chats')
          .doc(id)
          .valueChanges();  
  }

  getChatMessages(id: string) {
    return this.db.collection('chats')
          .doc(id)
          .collection('mensajes', ref => ref.orderBy('fecha', 'asc'))
          .valueChanges({idField: 'docId'});
  }

  sendMessage(id: string, message: Mensaje): void {
    this.db.collection('chats')
    .doc(id)
    .collection('mensajes')
    .add(message);
  }
}
