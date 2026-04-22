import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { NgClass } from '@angular/common';
import { Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { ConfigService, Department } from '../../services/config.service';

interface Product {
  name: string;
  departmentId: string;
  departmentName: string;
}

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
  
  // Search State
  isSearchActive = false;
  searchQuery = '';
  searchResults: Product[] = [];
  isKeyboardVisible = true;
  
  // Mock Database for Products
  private productDatabase: Product[] = [
    { name: 'Prosciutto di Parma', departmentId: 'salumeria', departmentName: 'Salumeria' },
    { name: 'Mortadella Bologna', departmentId: 'salumeria', departmentName: 'Salumeria' },
    { name: 'Mozzarella di Bufala', departmentId: 'salumeria', departmentName: 'Salumeria' },
    { name: 'Bistecca Fiorentina', departmentId: 'macelleria', departmentName: 'Macelleria' },
    { name: 'Pollo Intero', departmentId: 'macelleria', departmentName: 'Macelleria' },
    { name: 'Salmone Fresco', departmentId: 'pescheria', departmentName: 'Pescheria' },
    { name: 'Branzino', departmentId: 'pescheria', departmentName: 'Pescheria' },
    { name: 'Pane Integrale', departmentId: 'panetteria', departmentName: 'Panetteria' },
    { name: 'Focaccia Ligure', departmentId: 'panetteria', departmentName: 'Panetteria' },
    { name: 'Mele Fuji', departmentId: 'ortofrutta', departmentName: 'Ortofrutta' },
    { name: 'Pomodori Pachino', departmentId: 'ortofrutta', departmentName: 'Ortofrutta' }
  ];

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

  // --- Search Logic ---
  
  // Custom Keyboard Layout
  keyboardRows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫']
  ];

  toggleSearch() {
    this.isSearchActive = true;
    this.isKeyboardVisible = true;
    this.searchQuery = '';
    this.searchResults = [];
    this.cdr.detectChanges();
  }
  
  closeSearch() {
    this.isSearchActive = false;
    this.isKeyboardVisible = true;
    this.searchQuery = '';
    this.searchResults = [];
    this.cdr.detectChanges();
  }

  showKeyboard() {
    if (!this.isKeyboardVisible) {
      this.isKeyboardVisible = true;
      this.cdr.detectChanges();
    }
  }

  hideKeyboard() {
    if (this.isKeyboardVisible) {
      this.isKeyboardVisible = false;
      this.cdr.detectChanges();
    }
  }

  // Handle virtual keyboard press
  onKeyPress(key: string) {
    this.searchQuery += key;
    this.triggerSearch();
  }

  // Handle spacebar
  onSpace() {
    if (this.searchQuery.length > 0 && !this.searchQuery.endsWith(' ')) {
      this.searchQuery += ' ';
      this.triggerSearch();
    }
  }

  // Handle backspace
  onBackspace() {
    if (this.searchQuery.length > 0) {
      this.searchQuery = this.searchQuery.slice(0, -1);
      this.triggerSearch();
    }
  }

  // Actually filter the results
  private triggerSearch() {
    const query = this.searchQuery.toLowerCase().trim();
    
    if (query.length > 1) {
      this.searchResults = this.productDatabase.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.departmentName.toLowerCase().includes(query)
      );
    } else {
      this.searchResults = [];
    }
    this.cdr.detectChanges();
  }
  
  selectProductDepartment(deptId: string) {
    const dept = this.departments.find(d => d.id === deptId);
    if (dept) {
      this.selectDepartment(dept);
    }
  }
}
