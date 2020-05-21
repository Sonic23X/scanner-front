const API_URL = 'https://cloud-scanner.cludevs.com.mx/api/';

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


$(document).ready(() =>
{

  $( '#login' ).submit( event =>
  {
    event.preventDefault();

    //reunimos la información del form
    let data =
    {
      email: $( '#email' ).val(),
      password: $( '#password' ).val()
    };

    //habilitamos la espera
    $( '.login-form-btn' ).prop( 'disabled', true );
    $( '.standard' ).hide();
    $( '.loading' ).show();

    //conectamos con el servidor
    $.ajax(
    {
      url: API_URL + 'login',
      type: 'POST',
      dataType: 'json',
      data: data,
      success: response =>
      {
        console.log( response );

        if ( response.access_token )
        {
          //guardamos información escencial
          localStorage.setItem( 'token', response.access_token );
          localStorage.setItem( 'ususario', response.user.id );
          localStorage.setItem( 'empresa', response.user.idEmpresa );

          //redireccionamos a la pagina del panel
          window.location.href = './process.html';
        } else
        {
          imprimir( '.validate-input', '.validate-message', response.message, 3000 );
          localStorage.removeItem( 'token' ); //en caso de que exista, lo borramos ya que la sesión es incorrecta
        }
      },
      error: ( jqXHR, textStatus, errorThrown ) =>
      {

      },
      complete: () =>
      {
        $( '.login-form-btn' ).prop( 'disabled', false );
        $( '.loading' ).hide();
        $( '.standard' ).show();
      }
    });
  });

});
