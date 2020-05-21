const API_URL = 'http://localhost:8000/api/';
const EMPRESA = localStorage.getItem( 'empresa' );
const TOKEN = localStorage.getItem( 'token' );

function imprimir( destino, contenedor, mensaje, tiempo, tipo = false )
{
  //colocar el texto y despues mostrarlo
  $(contenedor).html(mensaje);
  $(destino).show();

  //cambiamos el tipo de alerta segun se establesca
  if (tipo)
  {
    $(destino).removeClass('alert-danger');
    $(destino).addClass('alert-success');
  } else
  {
    $(destino).removeClass('alert-success');
    $(destino).addClass('alert-danger');
  }

  //funcion para espera un segundo y después esconder el mensaje
  setTimeout(() =>
  {
      $(destino).hide(1000);
    }, tiempo);
}

function loadProcesses()
{

  $.ajax(
  {
    url: `${API_URL}proceso/${EMPRESA}`,
    type: 'GET',
    headers:
    {
      'Authorization': `Bearer ${TOKEN}`
    },
    dataType: 'json',
    success: response =>
    {

      let data = response;

      //recorremos los post
      data.forEach((item, index) =>
      {
        let proceso =
        `
          <div class="card" onClick="clickProceso(${item.id})">
            <div class="card-body">
              <span>${item.description}</span>
            </div>
          </div>
        `;

        $( '.processes-cards' ).append( proceso );
      });


    },
    error: ( jqXHR, textStatus, errorThrown ) =>
    {
      alert( 'Error al obtener los procesos' );
    }
  });
}

function clickProceso( id )
{
  //guardamos el id del proceso
  localStorage.setItem( 'proceso', id );

  //redireccionamos al scanner
  window.location.href = './scanner.html';
}


$(document).ready(() =>
{

  if ( TOKEN != null || TOKEN != undefined )
    loadProcesses();
  else
    window.location.href = './login.html';

});
