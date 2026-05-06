# Modul-1665-Digitalitzacio
## Guía Completa Docker - Proyecto Taller DIGI

### Tabla de Contenidos
1. [Nginx](#nginx)
2. [MariaDB/MySQL](#mariadbmysql)
3. [Comandos Útiles](#comandos-útiles)
4. [Troubleshooting](#troubleshooting)

---

### Nginx

#### Información del Contenedor
- **Nombre:** `nginx-web`
- **Imagen:** `nginx:alpine`
- **Puerto Local:** `8080`
- **Puerto Contenedor:** `80`
- **Carpeta Web:** `C:\Users\adria\Downloads\Proyecto de DIGI DIGI\projecte_taller\web`

#### Comando de Inicio
```bash
docker run -d -p 8080:80 -v "C:\Users\adria\Downloads\Proyecto de DIGI DIGI\projecte_taller\web:/usr/share/nginx/html" --name nginx-web nginx:alpine
```

#### Explicación del Comando
| Parámetro | Significado |
|-----------|------------|
| `docker run` | Crear y ejecutar un contenedor |
| `-d` | Ejecutar en segundo plano (detached) |
| `-p 8080:80` | Mapear puerto 8080 de tu PC → puerto 80 del contenedor |
| `-v` | Montar carpeta local en el contenedor |
| `--name nginx-web` | Nombre del contenedor |
| `nginx:alpine` | Imagen a usar |

#### Acceso a la Web
**URL:** `http://localhost:8080`

Abre esta URL en tu navegador para ver tu web.

#### Cómo Funciona
- Tu carpeta local está sincronizada con `/usr/share/nginx/html` dentro del contenedor
- Cuando modificas archivos en `C:\Users\adria\Downloads\Proyecto de DIGI DIGI\projecte_taller\web`, nginx los sirve automáticamente
- Solo actualiza la página en el navegador para ver cambios

#### Comandos Nginx
```bash
# Ver estado
docker ps

## Ver logs (errores)
docker logs nginx-web

## Detener
docker stop nginx-web

## Iniciar
docker start nginx-web

## Reiniciar
docker restart nginx-web

## Remover (eliminar completamente)
docker rm -f nginx-web
```

---

### MariaDB/MySQL

#### Información del Contenedor
- **Nombre:** `mariadb`
- **Imagen:** `mariadb:latest`
- **Puerto Local:** `3306`
- **Puerto Contenedor:** `3306`
- **Usuario:** `root`
- **Contraseña:** `root`

#### Comando de Inicio
```bash
docker run -d -p 3306:3306 -e MARIADB_ROOT_PASSWORD=root -e MARIADB_ALLOW_EMPTY_ROOT_PASSWORD=yes --name mariadb mariadb:latest
```

#### Explicación del Comando
| Parámetro | Significado |
|-----------|------------|
| `docker run` | Crear y ejecutar un contenedor |
| `-d` | Ejecutar en segundo plano (detached) |
| `-p 3306:3306` | Mapear puerto 3306 de tu PC → puerto 3306 del contenedor |
| `-e MARIADB_ROOT_PASSWORD=root` | Variable de entorno: contraseña root |
| `-e MARIADB_ALLOW_EMPTY_ROOT_PASSWORD=yes` | Permitir contraseña vacía si es necesario |
| `--name mariadb` | Nombre del contenedor |
| `mariadb:latest` | Imagen a usar |

#### Conexión desde Línea de Comandos
```bash
docker exec -it mariadb mysql -uroot -proot
```

Esto abre la consola interactiva de MySQL.

#### Comandos Básicos en MySQL
```sql
-- Ver todas las bases de datos
SHOW DATABASES;

-- Seleccionar una base de datos
USE nombrebd;

-- Ver todas las tablas de la BD actual
SHOW TABLES;

-- Ver estructura de una tabla
DESCRIBE tabla;

-- Ver datos de una tabla
SELECT * FROM tabla;

-- Salir de MySQL
EXIT;
```

#### Conexión Desde Aplicaciones GUI
Puedes conectarte usando aplicaciones como:
- **DBeaver** (recomendado, gratuito)
- **TablePlus**
- **MySQL Workbench**
- **HeidiSQL**

**Datos de Conexión:**
| Campo | Valor |
|-------|-------|
| Host | `localhost` |
| Port | `3306` |
| User | `root` |
| Password | `root` |
| Driver | MySQL o MariaDB |

#### Comandos MariaDB
```bash
# Ver estado
docker ps

## Ver logs
docker logs mariadb

## Detener
docker stop mariadb

## Iniciar
docker start mariadb

## Reiniciar
docker restart mariadb

## Remover (eliminar completamente)
docker rm -f mariadb

## Acceder a la consola
docker exec -it mariadb mysql -uroot -proot
```

---

### Comandos Útiles

#### Ver Todos los Contenedores
```bash
## Contenedores activos
docker ps

## Todos los contenedores (incluyendo parados)
docker ps -a
```

#### Información Detallada
```bash
# Ver detalles de un contenedor
docker inspect nginx-web
docker inspect mariadb

## Ver uso de recursos
docker stats
```

#### Logs y Debugging
```bash
# Ver logs completos
docker logs nginx-web
docker logs mariadb

## Ver logs en tiempo real (últimas líneas)
docker logs -f nginx-web
docker logs -f mariadb

## Ver últimas 50 líneas
docker logs --tail 50 nginx-web
```

#### Limpiar Espacios
```bash
## Ver uso de disco
docker system df

## Eliminar contenedores parados
docker container prune

## Eliminar imágenes no usadas
docker image prune

## Limpiar todo (contenedores, imágenes, volúmenes sin usar)
docker system prune -a
```

---

### Troubleshooting

### El Contenedor no Inicia
```bash
# Ver logs para ver el error
docker logs nombre-contenedor

## Reintentar
docker restart nombre-contenedor
```

#### Puerto Ya Está en Uso
Si ves error `port is already allocated`:
```bash
## Opción 1: Usar un puerto diferente
docker run -d -p 8081:80 --name nginx-web2 nginx:alpine

## Opción 2: Matar el contenedor anterior
docker rm -f nombre-contenedor
```

#### No Puedo Conectarme a MySQL
```bash
## Verificar que el contenedor está corriendo
docker ps | findstr mariadb

## Ver logs para errores
docker logs mariadb

## Probar conexión desde consola
docker exec -it mariadb mysql -uroot -proot
```

#### Los Cambios en la Web no se Ven
1. Verifica que la carpeta es la correcta:
   ```bash
   C:\Users\adria\Downloads\Proyecto de DIGI DIGI\projecte_taller\web
   ```
2. Actualiza la página en el navegador (Ctrl+Shift+R para caché)
3. Verifica que nginx está corriendo: `docker ps`

#### Ver Archivos dentro del Contenedor
```bash
## Para Nginx
docker exec -it nginx-web ls -la /usr/share/nginx/html

## Para MariaDB
docker exec -it mariadb ls -la /var/lib/mysql
```

---

### Resumen de Puertos
| Servicio | Puerto Local | URL/Host |
|----------|-------------|----------|
| Nginx | `8080` | `http://localhost:8080` |
| MariaDB | `3306` | `localhost:3306` |

---

### Detener Todo
```bash
# Detener ambos contenedores
docker stop nginx-web mariadb

## Remover ambos
docker rm -f nginx-web mariadb
```

---

**Última actualización:** 2026-05-06
