// URL de tu API para motos (Asegúrate de cambiarla puerto/ruta correcta)
// URL de tu API para motos en Render (Ya no es localhost)
var url = "https://api-rest-post-and-mysql.onrender.com/motos/";

function postMoto() {
    var formData = new FormData();
    formData.append('marca', $('#marca').val());
    formData.append('modelo', $('#modelo').val());
    formData.append('cilindrada', $('#cilindrada').val());

    var fileInput = document.getElementById('imagen');
    if (fileInput && fileInput.files && fileInput.files[0]) {
        formData.append('imagen', fileInput.files[0]);
    }

    $.ajax({
        url: url,
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
            console.log('Moto agregada:', response);
            alert("Moto agregada exitosamente!");
            // Limpiar los campos
            $('#marca').val('');
            $('#modelo').val('');
            $('#cilindrada').val('');
            $('#imagen').val('');

            // Actualizar la tabla después de agregar
            getMotos();
        },
        error: function (error) {
            console.error('Error al hacer POST:', error);
            alert("Hubo un error al agregar la moto");
        }
    });
}

function getMotoById() {
    var id = $('#motoId').val();
    if (!id) { alert('Ingresa un ID'); return; }
    $.getJSON(url + id, function (moto) {
        // Prefill form for possible edición
        $('#marca').val(moto.marca);
        $('#modelo').val(moto.modelo);
        $('#cilindrada').val(moto.cilindrada);
        // no setear imagen file input
        // Mostrar imagen si existe
        if (moto.imagen_url) {
            $('#resultado').html('<p>Imagen seleccionada:</p><img src="'+moto.imagen_url+'" style="max-width:200px;"/>');
        }
    }).fail(function (error) {
        console.error('Error al obtener moto por ID:', error);
        alert('No se encontró la moto');
    });
}

function updateMoto() {
    var id = $('#motoId').val();
    if (!id) { alert('Ingresa un ID para actualizar'); return; }

    var formData = new FormData();
    formData.append('marca', $('#marca').val());
    formData.append('modelo', $('#modelo').val());
    formData.append('cilindrada', $('#cilindrada').val());

    var fileInput = document.getElementById('imagen');
    if (fileInput && fileInput.files && fileInput.files[0]) {
        formData.append('imagen', fileInput.files[0]);
    }

    $.ajax({
        url: url + id,
        type: 'PUT',
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
            alert('Moto actualizada');
            getMotos();
        },
        error: function (err) {
            console.error('Error en PUT:', err);
            alert('Error al actualizar');
        }
    });
}

function deleteMotoById() {
    var id = $('#motoId').val();
    if (!id) { alert('Ingresa un ID para borrar'); return; }
    if (!confirm('Confirmar borrado de moto id=' + id + '?')) return;
    $.ajax({
        url: url + id,
        type: 'DELETE',
        success: function () {
            alert('Moto borrada');
            getMotos();
        },
        error: function (err) {
            console.error('Error en DELETE:', err);
            alert('Error al borrar');
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

            // Mostramos la imagen como miniatura si existe
            if (moto.imagen_url) {
                tableHtml += '<td><img src="' + moto.imagen_url + '" alt="imagen" style="max-width:120px;max-height:80px;object-fit:cover;"/></td>';
            } else {
                tableHtml += '<td></td>';
            }
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
