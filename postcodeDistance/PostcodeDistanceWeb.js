const express = require('express');
const fs = require('fs');
const Papa = require('papaparse');
const haversineDistance = require('haversine-distance');
const app = express();
const port = 3000;

let postcodesData;

// Load CSV at the start
fs.readFile('postcodes.csv', 'utf8', (err, data) => {
    if (err) throw err;
    Papa.parse(data, {
        header: true,
        dynamicTyping: true,
        complete: (results) => {
            postcodesData = results.data;
            console.log("CSV file loaded.");
        },
        error: (error) => console.error("Error reading CSV:", error)
    });
});

function calculateDistances(primaryPostcode, targetPostcode){
    console.log("Calculating distance from:", primaryPostcode, "to:", targetPostcode);
    const primary_postcode_data = postcodesData.find(item => item.postcode === primaryPostcode);
    const target_postcode_data = postcodesData.find(item => item.postcode === targetPostcode);

    if (!primary_postcode_data || !target_postcode_data) {
        console.error(`Postcode not found`);
        return null;
    }

    let distance = haversineDistance(
        {lat: primary_postcode_data.latitude, lon: primary_postcode_data.longitude},
        {lat: target_postcode_data.latitude, lon: target_postcode_data.longitude}
    ) * 0.00062137119; // convert to miles

    distance = Math.round(distance * 100) / 100; 

    return distance;
}

app.get('/:primaryPostcode/:t', async (req, res) => {
    const primaryPostcode = req.params.primaryPostcode;
    const targetPostcode = req.params.t; // Changed to 't'
    const distance = calculateDistances(primaryPostcode, targetPostcode);
    if(distance !== null){
        res.send(String(distance));
    } else {
        res.status(404).send('No distance found');
    }
});

app.listen(port, () => {
    console.log(`Web service is running at http://localhost:${port}`);
});