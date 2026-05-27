#!/bin/bash

echo "--- Comprovant serveis ---"

# Comprovar API Flask
curl -s http://localhost:5000/vehicles > /dev/null
if [ $? -eq 0 ]; then
    echo "API Flask:       OK  (http://localhost:5000)"
else
    echo "API Flask:       ERROR - no respon"
fi

# Comprovar base de dades
mysqladmin -u root -pexample ping > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "Base de dades:   OK"
else
    echo "Base de dades:   ERROR - no respon"
fi

# Comprovar web
curl -s http://localhost:80 > /dev/null
if [ $? -eq 0 ]; then
    echo "Web:             OK  (http://localhost:80)"
else
    echo "Web:             ERROR - no respon"
fi

echo "-------------------------"
