import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { ConfigService, Department } from '../../services/config.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class Home implements OnInit, OnDestroy {
  departments: Department[] = [];
  
  ads: string[] = [
    'ads/ad1.png',
    'ads/ad2.png',
    'ads/ad3.png'
  ];
  currentAdIndex = 0;
  
  private adSubscription?: Subscription;
  private configSub?: Subscription;

  constructor(
    private router: Router,
    private configService: ConfigService
  ) {}

  ngOnInit() {
    // Carica la configurazione dei reparti
    this.configSub = this.configService.getDepartments().subscribe({
      next: (data) => {
        this.departments = data;
      },
      error: (err) => {
        console.error('Errore nel caricamento della configurazione:', err);
      }
    });

    // Cambia immagine pubblicitaria ogni 5 secondi
    this.adSubscription = interval(5000).subscribe(() => {
      this.currentAdIndex = (this.currentAdIndex + 1) % this.ads.length;
    });
  }

  ngOnDestroy() {
    if (this.adSubscription) this.adSubscription.unsubscribe();
    if (this.configSub) this.configSub.unsubscribe();
  }

  selectDepartment(dept: Department) {
    this.router.navigate(['/ticket', dept.id]);
  }
}
