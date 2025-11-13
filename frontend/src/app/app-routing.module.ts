import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guards';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: 'login',
    loadComponent: () =>
      import('./components/login-component/login-component.component')
        .then(m => m.LoginComponent)
  },

  { path: 'home',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./components/folder-list/folder-list.component')
        .then(m => m.FolderListComponent)
  },
  { path: 'crear-prenda',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./components/garment-form/garment-form.component')
        .then(m => m.GarmentFormComponent)
  },
  { path: 'editar-prenda/:id',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./components/garment-edit/garment-edit.component')
        .then(m => m.GarmentEditComponent)
  },
  { path: 'outfits',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./components/outfit-list/outfit-list.component')
        .then(m => m.OutfitListComponent)
  },
  { path: 'crear-outfit',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./components/outfit-form/outfit-form.component')
        .then(m => m.OutfitFormComponent)
  },
  { path: 'carpetas',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./components/folder-list/folder-list.component')
        .then(m => m.FolderListComponent)
  },
  { path: 'crear-carpeta',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./components/folder-form/folder-form.component')
        .then(m => m.FolderFormComponent)
  },
  { path: 'carpetas/:id',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./components/folder-detail/folder-detail.component')
        .then(m => m.FolderDetailComponent)
  },
  { path: 'prendas',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./components/garment-list/garment-list.component')
        .then(m => m.GarmentListComponent)
  },
  { path: 'editar-carpeta/:id',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./components/folder-edit/folder-edit.component')
        .then(m => m.FolderEditComponent)
  },

  { path: 'outfits/:id',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./components/outfit-detail/outfit-detail.component')
        .then(m => m.OutfitDetailComponent)
  },
{
  path: 'register',
  loadComponent: () =>
    import('./components/register/register.component')
      .then(m => m.RegisterComponent)
},
{
  path: 'forgot',
  loadComponent: () =>
    import('./components/forgot/forgot.component')
      .then(m => m.ForgotComponent)
},

  { path: '**', redirectTo: 'home' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
