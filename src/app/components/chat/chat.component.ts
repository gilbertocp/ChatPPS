import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent, ModalController, NavParams } from '@ionic/angular';
import { ChatsService } from '../../services/chats.service';
import { AuthService } from 'src/app/services/auth.service';
import { Usuario } from '../../models/usuario';
import { Chat } from '../../models/chat';
import { Mensaje } from '../../models/message';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {

  chatProps: Chat;
  messages = [];
  myMessage: string;
  usuario: Usuario;
  @ViewChild(IonContent) content: IonContent;

  constructor(
    private navParams: NavParams,
    private modalCtlr: ModalController,
    private chatsSvc: ChatsService,
    private authSvc: AuthService
  ) {  }

  ngOnInit() {
    this.chatProps = this.navParams.get('chat');

    window.onkeyup = ({keyCode}) => keyCode === 13? this.sendMessage(): null; 

    this.authSvc.user$.subscribe(user =>  {
      this.usuario = {...user.data, docId: user.id} as Usuario;
    });

    this.chatsSvc.getChatMessages(this.chatProps.id).subscribe(messages => {
      this.messages = messages
      this.scrollToBottom();
    });

    this.scrollToBottom(true);
  }

  closeChat(): void {
    this.modalCtlr.dismiss();
  }

  sendMessage(): void {
    if(this.myMessage) {
      const message: Mensaje = {
        contenido: this.myMessage,
        usuarioDocId: this.usuario.docId,
        usuarioNombre: this.usuario.nombre,
        fecha: new Date()
      }
      this.chatsSvc.sendMessage(this.chatProps.id, message);
      this.myMessage = '';
    }
  }

  scrollToBottom(firstTime = false) {
    firstTime? 
    setTimeout(() => this.content.scrollToBottom(1000),950): 
    setTimeout(() => this.content.scrollToBottom(200), 200);
  }
}
