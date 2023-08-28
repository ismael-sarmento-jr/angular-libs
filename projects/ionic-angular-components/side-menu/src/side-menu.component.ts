import { Component, OnInit } from '@angular/core';
import { User, AuthenticationService } from 'ionic-angular-components/authentication';

export interface MenuOption {
  display: string;
  icon?: string;
  lines?: string;
  open?: boolean;
  suboptions?: MenuOption[];
  title: string;
  url?: string;
}

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
})
export class SideMenuComponent implements OnInit {

  user: User;
  authService: AuthenticationService
  
  generalOptions = [
    {
      url: '/home',
      icon: 'home',
      title: 'Início',
      display: 'loggedOut',
      lines: 'none'
    },
    {
      url: '/dashboard',
      icon: 'home',
      title: 'Início',
      display: 'loggedIn',
      lines: 'none'
    }/*,
    {
      url: '/fixtures/list',
      icon: 'star',
      title: 'Partidas ao Vivo',
      display: 'any',
      lines: 'none'
    }*/
  ];

  groupedOptions: MenuOption[] = [
    {
      icon: 'football',
      title: 'Groups',
      display: 'any',
      lines: 'none',
      suboptions: [
        {
          title: 'Buscar Groups',
          display: 'any',
          url: '/groups/search'
        },
        {
          title: 'Minhas Groups',
          display: 'loggedIn',
          url: '/groups/list'
        },
        {
          title: 'Criar Group',
          display: 'loggedIn',
          url: '/groups/new'
        }
      ]
    }
  ];

  userOptions: MenuOption[] = [
    {
      url: '/user-settings',
      icon: 'settings',
      title: 'Configurações do Aplicativo',
      display: 'loggedIn',
      lines: 'none'
    },
    {
      url: '/profiles',
      icon: 'person',
      title: 'Meu Perfil',
      display: 'loggedIn',
      lines: 'none'
    }
  ];

  constructor() {
    this.authService.currentUser$.subscribe(user => this.user = user);
  }

  ngOnInit() {}

  displayOption(display: string): boolean {
    if (display === 'any') {
      return true;
    } else if (display === 'loggedIn' && this.user && this.user.nickname) {
      return true;
    } else if (display === 'loggedOut' && (!this.user || !this.user.nickname)) {
      return true;
    }
    return false;
  }
}
