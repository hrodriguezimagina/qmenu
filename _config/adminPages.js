export default {
//Menu List
  menus: {
    permission: 'menu.menus.manage',
    activated: true,
    path: '/menus',
    name: 'qmenu.admin.menus',
    crud: import('@imagina/qmenu/_crud/menus'),
    page: () => import('@imagina/qcrud/_pages/admin/crudPage'),
    layout: () => import('@imagina/qsite/_layouts/master.vue'),
    title: 'menu.cms.sidebar.adminMenus',
    icon: 'fa-light fa-list-dropdown',
    authenticated: true,
  },
  menusShow: {
    permission: 'menu.menus.edit',
    activated: true,
    path: '/menus/menu/:id',
    name: 'qmenu.admin.menus.show',
    page: () => import('@imagina/qmenu/_pages/admin/menus/show'),
    layout: () => import('@imagina/qsite/_layouts/master.vue'),
    title: 'menu.cms.sidebar.adminMenus',
    icon: 'fas fa-stream',
    authenticated: true,
  },
  menuItemsCreate: {
    permission: null,
    activated: true,
    path: '/menus/item/:menuId',
    name: 'qmenu.admin.menu.create',
    page: () => import('@imagina/qmenu/_pages/admin/menuItems/form'),
    layout: () => import('@imagina/qsite/_layouts/master.vue'),
    title: 'menu.cms.sidebar.adminMenuItems',
    icon: 'fas fa-circle',
    authenticated: true,
  },
  menuItemsUpdate: {
    permission: null,
    activated: true,
    path: '/menus/menu/:menuId/item/:id',
    name: 'qmenu.admin.menu.update',
    page: () => import('@imagina/qmenu/_pages/admin/menuItems/form'),
    layout: () => import('@imagina/qsite/_layouts/master.vue'),
    title: 'menu.cms.sidebar.adminMenuItems',
    icon: 'fas fa-circle',
    authenticated: true,
  },
}
