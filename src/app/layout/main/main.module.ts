import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { MainService } from './main.service';
import { PageHeaderModule } from './../../shared';
import { MatButtonModule } from '@angular/material';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';

@NgModule({
    imports: [
            CommonModule,
            MainRoutingModule,
            PageHeaderModule,
            MatButtonModule,
            MatProgressBarModule,
            MatProgressSpinnerModule,
            MatDividerModule,
            MatButtonToggleModule,
            FormsModule,
            ReactiveFormsModule
        ],
    declarations: [MainComponent],
    providers: [MainService]
})
export class MainModule {}
