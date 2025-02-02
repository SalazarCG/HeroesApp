import { Component } from '@angular/core';

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
}
