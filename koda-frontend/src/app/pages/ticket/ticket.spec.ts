import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ticket } from './ticket';

describe('Ticket', () => {
  let component: Ticket;
  let fixture: ComponentFixture<Ticket>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Ticket],
    }).compileComponents();

    fixture = TestBed.createComponent(Ticket);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
