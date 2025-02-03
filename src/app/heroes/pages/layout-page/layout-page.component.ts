import { Component } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { Router } from '@angular/router';
import { User } from '../../../auth/interfaces/user.interface';

@Component({
  selector: 'app-layout-page',
  templateUrl: './layout-page.component.html',
  styleUrl: './layout-page.component.css',
})
export class LayoutPageComponent {
  public sidebarItems = [
    { label: 'Listado', icon: 'label', link: './list' },
    { label: 'Añadir', icon: 'add', link: './new-hero' },
    { label: 'Buscar', icon: 'search', link: './search' },
  ];

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  get user():User | undefined {
    return this.authService.currentUser;

  }

  onLogout(){
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
