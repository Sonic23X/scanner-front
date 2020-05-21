const API_URL = 'https://cloud-scanner.cludevs.com.mx/api/';
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
        $( '.resultScan' ).html(res);
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

function updateFile()
{
  let reader = new FileReader();
  let file = $( '#fileBar' )[0].files[0];

  reader.onload = function()
  {
    $( '.img' ).attr( 'src', reader.result );
    scanBarCode();
  };

  if ( file )
  {
    reader.readAsDataURL( file );
  }
  else
  {
    $( '.img' ).attr( 'src', '' );
  }
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
                  console.log(err);
                });
}

$(document).ready(() =>
{

  if ( TOKEN != null || TOKEN != undefined )
  {  }
  else
    window.location.href = './login.html';

});
