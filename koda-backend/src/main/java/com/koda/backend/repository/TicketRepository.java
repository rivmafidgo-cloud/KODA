package com.koda.backend.repository;

import com.koda.backend.domain.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {
    
    // Recupera l'ultimo ticket generato per quel reparto
    Optional<Ticket> findTopByRepartoOrderByIdDesc(String reparto);
}
