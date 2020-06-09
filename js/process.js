const API_URL = 'https://cloud-scanner.cludevs.com.mx/api/';
//const API_URL = 'http://localhost:8000/api/';
const EMPRESA = localStorage.getItem( 'empresa' );
const TOKEN = localStorage.getItem( 'token' );

function imprimir( titulo, mensaje, tipo )
{
  Swal.fire({
    icon: tipo,
    title: titulo,
    text: mensaje,
    allowOutsideClick: false,
  });
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
      imprimir ( 'Error', 'No se puede obtener los procesos', 'error' );
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
