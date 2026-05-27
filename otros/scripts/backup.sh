#!/bin/bash

DATA=$(date +%Y%m%d_%H%M%S)
FITXER="backup_$DATA.sql"
DIRECTORI="$HOME/projecte-taller/backups"

mkdir -p "$DIRECTORI"

mysqldump -u root -pdb taller > "$DIRECTORI/$FITXER"

if [ $? -eq 0 ]; then
    echo "Backup guardat correctament: $DIRECTORI/$FITXER"
else
    echo "Error al fer el backup"
fi
