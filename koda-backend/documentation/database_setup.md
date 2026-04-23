# Setup Database PostgreSQL per KODA Backend

Questo documento descrive la procedura necessaria per configurare e avviare correttamente il database PostgreSQL per il backend del sistema eliminacode KODA.

## 1. Prerequisiti
Prima di avviare l'applicazione Spring Boot, è necessario:
- Avere **PostgreSQL** installato e in esecuzione sulla propria macchina locale (di default sulla porta `5432`).
- Creare un database vuoto chiamato `kodadb`.

Per creare il database vuoto puoi usare pgAdmin oppure la riga di comando:
```sql
CREATE DATABASE kodadb;
```

## 2. Configurazione in `application.properties`
Nel file `src/main/resources/application.properties` si trovano i parametri di connessione. Se le credenziali del tuo PostgreSQL locale sono diverse, aggiornale qui:

```properties
# Credenziali e URL del database
spring.datasource.url=jdbc:postgresql://localhost:5432/kodadb
spring.datasource.username=postgres
spring.datasource.password=postgres
spring.datasource.driver-class-name=org.postgresql.Driver
```

## 3. Creazione Automatica delle Tabelle (Magia di Hibernate)
Non è necessario scrivere script SQL per creare le tabelle (es. la tabella `tickets`). Tutto viene gestito in automatico grazie a questa singola proprietà nel file `application.properties`:

```properties
spring.jpa.hibernate.ddl-auto=update
```

**Come funziona?**
Quando avvii Spring Boot, Hibernate analizza tutte le classi Java annotate con `@Entity` (come `Ticket.java`). Se rileva che la tabella corrispondente non esiste su PostgreSQL, esegue automaticamente il comando `CREATE TABLE`. Se in futuro aggiungerai un nuovo campo all'Entity, Hibernate eseguirà un `ALTER TABLE` per aggiornare lo schema senza perdere i dati esistenti.

## 4. Dipendenze Maven
Per far sì che Spring Boot possa parlare con PostgreSQL, ci siamo assicurati che nel file `pom.xml` sia presente il driver ufficiale:

```xml
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <scope>runtime</scope>
</dependency>
```

## 5. Avvio
Una volta completati questi step, puoi avviare l'applicazione:
```bash
mvn spring-boot:run
```
Controlla i log della console: vedrai le query SQL stampate a schermo che confermano la creazione/aggiornamento della struttura del database.
