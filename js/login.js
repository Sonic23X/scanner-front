const API_URL = 'https://cloud-scanner.cludevs.com.mx/api/';
//const API_URL = 'http://localhost:8000/api/';

function imprimir( titulo, mensaje, tipo )
{
  Swal.fire({
    icon: tipo,
    title: titulo,
    text: mensaje,
    allowOutsideClick: false,
  });
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
        if ( response.access_token )
        {
          //guardamos información escencial
          localStorage.setItem( 'token', response.access_token );
          localStorage.setItem( 'usuario', response.user.id );
          localStorage.setItem( 'empresa', response.user.idEmpresa );

          //redireccionamos a la pagina del panel
          window.location.href = './process.html';
        } else
        {
          imprimir( 'Error', response.message, 'error' );
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
