import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export interface Department {
  id: string;
  name: string;
  icon: string;
  color: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  // Percorso assoluto dalla root del server per evitare errori su route figlie
  private configUrl = '/config/departments.json';

  constructor(private http: HttpClient) {}

  getDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(this.configUrl).pipe(
      tap(data => console.log('[ConfigService] Reparti caricati:', data)),
      catchError(err => {
        console.error('[ConfigService] Errore nel caricamento dei reparti:', err);
        return of([]);
      })
    );
  }
}
