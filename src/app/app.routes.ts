import { Routes } from '@angular/router';
import { BuilderComponent } from './builder/builder.component';
import { AnswersComponent } from './answers/answers.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
    {
        path: 'form/builder',
        component: BuilderComponent
    },
    {
        path: 'form/ansers',
        component: AnswersComponent
    },
    {
        path: '',
        component: HomeComponent
    },
];
