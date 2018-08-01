import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { LoginService } from './login.service';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
    imports: [CommonModule, FormsModule, LoginRoutingModule, MatButtonModule],
    declarations: [LoginComponent],
    providers: [LoginService]
})
export class LoginModule {}
