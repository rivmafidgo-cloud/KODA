package com.koda.backend.service;

import com.koda.backend.domain.Ticket;
import com.koda.backend.hal.PrinterService;
import com.koda.backend.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TicketService {

    private final TicketRepository ticketRepository;
    private final PrinterService printerService;

    @Transactional
    public Ticket issueTicket(String reparto) {
        String prefix = reparto.substring(0, 1).toUpperCase();
        
        Optional<Ticket> lastTicketOpt = ticketRepository.findTopByRepartoOrderByIdDesc(reparto);
        
        int nextNumber = 1;
        if (lastTicketOpt.isPresent()) {
            String lastNumero = lastTicketOpt.get().getNumero();
            // Assumiamo il formato Lettera-Numero (es. A-01, B-12)
            try {
                String[] parts = lastNumero.split("-");
                if (parts.length == 2) {
                    nextNumber = Integer.parseInt(parts[1]) + 1;
                }
            } catch (Exception e) {
                // Se il formato non è valido, si riparte da 1
            }
        }
        
        String formattedNumber = String.format("%s-%02d", prefix, nextNumber);
        
        Ticket ticket = Ticket.builder()
                .reparto(reparto)
                .numero(formattedNumber)
                .timestamp(LocalDateTime.now())
                .build();
                
        ticket = ticketRepository.save(ticket);
        
        // Invia il comando di stampa alla stampante
        printerService.printTicket(ticket);
        
        return ticket;
    }
}
