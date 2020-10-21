import { Route } from '@angular/compiler/src/core';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CheckloginGuard implements CanActivate {

  constructor(private authSvc: AuthService, private router: Router) { }

  canActivate(): boolean {
    if(this.authSvc.isLogged()) {
      this.router.navigate(['/home']);
      return false;
    }
    
    return true;
  }
  
}
