import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MainService {

    saveProgramWorkoutUrl = environment.saveProgramWorkoutUrl;
    updateProgramWorkoutUrl = environment.updateProgramWorkoutUrl;
    getUserDataUrl = environment.getUserDataUrl;

    constructor(private http: HttpClient) {}

    saveProgramWorkout(data: any) {
        return this.http.post(this.saveProgramWorkoutUrl, data)
            .pipe(map(res => res));
    }

    updateProgramWorkout(data: any) {
        return this.http.put(this.updateProgramWorkoutUrl, data)
            .pipe(map(res => res));
    }

    getUserData(userName: string) {
        return this.http.get(this.getUserDataUrl + userName)
            .pipe(map(res => res));
    }
}
