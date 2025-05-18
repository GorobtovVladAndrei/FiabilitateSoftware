# Testare Exploratorie - Todo List App

## 1. Autentificare

### 1.1 Înregistrare Utilizator
- [ ] Înregistrare cu date valide
- [ ] Verificare email invalid
- [ ] Verificare parolă prea scurtă
- [ ] Verificare username existent
- [ ] Verificare câmpuri goale

### 1.2 Login
- [ ] Login cu credențiale corecte
- [ ] Login cu parolă greșită
- [ ] Login cu username inexistent
- [ ] Verificare persistență sesiune
- [ ] Verificare logout

## 2. Managementul Task-urilor

### 2.1 Creare Task
- [ ] Creare task cu toate câmpurile
- [ ] Creare task doar cu câmpuri obligatorii
- [ ] Verificare validări:
  * [ ] Titlu gol
  * [ ] Deadline invalid
  * [ ] Caractere speciale
- [ ] Verificare salvare date

### 2.2 Vizualizare Task-uri
- [ ] Lista se încarcă corect
- [ ] Detaliile sunt afișate corect
- [ ] Formatarea datelor (deadline, timestamps)
- [ ] Starea task-urilor este vizibilă

### 2.3 Acțiuni Task
- [ ] Marcare Completed -> Pending
- [ ] Marcare Pending -> Completed
- [ ] Ștergere task
- [ ] Partajare task
- [ ] Verificare actualizare listă

## 3. Filtre și Sortare

### 3.1 Filtrare
- [ ] Filter by Status:
  * [ ] Toate task-urile
  * [ ] Doar Pending
  * [ ] Doar Completed
- [ ] Filter by Priority:
  * [ ] Toate prioritățile
  * [ ] Low
  * [ ] Medium
  * [ ] High
- [ ] Combinații de filtre

### 3.2 Sortare
- [ ] Sort by Created Date (ASC/DESC)
- [ ] Sort by Deadline (ASC/DESC)
- [ ] Sort by Priority (ASC/DESC)
- [ ] Verificare ordine corectă

## 4. Testare UI/UX

### 4.1 Responsivitate
- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)

### 4.2 Interacțiune
- [ ] Hover states
- [ ] Focus states
- [ ] Loading states
- [ ] Error states
- [ ] Success feedback

### 4.3 Accesibilitate
- [ ] Navigare cu tastatură
- [ ] ARIA labels
- [ ] Contrast culori
- [ ] Screen reader compatibility

## 5. Testare de Performanță

### 5.1 Încărcare
- [ ] Timp încărcare inițială
- [ ] Timp răspuns filtrare
- [ ] Timp răspuns sortare
- [ ] Comportament cu 100+ task-uri

### 5.2 Acțiuni Multiple
- [ ] Creare rapidă multiple task-uri
- [ ] Ștergere multiplă
- [ ] Filtrare + Sortare simultană

## 6. Testare de Erori

### 6.1 Erori Rețea
- [ ] Pierdere conexiune internet
- [ ] Timeout server
- [ ] Erori API
- [ ] Recuperare după erori

### 6.2 Validare Date
- [ ] Input-uri invalide
- [ ] Date lipsă
- [ ] Caractere speciale
- [ ] SQL Injection prevention

## Note Testare

### Bugs Găsite
1. ...
2. ...

### Îmbunătățiri Sugerate
1. ...
2. ...

### Observații
- ...
- ...

## Rezultate Testare
- Data testării: [DATA]
- Tester: [NUME]
- Timp alocat: [ORE]
- Bugs găsite: [NUMĂR]
- Severitate bugs: [LOW/MEDIUM/HIGH] 