package com.koda.backend.hal;

import com.koda.backend.domain.Ticket;

/**
 * Hardware Abstraction Layer for printers.
 */
public interface PrinterService {
    
    /**
     * Stampa un ticket.
     * @param ticket Il ticket da stampare.
     */
    void printTicket(Ticket ticket);
}
