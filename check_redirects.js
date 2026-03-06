import https from 'https';

const urls = [
  'https://drive.usercontent.google.com/download?id=1IOLUGGBeP5qRg_EtL1yWIt4JRdM5_klU&export=view',
  'https://drive.usercontent.google.com/download?id=11vPjBomfit6RW5mqkPRKlRhVItxWCpPM&export=view',
  'https://drive.usercontent.google.com/download?id=1dTKLKVzr16pKybLSt3OFZK8i3CiEj8dI&export=view',
  'https://drive.usercontent.google.com/download?id=1xzMu5PxcslMeIeiVE_yHJxIk-LYjEkHM&export=view',
  'https://drive.usercontent.google.com/download?id=1jIP0rDFr_xsoBdOSRiW5A6r3zEqFvOv0&export=view'
];

urls.forEach(url => {
  https.get(url, (res) => {
    console.log(`URL: ${url}`);
    console.log(`Status: ${res.statusCode}`);
    console.log(`Content-Type: ${res.headers['content-type']}`);
    console.log('---');
  }).on('error', (e) => {
    console.error(`Error: ${e.message}`);
  });
});
