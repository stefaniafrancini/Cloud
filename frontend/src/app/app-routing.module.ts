import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  {
  path: '',
  loadComponent: () =>
    import('./components/folder-list/folder-list.component').then(
      (m) => m.FolderListComponent
    )
},
  {
    path: 'crear-prenda',
    loadComponent: () =>
      import('./components/garment-form/garment-form.component').then(
        (m) => m.GarmentFormComponent
      )
  },
  {
    path: 'editar-prenda/:id',
    loadComponent: () =>
      import('./components/garment-edit/garment-edit.component').then(
        (m) => m.GarmentEditComponent
      )
  },
  {
    path: 'outfits',
    loadComponent: () =>
      import('./components/outfit-list/outfit-list.component').then(
        (m) => m.OutfitListComponent
      )
  },
  {
    path: 'crear-outfit',
    loadComponent: () =>
      import('./components/outfit-form/outfit-form.component').then(
        (m) => m.OutfitFormComponent
      )
  },
  {
    path: 'carpetas',
    loadComponent: () =>
      import('./components/folder-list/folder-list.component').then(
        (m) => m.FolderListComponent
      )
  },
  {
    path: 'crear-carpeta',
    loadComponent: () =>
      import('./components/folder-form/folder-form.component').then(
        (m) => m.FolderFormComponent
      )
  },
  {
    path: 'carpetas/:id',
    loadComponent: () =>
      import('./components/folder-detail/folder-detail.component').then(
        (m) => m.FolderDetailComponent
      )
  },
  {
  path: 'prendas',
  loadComponent: () =>
    import('./components/garment-list/garment-list.component').then(
      (m) => m.GarmentListComponent
    )
  },
  {
  path: 'editar-carpeta/:id',
  loadComponent: () =>
    import('./components/folder-edit/folder-edit.component').then(
      (m) => m.FolderEditComponent
    )
},


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
