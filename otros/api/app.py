from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)

def connect_db():
    return mysql.connector.connect(
        host="127.0.0.1",
        user="root",
        password="db",
        database="taller"
    )

@app.route('/vehicles', methods=['GET'])
def get_vehicles():
    db = connect_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("""
        SELECT v.id, v.matricula, v.model, v.any_fabricacio, v.quilometres, c.nom
        FROM vehicles v
        JOIN clients c ON v.client_id = c.id
    """)
    vehicles = cursor.fetchall()
    db.close()
    return jsonify(vehicles)

@app.route('/appointments', methods=['GET'])
def get_appointments():
    db = connect_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("""
        SELECT ci.id, ci.data_cita, ci.servei_sollicitat,
               v.matricula, v.model, c.nom, c.telefon
        FROM cites ci
        JOIN vehicles v ON ci.vehicle_id = v.id
        JOIN clients c ON v.client_id = c.id
        ORDER BY ci.data_cita DESC
    """)
    cites = cursor.fetchall()
    db.close()
    for c in cites:
        if c.get('data_cita'):
            c['data_cita'] = str(c['data_cita'])
    return jsonify(cites)

@app.route('/appointments', methods=['POST'])
def create_appointment():
    data = request.get_json()
    db = connect_db()
    cursor = db.cursor()

    cursor.execute("SELECT id FROM clients WHERE correu = %s", (data['correu'],))
    client = cursor.fetchone()
    if client:
        client_id = client[0]
    else:
        cursor.execute(
            "INSERT INTO clients (nom, telefon, correu) VALUES (%s, %s, %s)",
            (data['nom'], data['telefon'], data['correu'])
        )
        client_id = cursor.lastrowid

    cursor.execute("SELECT id FROM vehicles WHERE matricula = %s", (data['matricula'],))
    vehicle = cursor.fetchone()
    if vehicle:
        vehicle_id = vehicle[0]
    else:
        cursor.execute(
            "INSERT INTO vehicles (client_id, matricula, model, any_fabricacio, quilometres) VALUES (%s, %s, %s, %s, %s)",
            (client_id, data['matricula'], data['model'], data['any_fabricacio'], data['quilometres'])
        )
        vehicle_id = cursor.lastrowid

    cursor.execute(
        "INSERT INTO cites (vehicle_id, data_cita, servei_sollicitat) VALUES (%s, %s, %s)",
        (vehicle_id, data['data_cita'], data['servei_sollicitat'])
    )
    db.commit()
    db.close()
    return jsonify({'message': 'Cita creada correctament'}), 201

@app.route('/serveis', methods=['GET'])
def get_serveis():
    db = connect_db()
    cursor = db.cursor()
    cursor.execute("SELECT DISTINCT servei_sollicitat FROM cites ORDER BY servei_sollicitat")
    serveis = [row[0] for row in cursor.fetchall()]
    db.close()
    return jsonify(serveis)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
