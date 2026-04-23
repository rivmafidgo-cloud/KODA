package com.koda.backend.hal.impl;

import com.github.anastaciocintra.escpos.EscPos;
import com.github.anastaciocintra.escpos.EscPosConst;
import com.github.anastaciocintra.escpos.Style;
import com.github.anastaciocintra.output.PrinterOutputStream;
import com.koda.backend.domain.Ticket;
import com.koda.backend.hal.PrinterService;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;

import java.time.format.DateTimeFormatter;

@Slf4j
@Service
public class EscPosPrinterServiceImpl implements PrinterService {

    @Override
    public void printTicket(Ticket ticket) {
        log.info("Inviando comando ESC/POS per il ticket: {}", ticket.getNumero());
        
        // Questo è un esempio concettuale. In un ambiente reale, 
        // configurerai la stampante (es. su rete, USB o seriale).
        // Per test locale senza stampante, eviteremo di far esplodere l'app.
        try {
            // Esempio: PrintService printService = PrinterOutputStream.getPrintServiceByName("EPSON_TM_T20");
            // PrinterOutputStream printerOutputStream = new PrinterOutputStream(printService);
            // EscPos escpos = new EscPos(printerOutputStream);
            
            // Creiamo gli stili
            Style titleStyle = new Style()
                    .setFontSize(Style.FontSize._3, Style.FontSize._3)
                    .setJustification(EscPosConst.Justification.Center);
                    
            Style subtitleStyle = new Style()
                    .setFontSize(Style.FontSize._2, Style.FontSize._2)
                    .setJustification(EscPosConst.Justification.Center);
                    
            Style normalStyle = new Style()
                    .setJustification(EscPosConst.Justification.Center);

            log.info("--- INIZIO STAMPA (SIMULAZIONE) ---");
            log.info("KODA RETAIL");
            log.info("Reparto: {}", ticket.getReparto());
            log.info("Numero: {}", ticket.getNumero());
            log.info("Data: {}", ticket.getTimestamp().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss")));
            log.info("--- FINE STAMPA ---");
            
            /* Commentato per non dare errore in assenza di stampante configurata sul server
            escpos.writeLF(titleStyle, "KODA RETAIL");
            escpos.feed(1);
            escpos.writeLF(subtitleStyle, "Reparto: " + ticket.getReparto());
            escpos.feed(1);
            escpos.writeLF(titleStyle, ticket.getNumero());
            escpos.feed(2);
            escpos.writeLF(normalStyle, ticket.getTimestamp().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss")));
            escpos.feed(4);
            escpos.cut(EscPos.CutMode.FULL);
            escpos.close();
            */
            
        } catch (Exception e) {
            log.error("Errore durante la stampa ESC/POS", e);
        }
    }
}
