var API = 'http://localhost:5000';


// ===============================
// NAVEGACIÓ ENTRE SECCIONS
// ===============================
var botoesNav = document.querySelectorAll('nav button');

botoesNav.forEach(function(boto) {

    boto.addEventListener('click', function() {

        // Treure classe active de tots els botons
        botoesNav.forEach(function(btn) {
            btn.classList.remove('active');
        });

        // Afegir active al botó clicat
        this.classList.add('active');

        // Ocultar totes les pàgines
        document.querySelectorAll('.pagina').forEach(function(sec) {
            sec.classList.remove('active');
        });

        // Mostrar secció seleccionada
        var target = this.getAttribute('data-target');
        document.getElementById(target).classList.add('active');

        // Recarregar dades
        if (target === 'vehicles') {
            carregarVehicles();
        }

        if (target === 'cites') {
            carregarCites();
        }

        if (target === 'serveis') {
            carregarServeis();
        }
    });

});


// ===============================
// CARREGAR VEHICLES
// ===============================
function carregarVehicles() {

    var tbody = document.querySelector('#taulaVehicles tbody');

    tbody.innerHTML = '<tr><td colspan="5">Carregant...</td></tr>';

    fetch(API + '/vehicles')

        .then(function(res) {

            if (!res.ok) {
                throw new Error();
            }

            return res.json();
        })

        .then(function(vehicles) {

            tbody.innerHTML = vehicles.map(function(v) {

                return '<tr>' +
                    '<td>' + v.matricula + '</td>' +
                    '<td>' + v.model + '</td>' +
                    '<td>' + v.any_fabricacio + '</td>' +
                    '<td>' + v.quilometres + ' km</td>' +
                    '<td>' + v.nom + '</td>' +
                '</tr>';

            }).join('');

        })

        .catch(function() {

            tbody.innerHTML =
                '<tr>' +
                    '<td colspan="5" style="color:red">' +
                        'Error connectant amb l\'API.' +
                    '</td>' +
                '</tr>';
        });
}


// ===============================
// CARREGAR SERVEIS
// ===============================
function carregarServeis() {

    var tbody = document.querySelector('#taulaServeis tbody');

    tbody.innerHTML = '<tr><td colspan="3">Carregant...</td></tr>';

    fetch(API + '/serveis')

        .then(function(res) {

            if (!res.ok) {
                throw new Error();
            }

            return res.json();
        })

        .then(function(serveis) {

            tbody.innerHTML = serveis.map(function(s) {

                return '<tr>' +
                    '<td>' + s.id + '</td>' +
                    '<td>' + s.nom + '</td>' +
                    '<td>' + s.preu + ' €</td>' +
                '</tr>';

            }).join('');

            omplirSelectServeis(serveis);

        })

        .catch(function() {

            tbody.innerHTML =
                '<tr>' +
                    '<td colspan="3" style="color:red">' +
                        'Error carregant serveis.' +
                    '</td>' +
                '</tr>';
        });
}


// ===============================
// OMPLIR SELECT SERVEIS
// ===============================
function omplirSelectServeis(serveis) {

    var select = document.getElementById('servei_sollicitat');

    select.innerHTML = '<option value="">Selecciona servei</option>';

    serveis.forEach(function(s) {

        select.innerHTML +=
            '<option value="' + s.nom + '">' +
                s.nom +
            '</option>';

    });
}


// ===============================
// CARREGAR CITES
// ===============================
function carregarCites() {

    var tbody = document.querySelector('#taulaCites tbody');

    tbody.innerHTML = '<tr><td colspan="7">Carregant...</td></tr>';

    fetch(API + '/appointments')

        .then(function(res) {

            if (!res.ok) {
                throw new Error();
            }

            return res.json();
        })

        .then(function(cites) {

            tbody.innerHTML = cites.map(function(c) {

                return '<tr>' +
                    '<td>' + c.nom + '</td>' +
                    '<td>' + c.telefon + '</td>' +
                    '<td>' + c.matricula + '</td>' +
                    '<td>' + c.model + '</td>' +
                    '<td>' + c.data_cita + '</td>' +
                    '<td>' + c.servei_sollicitat + '</td>' +
                    '<td>' + c.quilometres + ' km</td>' +
                '</tr>';

            }).join('');

        })

        .catch(function() {

            tbody.innerHTML =
                '<tr>' +
                    '<td colspan="7" style="color:red">' +
                        'Error carregant cites.' +
                    '</td>' +
                '</tr>';
        });
}


// ===============================
// CREAR NOVA CITA
// ===============================
document.getElementById('citaForm').addEventListener('submit', function(e) {

    e.preventDefault();

    var dades = {

        nom: document.getElementById('nom').value,
        telefon: document.getElementById('telefon').value,
        correu: document.getElementById('correu').value,

        matricula: document.getElementById('matricula').value,
        model: document.getElementById('model').value,

        any_fabricacio: document.getElementById('any_fabricacio').value,

        quilometres: document.getElementById('quilometres').value,

        data_cita: document.getElementById('data_cita').value,

        servei_sollicitat: document.getElementById('servei_sollicitat').value
    };

    fetch(API + '/appointments', {

        method: 'POST',

        headers: {
            'Content-Type': 'application/json'
        },

        body: JSON.stringify(dades)

    })

    .then(function(res) {

        if (!res.ok) {
            throw new Error();
        }

        return res.json();
    })

    .then(function(resultat) {

        document.getElementById('missatge').innerHTML =
            '<p style="color:green">' +
                'Cita creada correctament.' +
            '</p>';

        // Reset formulari
        document.getElementById('citaForm').reset();

        // Actualitzar taules
        carregarCites();
        carregarVehicles();

        console.log(resultat);
    })

    .catch(function() {

        document.getElementById('missatge').innerHTML =
            '<p style="color:red">' +
                'Error connectant amb el servidor.' +
            '</p>';
    });

});


// ===============================
// CÀRREGA INICIAL
// ===============================
carregarVehicles();
carregarServeis();
carregarCites();