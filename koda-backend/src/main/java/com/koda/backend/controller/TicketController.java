package com.koda.backend.controller;

import com.koda.backend.domain.Ticket;
import com.koda.backend.dto.IssueTicketRequest;
import com.koda.backend.service.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;

    @PostMapping("/issue")
    public ResponseEntity<Ticket> issueTicket(@RequestBody IssueTicketRequest request) {
        if (request.getReparto() == null || request.getReparto().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        Ticket ticket = ticketService.issueTicket(request.getReparto());
        return ResponseEntity.status(HttpStatus.CREATED).body(ticket);
    }
}
