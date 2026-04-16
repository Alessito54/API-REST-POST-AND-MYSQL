// URL de tu API para motos (Asegúrate de cambiarla puerto/ruta correcta)
var url = "http://localhost:3000/motos/";

function postMoto() {
    var moto = {
        marca: $('#marca').val(),
        modelo: $('#modelo').val(),
        cilindrada: $('#cilindrada').val(),
        imagen_url: $('#imagen_url').val()
    };

    $.ajax({
        url: url,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(moto),
        success: function (response) {
            console.log('Moto agregada:', response);
            alert("Moto agregada exitosamente!");
            // Limpiar los campos
            $('#marca').val('');
            $('#modelo').val('');
            $('#cilindrada').val('');
            $('#imagen_url').val('');

            // Opcional: Actualizar la tabla después de agregar
            // getMotos(); 
        },
        error: function (error) {
            console.error('Error al hacer POST:', error);
            alert("Hubo un error al agregar la moto");
        }
    });
}

function getMotos() {
    $.getJSON(url, function (data) {
        var tableHtml = '<table>';
        // Agregamos encabezados para que se vea mejor después de la consulta GET
        tableHtml += '<tr><th>ID</th><th>Marca</th><th>Modelo</th><th>Cilindrada</th><th>URL Imagen</th></tr>';

        $.each(data, function (index, moto) {
            tableHtml += '<tr>';
            tableHtml += '<td>' + (moto.id || (index + 1)) + '</td>';
            tableHtml += '<td>' + moto.marca + '</td>';
            tableHtml += '<td>' + moto.modelo + '</td>';
            tableHtml += '<td>' + moto.cilindrada + '</td>';

            // Mostramos la url de la imagen (o si prefieres mostrar la imagen como tal puedes cambiarlo a <img src="...">)
            tableHtml += '<td>' + moto.imagen_url + '</td>';
            tableHtml += '</tr>';
        });

        tableHtml += '</table>';

        // Reemplazar la tabla fija de prueba con los datos de motos recuperados de la DB
        $('#resultado').html(tableHtml);
    }).fail(function (error) {
        console.error('Error al hacer GET:', error);
        alert('Hubo un error al recuperar las motos');
    });
}

// Cargar las motos automáticamente al iniciar la página
$(document).ready(function () {
    getMotos();
});
