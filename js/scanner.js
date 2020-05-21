const API_URL = 'http://localhost:8000/api/';
const EMPRESA = localStorage.getItem( 'empresa' );
const PROCESO = localStorage.getItem( 'proceso' );
const TOKEN = localStorage.getItem( 'token' );

function scanQR(node)
{
  let reader = new FileReader();

  reader.onload = function()
  {
    node.value = "";
    qrcode.callback = function(res)
    {
      if ( !( res instanceof Error ) )
      {
        $( '.resultScan' ).html(result.text);
        $( '#scan-type' ).removeClass( 'fa-barcode' );
        $( '#scan-type' ).addClass( 'fa-qrcode' );
      }
      else
      {
        alert("Error al escanear el QR. Intente de nuevo");
      }
    };
    qrcode.decode(reader.result);
  };
  reader.readAsDataURL(node.files[0]);
}

function updateFile( )
{
  let img = URL.createObjectURL( $( '#fileBar' )[0].files[0] );

  $( '.img' ).attr( 'src', img );

  scanBarCode();
}

function scanBarCode( )
{
      const codeReader = new ZXing.BrowserBarcodeReader();
      const img = $( '.img' )[0].cloneNode(true);

      codeReader.decodeFromImage(img)
                .then(result =>
                {
                  $( '.resultScan' ).html(result.text);
                  $( '#scan-type' ).removeClass( 'fa-qrcode' );
                  $( '#scan-type' ).addClass( 'fa-barcode' );
                })
                .catch(err =>
                {
                  alert( 'Error al analizar el código de barras' );
                });
}

$(document).ready(() =>
{

  if ( TOKEN != null || TOKEN != undefined )
  {  }
  else
    window.location.href = './login.html';

});
