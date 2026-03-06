import https from 'https';

const urls = [
  'https://drive.google.com/uc?export=view&id=1IOLUGGBeP5qRg_EtL1yWIt4JRdM5_klU',
  'https://drive.google.com/uc?export=view&id=11vPjBomfit6RW5mqkPRKlRhVItxWCpPM',
  'https://drive.google.com/uc?export=view&id=1dTKLKVzr16pKybLSt3OFZK8i3CiEj8dI',
  'https://drive.google.com/uc?export=view&id=1xzMu5PxcslMeIeiVE_yHJxIk-LYjEkHM',
  'https://drive.google.com/uc?export=view&id=1jIP0rDFr_xsoBdOSRiW5A6r3zEqFvOv0'
];

urls.forEach(url => {
  https.get(url, (res) => {
    console.log(`URL: ${url}`);
    console.log(`Status: ${res.statusCode}`);
    console.log(`Headers: ${JSON.stringify(res.headers)}`);
    console.log('---');
  }).on('error', (e) => {
    console.error(`Error: ${e.message}`);
  });
});
