const API_URL = 'https://cloud-scanner.cludevs.com.mx/api/';
const EMPRESA = localStorage.getItem( 'empresa' );
const PROCESO = localStorage.getItem( 'proceso' );
const TOKEN = localStorage.getItem( 'token' );

let movil = 0;

let isMobile =
{
  Android: () =>
  {
    return navigator.userAgent.match(/Android/i);
  },
  BlackBerry: () =>
  {
    return navigator.userAgent.match(/BlackBerry/i);
  },
  iOS: () =>
  {
      return navigator.userAgent.match(/iPhone|iPad|iPod/i);
  },
  Opera: () =>
  {
      return navigator.userAgent.match(/Opera Mini/i);
  },
  Windows: () =>
  {
      return navigator.userAgent.match(/IEMobile/i);
  },
  any: () =>
  {
      return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
  }
};

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
        console.log( res );
      }
    };
    qrcode.decode(reader.result);
  };
  reader.readAsDataURL(node.files[0]);
}

function updateFile()
{
  let img = URL.createObjectURL( $( '#fileBar' )[0].files[0] );

  if ( isMobile.any() )
  {
    scanBarCodeQuagga( img );
  }
  else
  {
    $( '.img' ).attr( 'src', img );
    scanBarCodeZebra();
  }

}

function scanBarCodeZebra()
{
  const codeReader = new ZXing.BrowserBarcodeReader();
  const img = $( '.img' )[0].cloneNode(true);

  codeReader.decodeFromImage(img)
            .then(result =>
            {
              console.log( result );
              $( '.resultScan' ).html(result.text);
              $( '#scan-type' ).removeClass( 'fa-qrcode' );
              $( '#scan-type' ).addClass( 'fa-barcode' );
            })
            .catch(err =>
            {
              alert( 'Error al escanear | zebra' );
            });
}

function scanBarCodeQuagga( image )
{
  Quagga.decodeSingle(
  {
    decoder:
    {
      readers: ['code_128_reader', 'code_39_reader']
    },
    locate: true,
    numOfWorkers: 0,
    inputStream:
    {
      size: 800
    },
    src: image
  },
  function(result)
  {
    console.log(result);

    if(result.codeResult)
    {
      $( '.resultScan' ).html(result.codeResult.code);
      $( '#scan-type' ).removeClass( 'fa-qrcode' );
      $( '#scan-type' ).addClass( 'fa-barcode' );
    } else
    {
        alert( 'Error al escanear | movil' );
    }
  });
}

function setCoordenadas( position )
{
  $( '.lon' ).html( position.coords.longitude );
  $( '.lat' ).html( position.coords.latitude );
}

function logout()
{
  alert( 'No se pudo obtener la ubicación, el sistema se cerrará' );
  localStorage.clear();
  window.location.href = './login.html';
}

$(document).ready(() =>
{

  if ( TOKEN != null || TOKEN != undefined )
  {  }
  else
    window.location.href = './login.html';

  //obtenemos coordenadas
  navigator.geolocation.getCurrentPosition( setCoordenadas, logout );


});
