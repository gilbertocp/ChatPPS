import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from 'firebase';
import { Observable, of } from 'rxjs';
import { switchMap, first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public user$: Observable<User>;

  constructor(
    private afAuth: AngularFireAuth, 
    private db: AngularFirestore
  ) { 
    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.db.doc(`usuarios/${user.uid}`).valueChanges();
        }
        return of(null);
      })
    );
  }

  login(email: string, password: string): Promise<firebase.auth.UserCredential> {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  isLogged(): boolean {
    if(localStorage.getItem('conversando_en_el_aula_login'))
      return true;

    return false;
  }

  getCurrentUser(): Observable<User> {
    return this.afAuth.authState.pipe(first());
  }

  logout(): void {
    localStorage.removeItem('conversando_en_el_aula_login');
    this.afAuth.signOut();
  }
}
