import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { NgClass } from '@angular/common';
import { Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { ConfigService, Department } from '../../services/config.service';

interface Product {
  name: string;
  departmentId: string;
  departmentName: string;
  description: string;
  price: string;
  ingredients: string;
  allergens: string[];
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
  selectedProduct: Product | null = null;
  
  // Mock Database for Products
  private productDatabase: Product[] = [
    { name: 'Prosciutto di Parma', departmentId: 'salumeria', departmentName: 'Salumeria', description: 'Stagionato 24 mesi, dal sapore dolce e inconfondibile.', price: '€ 3.50 /etto', ingredients: 'Carne di suino, Sale.', allergens: [] },
    { name: 'Mortadella Bologna', departmentId: 'salumeria', departmentName: 'Salumeria', description: 'Confezionata artigianalmente, con pistacchi interi freschi di Bronte.', price: '€ 1.80 /etto', ingredients: 'Carne di suino, Tripping di suino, Sale, Pistacchi, Aromi naturali, Spezie.', allergens: ['Pistacchi'] },
    { name: 'Mozzarella di Bufala', departmentId: 'salumeria', departmentName: 'Salumeria', description: 'Campana DOP, morbidissima e freschissima di giornata.', price: '€ 4.00 /pezzo', ingredients: 'Latte di bufala pastorizzato, Caglio, Sale.', allergens: ['Latte'] },
    { name: 'Bistecca Fiorentina', departmentId: 'macelleria', departmentName: 'Macelleria', description: 'Carne di razza Chianina frollata 30 giorni. Taglio spesso e succulento.', price: '€ 45.00 /kg', ingredients: 'Carne bovina 100%.', allergens: [] },
    { name: 'Pollo Intero', departmentId: 'macelleria', departmentName: 'Macelleria', description: 'Ruspante allevato a terra senza antibiotici, ideale per arrosto.', price: '€ 8.50 /kg', ingredients: 'Carne avicola 100%.', allergens: [] },
    { name: 'Salmone Fresco', departmentId: 'pescheria', departmentName: 'Pescheria', description: 'Salmone dell\'Atlantico eviscerato. Ricco di Omega-3.', price: '€ 22.00 /kg', ingredients: 'Salmone (Salmo Salar).', allergens: ['Pesce'] },
    { name: 'Branzino', departmentId: 'pescheria', departmentName: 'Pescheria', description: 'Pescato in mare aperto. Carne bianca, soda e saporita.', price: '€ 25.00 /kg', ingredients: 'Branzino (Dicentrarchus labrax).', allergens: ['Pesce'] },
    { name: 'Pane Integrale', departmentId: 'panetteria', departmentName: 'Panetteria', description: 'Lievito madre e farine integrali macinate a pietra. Mollica soffice.', price: '€ 3.50 /kg', ingredients: 'Farina di grano tenero integrale, Acqua, Lievito madre, Sale, Malto d\'orzo.', allergens: ['Glutine'] },
    { name: 'Focaccia Ligure', departmentId: 'panetteria', departmentName: 'Panetteria', description: 'Bassa, unta e irresistibile. Con sale grosso croccante.', price: '€ 12.00 /kg', ingredients: 'Farina di grano tenero tipo 00, Acqua, Olio extra vergine di oliva, Sale, Lievito di birra.', allergens: ['Glutine'] },
    { name: 'Mele Fuji', departmentId: 'ortofrutta', departmentName: 'Ortofrutta', description: 'Croccanti, succose e molto dolci. Origine: Trentino Alto Adige.', price: '€ 2.50 /kg', ingredients: 'Mele fresche 100%.', allergens: [] },
    { name: 'Pomodori Pachino', departmentId: 'ortofrutta', departmentName: 'Ortofrutta', description: 'Rosso intenso, sapore dolce e inimitabile.', price: '€ 4.50 /kg', ingredients: 'Pomodori freschi 100%.', allergens: [] },
    { name: 'Torta della Nonna', departmentId: 'panetteria', departmentName: 'Panetteria', description: 'Pasta frolla friabile ripiena di crema pasticcera e ricoperta di pinoli.', price: '€ 18.00 /pz', ingredients: 'Farina, Uova, Zucchero, Burro, Latte, Limone, Pinoli.', allergens: ['Glutine', 'Uova', 'Latte', 'Pinoli'] }
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
    this.selectedProduct = null;
    this.searchQuery = '';
    this.searchResults = [];
    this.cdr.detectChanges();
  }
  
  closeSearch() {
    this.isSearchActive = false;
    this.isKeyboardVisible = true;
    this.selectedProduct = null;
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
  
  selectProductDepartment(product: Product) {
    this.selectedProduct = product;
    this.isKeyboardVisible = false;
    this.cdr.detectChanges();
  }

  closeProductDetails() {
    this.selectedProduct = null;
    this.cdr.detectChanges();
  }
}
