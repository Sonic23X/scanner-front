const API_URL = 'https://cloud-scanner.cludevs.com.mx/api/';
//const API_URL = 'http://localhost:8000/api/';
const EMPRESA = localStorage.getItem( 'empresa' );
const PROCESO = localStorage.getItem( 'proceso' );
const USUARIO = localStorage.getItem( 'usuario' );
const TOKEN = localStorage.getItem( 'token' );

//Variables Globales
var movil = 0;
var producto = false;
var files = [];
var cod;
var lon;
var lat;

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
  lon = position.coords.longitude;
  lat = position.coords.latitude;
}

function logout()
{
  $( '.app' ).hide();
  $( '.no-permission' ).show();
}

function permissionAgain()
{
  location.reload();
}

function setOfServer( arr )
{
  if (arr != '[]')
  {
    arr = arr.replace('[', '');
    arr = arr.replace(']', '');
    arr = arr.split( ',' );

    arr.forEach((item, i) =>
    {
      item = item.replace('"', '');
      item = item.replace(' ', '');
      item = item.replace('"', '');

      fetch( API_URL + 'image/' + item, { headers: { 'Authorization': `Bearer ${TOKEN}` }  } )
        .then(res => res.blob())
        .then(blob =>
        {
          let file = new File([blob], "product_photo.png",{type:"image/png", lastModified:new Date()});
          files.push( file );

          setViewImages();
      });
    });
  }
}

function toProductForm( response )
{
  //escondemos el formulario de lectura y mostramos el form
  $( '#step1' ).hide('slow');
  $( '#step2' ).show('slow');

  if ( response.search )
  {
    let producto = response.data;

    $( '.productTitle' ).html( 'Producto encontrado' );
    $( '#description' ).val( producto.description );
    $( '#medida' ).val( producto.idMedida );
    $( '#qty' ).val( producto.qty );
    $( '#serie' ).val( producto.serie );
    $( '#caducidad' ).val( producto.caducidad );

    setOfServer( producto.images );

    producto = true;
  }
  else
  {
    $( '.productTitle' ).html( 'Producto no encontrado' );
    producto = false;
  }
}

function searchProduct( codigo )
{
  cod = codigo;

  $.ajax({
    url: API_URL + `producto/${codigo}`,
    type: 'GET',
    headers:
    {
      'Authorization': `Bearer ${TOKEN}`
    },
    dataType: 'json',
    success: response =>
    {
      toProductForm ( response );
    },
    error: ( jqXHR, textStatus, errorThrown ) => {  },
    complete: () => {  }
  });
}

function back()
{
  $( '#step2' ).hide('slow');
  $( '#step1' ).show('slow');

  resetForm();
}

function folio( data )
{
  $( '#step2' ).hide('slow');
  $( '#step3' ).show('slow');

  $( '.folioNumber' ).html( data.id );
  $( '.folio_operation' ).html( data.description );
}

function resetForm()
{
  $( '#description' ).val( '' );
  $( '#medida' ).val();
  $( '#qty' ).val( '' );
  $( '#serie' ).val( '' );
  $( '#caducidad' ).val( '' );
  $( '#area' ).val( 1 );
  $( '#search' ).val( '' );

  $( '.image-body' ).html( '' );
}

function restart()
{
  $( '#step3' ).hide('slow');
  $( '#step1' ).show('slow');

  resetForm( );
  files = [ ];
}

function viewImage( url )
{
  let win = window.open( url, '_blank' );
  win.focus( );
}

function deletePhoto( id )
{
  //remove of array
  let drop = files[ id ];

  let i = files.indexOf( drop );

  if ( i !== -1 )
    files.splice( i, 1 );

  setViewImages();

}

function setViewImages()
{
  $( '.image-body' ).html( '' );
  for (let i = 0; i < files.length; i++)
  {
    let img = URL.createObjectURL( files[ i ] );

    let imgView =
    `
      <div class="col-sm" id="image_${i}">
        <img src="${img}" class="img-preview" onClick="viewImage('${img}')" />
        <br>
        <button type="button" class="mt-2 btn btn-outline-danger" onClick="deletePhoto('${i}')">
          Quitar
        </button>
      </div>
    `;

    $( '.image-body' ).append( imgView );
  }
}

function print()
{
  window.print();
}

$(document).ready( () =>
{

  if ( TOKEN != null || TOKEN != undefined )
  {  }
  else
    window.location.href = './login.html';

  //obtenemos coordenadas
  navigator.geolocation.getCurrentPosition( setCoordenadas, logout );

  $( '.search-product' ).submit( event =>
  {
    event.preventDefault();

    let codigo = $( '#search' ).val();

    searchProduct( codigo );

  });

  //obetenemos las medidas
  $.ajax({
    url: API_URL + `medida`,
    type: 'GET',
    headers:
    {
      'Authorization': `Bearer ${TOKEN}`
    },
    dataType: 'json',
    success: response =>
    {
      response.forEach((item, i) =>
      {

        let option =
        `<option value="${item.id}">${item.description}</option>`;

        $( '#medida' ).append( option );
      });

    },
    error: ( jqXHR, textStatus, errorThrown ) => { alert( 'No se pudieron obtener las medidas' ); },
  });

  $.ajax({
    url: API_URL + `area`,
    type: 'GET',
    headers:
    {
      'Authorization': `Bearer ${TOKEN}`
    },
    dataType: 'json',
    success: response =>
    {
      response.forEach((item, i) =>
      {

        let option =
        `<option value="${item.id}">${item.description}</option>`;

        $( '#area' ).append( option );
      });

    },
    error: ( jqXHR, textStatus, errorThrown ) => { alert( 'No se pudieron obtener las areas' ); },
  });

  $( '#productImage' ).change( event =>
  {

    if ($( '#productImage' )[ 0 ].files.length < 4)
    {

      for ( let i = 0; i < $( '#productImage' )[ 0 ].files.length; i++ )
      {
        if ( files.length < 3)
        {
          files.push( $( '#productImage' )[ 0 ].files[ i ] );
          setViewImages();
        }
        else
        {
          alert( 'Solo se permite 3 imagenes por producto' );
          return;
        }
      }

    }
    else
    {
      alert( 'Solo se permite 3 imagenes por producto' );
      return;
    }
  });

  $( '.productForm' ).submit(function(event)
  {
    event.preventDefault();

    var formData = new FormData();

    //colocamos los valores { Producto }
    formData.set( 'idProducto', cod );
    formData.set( 'description', $( '#description' ).val() );
    formData.set( 'idMedida', $( '#medida' ).val() );
    formData.set( 'qty', $( '#qty' ).val() );
    formData.set( 'serie', $( '#serie' ).val() );
    formData.set( 'caducidad', $( '#caducidad' ).val() );

    //colocamos los valores { Lectura }
    formData.set( 'idArea', $( '#area' ).val() );
    formData.set( 'idEmpresa', EMPRESA );
    formData.set( 'lat', lat );
    formData.set( 'lon', lon );
    formData.set( 'idUser', USUARIO );
    formData.set( 'idProceso', PROCESO );

    files.forEach((item, i) =>
    {
      formData.set( 'file_' + i, item );
    });

    $.ajax({
      url: API_URL + `lectura`,
      type: 'POST',
      headers:
      {
        'Authorization': `Bearer ${TOKEN}`
      },
      processData: false,
      contentType: false,
      data: formData,
      success: response =>
      {
        folio( response.Folio )
      },
      error: ( jqXHR, textStatus, errorThrown ) => { console.log( jqXHR, textStatus, errorThrown ); },
    });

  });

});
