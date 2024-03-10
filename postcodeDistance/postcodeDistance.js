const fs = require('fs');
const Papa = require('papaparse');
const haversineDistance = require('haversine-distance');

let primary_postcode = "BR3 3DX"
let target_postcodes = ["BR3 3DX", "SW1A 2AA", "EC2A 1BB", "W2A 1HQ", "SE2 9GF", "BS35 8JZ", 
    "B1 1HQ", "M1 1AE", "S1 2HE", "CF10 1BS", "LL24 0UY", 
    "EC1V 1JN", "N1 0QH", "W1K 7DA", "KT2 5AU", "RG1 3YL",
    "BD23 1UD", "SO23 9AP", "CM1 1PH", "LU1 2SJ", "LS1 5ES", 
    "E1 6AN", "NG1 2AB", "PR1 2HE", "CV1 1FP", "ST1 5SJ", 
    "B33 8TH", "BA1 1UA", "TS1 2PX", "BT1 1HL", "DG1 2PQ",
    "FK1 5LD", "NE1 1ED", "BS1 1EN", "PO1 3AP", "BN1 1HA",
    "TN1 1JP", "TQ1 1DT", "PL1 1EZ", "TR1 2RP", "CT1 1UT",
    "EX1 1GJ", "DT1 1XL", "BH1 1LG", "SP1 2JP", "SN1 1DQ",
    "TA1 1NW", "GL1 1DE", "HR1 2JB", "WR1 2HW", "WD17 1NJ",
    "HP1 1AA", "CB1 1JH", "MK1 1BA", "PE1 1XF", "SG1 1EZ"];
target_postcodes = []


// Define function to read CSV file
function readCSV(filename){
    const fileContent = fs.readFileSync(filename, 'utf8');
    return new Promise((resolve, reject) => {
        Papa.parse(fileContent, {
            header: true,
            dynamicTyping: true,
            complete: (results) => resolve(results.data),
            error: (error) => reject(error)
        });
    });
}






// Define function to calculate distances
async function calculateDistances(filename, primaryPostcode){
	console.log("Calculating distances from postcode:", primaryPostcode)
    const data = await readCSV(filename);
    const distances = [];

    const primary_postcode_data = data.find(item => item.postcode === primaryPostcode);

    if (!primary_postcode_data) {
        console.error(`Primary postcode ${primaryPostcode} not found`);
        return distances;
    }
	
    if(target_postcodes.length == 0) {
		for(let i=0; i<data.length; i++){
			target_postcodes.push(data[Math.floor(Math.random() * data.length)])		
		}
	} else {
		let temp = []
		target_postcodes.forEach((item)=> {
			const result = data.find(({postcode}) => postcode === item);
			if(result!=null) {
				temp.push(result)
			} else {
				console.log(item, "not found")
			}
		})
		target_postcodes = temp;
	}
	
    target_postcodes.forEach((target) => {
        let distance = haversineDistance(
            {lat: primary_postcode_data.latitude, lon: primary_postcode_data.longitude},
            {lat: target.latitude, lon: target.longitude}
        ) * 0.00062137119 // convert to miles
        
		distance = Math.round(distance * 100) / 100; 
		
        distances.push({postcode: target.postcode, distance});
    });

    return distances;
}

// Use the function
calculateDistances('postcodes.csv', primary_postcode)
    .then(distances => console.log(distances))
    .catch(error => console.error(error));
