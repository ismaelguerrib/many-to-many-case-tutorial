import { MenuItem } from '@casejs/angular-library'

export const menuItems: MenuItem[] = [
{"label":"Movies","permissionsOr":["browseMovies","browseOwnMovies"],"routePath":"/movies","icon":"icon-grid","items":[]},

{"label":"Actors","permissionsOr":["browseActors","browseOwnActors"],"routePath":"/actors","icon":"icon-grid","items":[]},

  {
    label: 'Users',
    permissionsOr: ['browseUsers', 'browseRoles'],
    icon: 'icon-user',
    items: [
      {
        label: 'Users',
        permissionsOr: ['browseUsers'],
        routePath: '/users'
      },
      {
        label: 'Roles',
        permissionsOr: ['browseRoles'],
        routePath: '/roles'
      }
    ]
  }
]
