import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { ChatsService } from '../../services/chats.service';
import { ChatComponent } from '../../components/chat/chat.component';
import { Chat } from '../../models/chat';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  chatRooms: any = [];

  constructor(
    private authSvc: AuthService,
    private chatsSvc: ChatsService,
    private modalCtlr: ModalController,
    private loadingCtlr: LoadingController,
    private router: Router
  ) {  }

  ngOnInit(): void {
    const loading = this.loadingCtlr.create({
      message: 'Cargando. . .',
      duration: 1500
    }).then(loading => {
      loading.present()
    });

    this.chatsSvc.getChatRooms()
    .subscribe(
      chats => this.chatRooms = chats,
      err => console.log(err)
    );

  }

  onLogout(): void {
    this.authSvc.logout();
    this.router.navigate(['/login']);
  }

  openChat(chat: Chat): void {
    this.modalCtlr.create({
      component: ChatComponent,
      componentProps: {chat}
    })
    .then(modal => modal.present());
  }
  
}
