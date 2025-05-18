# Documentație Testare Exploratorie - Todo List Application

## Informații Generale

**Proiect:** Todo List Application  
**Versiune:** 1.0  
**Data testării:** [DATA]  
**Tester:** [NUME]  
**Durată testare:** [ORE]  

## Obiective

Scopul acestei sesiuni de testare exploratorie este de a:
1. Verifica funcționalitatea completă a aplicației Todo List
2. Identifica potențiale probleme de utilizare
3. Evalua experiența utilizatorului
4. Testa integrarea dintre frontend și backend
5. Verifica gestionarea datelor și persistența acestora

## Mediul de Testare

### Configurație Hardware
- Procesor: [SPECIFICAȚII]
- Memorie RAM: [SPECIFICAȚII]
- Spațiu disc: [SPECIFICAȚII]

### Configurație Software
- Sistem de operare: Windows 10
- Browser: [VERSIUNE]
- Node.js: [VERSIUNE]
- SQLite: [VERSIUNE]

### Dependențe
- Frontend: React
- Backend: Express.js
- Bază de date: SQLite

## Arii de Testare

### 1. Autentificare și Securitate

#### 1.1 Înregistrare Utilizator
| Test Case | Pași | Rezultat Așteptat | Rezultat Actual | Status |
|-----------|------|-------------------|-----------------|--------|
| Înregistrare validă | 1. Accesare pagină înregistrare<br>2. Completare date valide<br>3. Submit formular | Cont creat cu succes | | |
| Email invalid | 1. Completare email invalid<br>2. Submit formular | Mesaj eroare format email | | |
| Parolă scurtă | 1. Completare parolă scurtă<br>2. Submit formular | Mesaj eroare lungime parolă | | |

#### 1.2 Autentificare
| Test Case | Pași | Rezultat Așteptat | Rezultat Actual | Status |
|-----------|------|-------------------|-----------------|--------|
| Login valid | 1. Completare credențiale valide<br>2. Submit formular | Autentificare reușită | | |
| Credențiale invalide | 1. Completare credențiale greșite<br>2. Submit formular | Mesaj eroare autentificare | | |

### 2. Managementul Task-urilor

#### 2.1 Creare Task
| Test Case | Pași | Rezultat Așteptat | Rezultat Actual | Status |
|-----------|------|-------------------|-----------------|--------|
| Task complet | 1. Completare toate câmpurile<br>2. Submit formular | Task creat cu toate detaliile | | |
| Task minimal | 1. Completare doar câmpuri obligatorii<br>2. Submit formular | Task creat cu succes | | |

#### 2.2 Editare Task
| Test Case | Pași | Rezultat Așteptat | Rezultat Actual | Status |
|-----------|------|-------------------|-----------------|--------|
| Modificare status | 1. Click buton status<br>2. Verificare actualizare | Status actualizat | | |
| Modificare deadline | 1. Modificare deadline<br>2. Salvare modificări | Deadline actualizat | | |

### 3. Filtrare și Sortare

#### 3.1 Filtrare
| Test Case | Pași | Rezultat Așteptat | Rezultat Actual | Status |
|-----------|------|-------------------|-----------------|--------|
| Filtrare status | 1. Selectare filtru status<br>2. Verificare rezultate | Doar task-uri cu status selectat | | |
| Filtrare prioritate | 1. Selectare filtru prioritate<br>2. Verificare rezultate | Doar task-uri cu prioritatea selectată | | |

#### 3.2 Sortare
| Test Case | Pași | Rezultat Așteptat | Rezultat Actual | Status |
|-----------|------|-------------------|-----------------|--------|
| Sortare dată | 1. Selectare sortare după dată<br>2. Verificare ordine | Task-uri ordonate corect | | |
| Sortare prioritate | 1. Selectare sortare după prioritate<br>2. Verificare ordine | Task-uri ordonate după prioritate | | |

### 4. Performanță și Scalabilitate

#### 4.1 Încărcare Date
| Test Case | Pași | Rezultat Așteptat | Rezultat Actual | Status |
|-----------|------|-------------------|-----------------|--------|
| Încărcare inițială | 1. Deschidere aplicație<br>2. Măsurare timp încărcare | Timp încărcare < 2s | | |
| Liste mari | 1. Încărcare 100+ task-uri<br>2. Verificare performanță | Performanță acceptabilă | | |

## Bugs Identificate

### Bug #1
- **Severitate:** [HIGH/MEDIUM/LOW]
- **Descriere:** [DESCRIERE DETALIATĂ]
- **Pași de reproducere:**
  1. ...
  2. ...
- **Comportament așteptat:**
- **Comportament actual:**
- **Screenshot/Video:** [DACĂ ESTE CAZUL]

### Bug #2
[DETALII SIMILARE]

## Sugestii de Îmbunătățire

1. **Îmbunătățire UI/UX**
   - Descriere:
   - Impact:
   - Prioritate:

2. **Optimizare Performanță**
   - Descriere:
   - Impact:
   - Prioritate:

## Concluzii

### Sumarul Testării
- Număr total teste executate:
- Număr bug-uri identificate:
- Distribuție severitate bug-uri:
  * High: X
  * Medium: Y
  * Low: Z

### Recomandări
1. [RECOMANDARE 1]
2. [RECOMANDARE 2]
3. [RECOMANDARE 3]

### Următorii Pași
1. [PAS 1]
2. [PAS 2]
3. [PAS 3]

## Anexe

### Anexa 1: Capturi de Ecran
[INSERARE CAPTURI DE ECRAN RELEVANTE]

### Anexa 2: Date de Test
[EXEMPLE DE DATE DE TEST UTILIZATE]

### Anexa 3: Metrici de Performanță
[GRAFICE SAU DATE DESPRE PERFORMANȚĂ] 