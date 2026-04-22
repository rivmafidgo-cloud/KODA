import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { NgClass } from '@angular/common';
import { Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { ConfigService, Department } from '../../services/config.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgClass],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class Home implements OnInit, OnDestroy {
  departments: Department[] = [];
  isLoading = true;
  hasError = false;
  
  ads: string[] = [
    'ads/ad1.png',
    'ads/ad2.png',
    'ads/ad3.png'
  ];
  currentAdIndex = 0;
  
  private adSubscription?: Subscription;
  private configSub?: Subscription;
  private timeoutId?: any;

  constructor(
    private router: Router,
    private configService: ConfigService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Timeout di fallback: se dopo 5 secondi i reparti non sono caricati, mostra errore.
    this.timeoutId = setTimeout(() => {
      if (this.isLoading) {
        console.error('Timeout caricamento reparti raggiunto (5 secondi).');
        this.isLoading = false;
        this.hasError = true;
        this.cdr.detectChanges();
      }
    }, 5000);

    // Carica la configurazione dei reparti
    this.configSub = this.configService.getDepartments().subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.departments = data;
          this.hasError = false;
        } else {
          this.hasError = true;
        }
        this.isLoading = false;
        this.cdr.detectChanges(); // Forza l'aggiornamento della UI
      },
      error: (err) => {
        console.error('Errore nel caricamento della configurazione:', err);
        this.hasError = true;
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });

    // Cambia immagine pubblicitaria ogni 5 secondi
    this.adSubscription = interval(5000).subscribe(() => {
      this.currentAdIndex = (this.currentAdIndex + 1) % this.ads.length;
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy() {
    if (this.adSubscription) this.adSubscription.unsubscribe();
    if (this.configSub) this.configSub.unsubscribe();
    if (this.timeoutId) clearTimeout(this.timeoutId);
  }

  selectDepartment(dept: Department) {
    this.router.navigate(['/ticket', dept.id]);
  }
}
