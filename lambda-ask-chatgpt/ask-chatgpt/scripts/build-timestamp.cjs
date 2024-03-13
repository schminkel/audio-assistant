const fs = require( 'fs' );

function getCurrentTimestamp() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String( now.getMonth() + 1 ).padStart( 2, '0' );
  const day = String( now.getDate() ).padStart( 2, '0' );
  const hours = String( now.getHours() ).padStart( 2, '0' );
  const minutes = String( now.getMinutes() ).padStart( 2, '0' );
  const seconds = String( now.getSeconds() ).padStart( 2, '0' );

  return `${ year }-${ month }-${ day }_${ hours }-${ minutes }-${ seconds }`;
}

function writeTimestampToFile( filePath ) {
  const timestamp = getCurrentTimestamp();

  fs.writeFile( filePath, timestamp, ( err ) => {
    if ( err ) {
      console.error(
          `Error while writing timestamp to the file "${ filePath }":`, err );
      return;
    }

    console.log(
        `Timestamp "${ timestamp }" has been written to "${ filePath }".` );
  } );
}

// The output file name
const outputFileName = '../.build-timestamp';

writeTimestampToFile( outputFileName );
