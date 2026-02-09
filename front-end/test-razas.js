const http = require('http');

http.get('http://localhost:3000/catalogos/razas', (resp) => {
    let data = '';

    resp.on('data', (chunk) => {
        data += chunk;
    });

    resp.on('end', () => {
        try {
            const json = JSON.parse(data);
            console.log('Keys:', Object.keys(json[0]));
            console.log('First item:', json[0]);
        } catch (e) {
            console.log('Error parsing JSON:', e.message);
            console.log('Raw data:', data);
        }
    });
}).on("error", (err) => {
    console.log("Error: " + err.message);
});
