# Digitalització d'un Taller Mecànic

Projecte del mòdul 1665 - Digitalització. Sistema de gestió de cites per a un taller mecànic amb API REST, base de dades MariaDB i pàgina web.

---

## Estructura del projecte

```
proyecto/
├── api/
│   ├── app.py
│   └── requirements.txt
├── web/
│   ├── index.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── script.js
├── scripts/
│   ├── backup.sh
│   └── check_services.sh
└── db_schema.sql
```

---

## Requisits

- Ubuntu Linux
- Python 3 + pip
- MariaDB

---

## Instal·lació

**1. Clonar el repositori**

```bash
git clone https://github.com/krysp4/Modul-1665-Digitalitzacio
cd Modul-1665-Digitalitzacio
```

**2. Base de dades**

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

```bash
mariadb -u taller -pexample taller < db_schema.sql
```

**3. API**

```bash
cd api
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python3 app.py
```

**4. Web**

```bash
cd web
python3 -m http.server 8080
```

Accedir a: `http://localhost:8080`

---

## API - Endpoints

| Mètode | Ruta | Descripció |
|--------|------|------------|
| GET | `/vehicles` | Llista tots els vehicles |
| GET | `/appointments` | Llista totes les cites |
| POST | `/appointments` | Crea una nova cita |
| GET | `/serveis` | Llista els serveis anteriors |

---

## Scripts

Els scripts es troben a la carpeta `scripts/`.

**backup.sh** — fa una còpia de seguretat de la base de dades i la guarda a `backups/` amb la data i hora.

```bash
bash scripts/backup.sh
```

**check_services.sh** — comprova si l'API, la base de dades i la web responen correctament.

```bash
bash scripts/check_services.sh
```

Resultat esperat:

```
--- Comprovant serveis ---
API Flask:       OK  (http://localhost:5000)
Base de dades:   OK
Web:             OK  (http://localhost:8080)
-------------------------
```


