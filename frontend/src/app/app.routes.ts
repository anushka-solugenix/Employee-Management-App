import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Home } from './home/home';
import { AuthGuard } from './auth.guard';
import { Register } from './register/register';
import { LoginGuard } from './login/login.guard';
import { Popup } from './popup/popup';

export const routes: Routes = [
    { path:'', redirectTo:'/login', pathMatch:'full'},
    { path: 'login', component: Login, canActivate:[LoginGuard] },
    { path: 'home', component: Home, canActivate: [AuthGuard] },
    {path:'popup/:id', component: Popup, canActivate: [AuthGuard]},
    {path:'register', component:Register},
];
