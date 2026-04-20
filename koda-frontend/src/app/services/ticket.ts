import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';

export interface TicketResponse {
  ticketNumber: string;
  reparto: string;
  timestamp: Date;
  estimatedWaitMinutes: number;
}

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  constructor() { }

  /**
   * Simula la richiesta di un ticket al backend.
   * Restituisce un Observable per essere pronti all'integrazione con Spring Boot.
   * @param reparto Il reparto selezionato dall'utente (es. 'Salumeria', 'Pescheria')
   */
  issueTicket(reparto: string): Observable<TicketResponse> {
    // Genera un numero di ticket fittizio basato sul reparto
    const prefix = reparto.charAt(0).toUpperCase();
    const randomNum = Math.floor(Math.random() * 100).toString().padStart(2, '0');
    
    const simulatedResponse: TicketResponse = {
      ticketNumber: `${prefix}${randomNum}`,
      reparto: reparto,
      timestamp: new Date(),
      estimatedWaitMinutes: Math.floor(Math.random() * 15) + 2
    };

    // Simula un ritardo di rete di 800ms
    return of(simulatedResponse).pipe(delay(800));
  }
}
