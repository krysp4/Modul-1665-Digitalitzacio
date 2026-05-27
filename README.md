# Digitalització d'un Taller Mecànic Connectat

Projecte del mòdul 1665 de Digitalització (EDUCEM). L'objectiu és substituir el sistema manual de gestió d'un taller mecànic per una solució digital. Fins ara el taller apuntava les cites i els clients en paper, cosa que generava errors i duplicats. Amb aquest projecte, el taller disposa d'una pàgina web on els clients poden demanar cita, una API que gestiona totes les dades, i una base de dades on es guarda tot.

---

## Tecnologies utilitzades

- **Python 3 + Flask** — API REST
- **MariaDB** — base de dades relacional
- **HTML / CSS / JavaScript** — pàgina web (sense frameworks)
- **Bash** — scripts d'automatització
- **Ubuntu Linux** — sistema operatiu on s'executa tot

---

## Estructura del projecte

```
proyecto/
├── api/
│   ├── app.py               # Codi de l'API Flask
│   └── requirements.txt     # Dependències de Python
├── web/
│   ├── index.html           # Pàgina principal
│   ├── css/
│   │   └── style.css        # Estils
│   └── js/
│       └── script.js        # Lògica del frontend
├── scripts/
│   ├── backup.sh            # Script de còpia de seguretat
│   └── check_services.sh    # Script de comprovació d'estat
└── db_schema.sql            # Estructura i dades inicials de la BD
```

---

## Base de dades

La base de dades té tres taules relacionades entre si:

- **clients** — guarda el nom, telèfon i correu de cada client.
- **vehicles** — cada vehicle pertany a un client. Guarda la matrícula, model, any de fabricació i quilòmetres.
- **cites** — cada cita pertany a un vehicle. Guarda la data i el servei sol·licitat.

Les relacions són: un client pot tenir molts vehicles, i un vehicle pot tenir moltes cites.

### Crear la base de dades

```bash
sudo mariadb
```

```sql
CREATE DATABASE taller;
CREATE USER 'taller'@'localhost' IDENTIFIED BY 'example';
GRANT ALL PRIVILEGES ON taller.* TO 'taller'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

Carregar l'esquema i les dades de prova:

```bash
mariadb -u taller -pexample taller < db_schema.sql
```

---

## API REST

L'API està feta amb Flask i escolta al port **5000**. Gestiona totes les operacions amb la base de dades. El frontend no accedeix mai directament a la BD, sempre passa per l'API.

S'ha configurat CORS per permetre les peticions des de la web que corre en un port diferent.

### Instal·lació

Es recomana usar un entorn virtual per evitar conflictes amb els paquets del sistema:

```bash
cd api
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Arrencar l'API

```bash
python3 app.py
```

L'API queda corrent a `http://localhost:5000`. En mode debug mostra per terminal cada petició que rep.

### Endpoints disponibles

| Mètode | Ruta | Descripció |
|--------|------|------------|
| GET | `/vehicles` | Retorna tots els vehicles amb el nom del propietari |
| GET | `/appointments` | Retorna totes les cites amb les dades del client i vehicle |
| POST | `/appointments` | Crea una nova cita. Si el client o vehicle no existeixen, els crea automàticament |
| GET | `/serveis` | Retorna la llista de serveis ja introduïts anteriorment (per al datalist del formulari) |

### Exemple de crida POST /appointments

```json
{
  "nom": "Adri Alonso",
  "telefon": "600111222",
  "correu": "adri@correu.com",
  "matricula": "1234ABC",
  "model": "Seat Ibiza",
  "any_fabricacio": 2018,
  "quilometres": 85000,
  "data_cita": "2025-06-10",
  "servei_sollicitat": "Canvi d'oli"
}
```

---

## Web

La pàgina web és estàtica (HTML, CSS i JavaScript pur) i es comunica amb l'API mitjançant `fetch()`. Té tres seccions accessibles des del menú de navegació:

- **Nova Cita** — formulari per introduir les dades del client, el vehicle i el servei. Quan s'envia, fa una petició POST a l'API. Si el client o el vehicle ja existeixen a la base de dades (identificats per correu i matrícula), no es duplican. El camp de servei mostra suggeriments dels serveis introduïts anteriorment gràcies a un `<datalist>`.
- **Cites** — taula amb totes les cites registrades, carregades amb un GET a `/appointments`.
- **Vehicles** — taula amb tots els vehicles i el seu propietari, carregats amb un GET a `/vehicles`.

### Servir la web

```bash
cd web
python3 -m http.server 8080
```

Accedir a: `http://localhost:8080`

---

## Scripts

Els scripts es troben a la carpeta `scripts/` i s'executen directament amb bash.

### backup.sh

Fa una còpia de seguretat completa de la base de dades `taller` usant `mysqldump`. El fitxer resultant es guarda a la carpeta `backups/` amb el nom `backup_YYYYMMDD_HHMMSS.sql` per poder identificar quan es va fer. Si la carpeta no existeix, el script la crea automàticament.

```bash
bash scripts/backup.sh
```

Exemple de sortida:

```
Backup guardat correctament: /root/projecte-taller/backups/backup_20260527_002407.sql
```

### check_services.sh

Comprova si els tres serveis principals estan funcionant: l'API Flask, la base de dades MariaDB i la web. Utilitza `curl` per fer una petició a l'API i `mysqladmin ping` per comprovar la base de dades. Imprimeix per terminal l'estat de cadascun.

```bash
bash scripts/check_services.sh
```

Sortida esperada quan tot funciona:

```
--- Comprovant serveis ---
API Flask:       OK  (http://localhost:5000)
Base de dades:   OK
Web:             OK  (http://localhost:8080)
-------------------------
```

---

## Posada en marxa completa

Per arrencar tot el sistema calen dues terminals obertes alhora:

**Terminal 1 — API:**
```bash
cd api
source venv/bin/activate
python3 app.py
```

**Terminal 2 — Web:**
```bash
cd web
python3 -m http.server 8080
```

Després obre el navegador a `http://localhost:8080`.

---

## Problemes coneguts i solucions

**Error `externally-managed-environment` en instal·lar pip:**
Solució: usar un entorn virtual amb `python3 -m venv venv`.

**Error `Access denied for user 'root'@'localhost'`:**
A Ubuntu, el root de MariaDB usa autenticació del sistema i no accepta connexió amb contrasenya des d'una aplicació. Solució: crear un usuari nou com s'indica a la secció d'instal·lació.

---

## Autor

Adri Alonso Méndez — Mòdul 1665 Digitalització — EDUCEM 2026
