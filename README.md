# Modul-1665-Digitalització
## Guía Completa Docker - Projecte Taller DIGI

### Taula de Continguts
1. [Nginx](#nginx)
2. [MariaDB/MySQL](#mariadbmysql)
3. [Comandaments Útils](#comandaments-útils)
4. [Solució de Problemes](#solució-de-problemes)

---

### Nginx

#### Informació del Contenidor
- **Nom:** `nginx-web`
- **Imatge:** `nginx:alpine`
- **Port Local:** `8080`
- **Port Contenidor:** `80`
- **Carpeta Web:** `C:\Users\adria\Downloads\Proyecto de DIGI DIGI\projecte_taller\web`

#### Comandament d'Inici
```bash
docker run -d -p 8080:80 -v "C:\Users\adria\Downloads\Proyecto de DIGI DIGI\projecte_taller\web:/usr/share/nginx/html" --name nginx-web nginx:alpine
```

#### Explicació del Comandament
| Paràmetre | Significat |
|-----------|------------|
| `docker run` | Crear i executar un contenidor |
| `-d` | Executar en segon plà (detached) |
| `-p 8080:80` | Mapear port 8080 del teu PC → port 80 del contenidor |
| `-v` | Muntar carpeta local al contenidor |
| `--name nginx-web` | Nom del contenidor |
| `nginx:alpine` | Imatge a usar |

#### Accés a la Web
**URL:** `http://localhost:8080`

Obri aquesta URL al teu navegador per veure la teva web.

#### Com Funciona
- La teva carpeta local està sincronitzada amb `/usr/share/nginx/html` dins del contenidor
- Quan modificas arxius a `C:\Users\adria\Downloads\Proyecto de DIGI DIGI\projecte_taller\web`, nginx els serveix automàticament
- Només actualitza la pàgina al navegador per veure canvis

#### Comandaments Nginx
```bash
# Veure estat
docker ps

# Veure logs (errors)
docker logs nginx-web

# Aturar
docker stop nginx-web

# Iniciar
docker start nginx-web

# Reiniciar
docker restart nginx-web

# Eliminar completament
docker rm -f nginx-web
```

---

### MariaDB/MySQL

#### Informació del Contenidor
- **Nom:** `mariadb`
- **Imatge:** `mariadb:latest`
- **Port Local:** `3306`
- **Port Contenidor:** `3306`
- **Usuari:** `root`
- **Contrasenya:** `root`

#### Comandament d'Inici
```bash
docker run -d -p 3306:3306 -e MARIADB_ROOT_PASSWORD=root -e MARIADB_ALLOW_EMPTY_ROOT_PASSWORD=yes --name mariadb mariadb:latest
```

#### Explicació del Comandament
| Paràmetre | Significat |
|-----------|------------|
| `docker run` | Crear i executar un contenidor |
| `-d` | Executar en segon plà (detached) |
| `-p 3306:3306` | Mapear port 3306 del teu PC → port 3306 del contenidor |
| `-e MARIADB_ROOT_PASSWORD=root` | Variable d'entorn: contrasenya root |
| `-e MARIADB_ALLOW_EMPTY_ROOT_PASSWORD=yes` | Permetre contrasenya buida si és necessari |
| `--name mariadb` | Nom del contenidor |
| `mariadb:latest` | Imatge a usar |

#### Connexió des de Línia de Comandaments
```bash
docker exec -it mariadb mariadb -uroot -proot
```

Això obri la consola interactiva de MariaDB.

#### Comandaments Bàsics a MariaDB
```sql
-- Veure totes les bases de dades
SHOW DATABASES;

-- Seleccionar una base de dades
USE nombd;

-- Veure totes les taules de la BD actual
SHOW TABLES;

-- Veure estructura d'una taula
DESCRIBE taula;

-- Veure dades d'una taula
SELECT * FROM taula;

-- Sortir de MariaDB
EXIT;
```

#### Connexió des d'Aplicacions GUI
Pots connectar-te usant aplicacions com:
- **DBeaver** (recomanat, gratuït)
- **TablePlus**
- **MySQL Workbench**
- **HeidiSQL**

**Dades de Connexió:**
| Camp | Valor |
|------|-------|
| Host | `localhost` |
| Port | `3306` |
| User | `root` |
| Password | `root` |
| Driver | MySQL o MariaDB |

#### Comandaments MariaDB
```bash
# Veure estat
docker ps

# Veure logs
docker logs mariadb

# Aturar
docker stop mariadb

# Iniciar
docker start mariadb

# Reiniciar
docker restart mariadb

# Eliminar completament
docker rm -f mariadb

# Accedir a la consola
docker exec -it mariadb mariadb -uroot -proot
```

---

### Comandaments Útils

#### Veure Tots els Contenidors
```bash
# Contenidors actius
docker ps

# Tots els contenidors (inclòs parats)
docker ps -a
```

#### Informació Detallada
```bash
# Veure detalls d'un contenidor
docker inspect nginx-web
docker inspect mariadb

# Veure ús de recursos
docker stats
```

#### Logs i Debugging
```bash
# Veure logs complets
docker logs nginx-web
docker logs mariadb

# Veure logs en temps real (últimes línies)
docker logs -f nginx-web
docker logs -f mariadb

# Veure últimes 50 línies
docker logs --tail 50 nginx-web
```

#### Netejar Espai
```bash
# Veure ús de disc
docker system df

# Eliminar contenidors parats
docker container prune

# Eliminar imatges no usades
docker image prune

# Netejar tot (contenidors, imatges, volums sense usar)
docker system prune -a
```

---

### Solució de Problemes

#### El Contenidor no S'Inicia
```bash
# Veure logs per veure l'error
docker logs nom-contenidor

# Reintentar
docker restart nom-contenidor
```

#### Port Ja Està en Ús
Si veus error `port is already allocated`:
```bash
# Opció 1: Usar un port diferent
docker run -d -p 8081:80 --name nginx-web2 nginx:alpine

# Opció 2: Matar el contenidor anterior
docker rm -f nom-contenidor
```

#### No Puc Connectar-me a MariaDB
```bash
# Verificar que el contenidor està correguent
docker ps | findstr mariadb

# Veure logs per errors
docker logs mariadb

# Provar connexió des de consola
docker exec -it mariadb mariadb -uroot -proot
```

#### Els Canvis a la Web no es Veuen
1. Verifica que la carpeta és la correcta:
   ```bash
   C:\Users\adria\Downloads\Proyecto de DIGI DIGI\projecte_taller\web
   ```
2. Actualitza la pàgina al navegador (Ctrl+Shift+R per caché)
3. Verifica que nginx està correguent: `docker ps`

#### Veure Arxius dins del Contenidor
```bash
# Per a Nginx
docker exec -it nginx-web ls -la /usr/share/nginx/html

# Per a MariaDB
docker exec -it mariadb ls -la /var/lib/mysql
```

---

### Resum de Ports
| Servei | Port Local | URL/Host |
|--------|------------|----------|
| Nginx | `8080` | `http://localhost:8080` |
| MariaDB | `3306` | `localhost:3306` |

---

### Aturar Tot
```bash
# Aturar ambdós contenidors
docker stop nginx-web mariadb

# Eliminar ambdós
docker rm -f nginx-web mariadb
```

---

**Última actualització:** 2026-05-06

