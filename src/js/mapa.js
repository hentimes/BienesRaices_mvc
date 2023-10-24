
(function() {

    //Coordenadas
    const lat = -33.4165075;
    const lng = -70.606795;
    const mapa = L.map('mapa').setView([lat, lng ], 15);
    let marker;

    // Utilizar Provider y Geocoder
    const geocodeService = L.esri.Geocoding.geocodeService();


    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    // El pin
    marker = new L.marker ([lat, lng], {
        draggable: true,    // Permite movel el pin
        autoPan: true       //Permite mover el pin a la vez que el mapa
    })
    .addTo(mapa)

    // Registrar Lat y lng del pin
    marker.on('moveend', function(e){
        marker = e.target
        const posicion = marker.getLatLng();
        mapa.panTo(new L.LatLng(posicion.lat, posicion.lng))

        // Obtener informacion de la ubicacion del pin
        geocodeService.reverse().latlng(posicion, 15).run(function(error, resultado) {
            // console.log(resultado)

            marker.bindPopup(resultado.address.LongLabel)

            //Llenar los campos
            document.querySelector('.calle').textContent = resultado?.address?.Address ?? '';
            document.querySelector('#calle').value = resultado?.address?.Address ?? '';
            document.querySelector('#lat').value = resultado?.latlng?.lat ?? '';
            document.querySelector('#lng').value = resultado?.lng?.lng ?? '';
        })
    })

})()