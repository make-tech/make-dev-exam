import { Injectable } from '@angular/core';
import { HttpClient } from '../../../node_modules/@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

    constructor(private http: HttpClient) { }

}
