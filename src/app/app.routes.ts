import { ProductionLineComponent } from './production-line/production-line.component';
import { SearchComponent } from './search/search.component';

export const APP_ROUTES = [
    { path: 'production-line', component: ProductionLineComponent },
    { path: 'search', component: SearchComponent },
    { path: '**', redirectTo: '/production-line' }
];
