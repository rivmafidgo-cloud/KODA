import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TicketService, TicketResponse } from '../../services/ticket';
import { Subscription, delay, of } from 'rxjs';

@Component({
  selector: 'app-ticket',
  standalone: true,
  imports: [],
  templateUrl: './ticket.html',
  styleUrls: ['./ticket.scss']
})
export class Ticket implements OnInit, OnDestroy {
  isLoading = true;
  ticket: TicketResponse | null = null;
  error = false;
  
  private routeSub?: Subscription;
  private timerSub?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ticketService: TicketService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.paramMap.subscribe(params => {
      const categoryId = params.get('id');
      if (categoryId) {
        this.issueTicket(categoryId);
      } else {
        this.goHome();
      }
    });
  }

  ngOnDestroy() {
    if (this.routeSub) this.routeSub.unsubscribe();
    if (this.timerSub) this.timerSub.unsubscribe();
  }

  issueTicket(categoryId: string) {
    this.isLoading = true;
    this.ticketService.issueTicket(categoryId).subscribe({
      next: (response) => {
        this.ticket = response;
        this.isLoading = false;
        this.startAutoReturnTimer();
      },
      error: () => {
        this.error = true;
        this.isLoading = false;
        this.startAutoReturnTimer(5000); // Wait longer on error
      }
    });
  }

  startAutoReturnTimer(ms: number = 5000) {
    this.timerSub = of(null).pipe(delay(ms)).subscribe(() => {
      this.goHome();
    });
  }

  goHome() {
    this.router.navigate(['/']);
  }
}
