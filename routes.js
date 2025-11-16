const express = require('express');
const axios = require('axios'); 
const router = express.Router(); 


const RAPIDAPI_HOST = process.env.RAPIDAPI_HOST;
const RAPIDAPI_KEY = process.env.API_KEY; 

const formatVisaCheckData = (props) => {
   
    const { passport, destination, mandatory_registration, visa_rules } = props.data;
    
    const primaryRule = visa_rules.primary_rule;
    const secondaryRule = visa_rules.secondary_rule;

    // 1. Determine the overall status
    let status = 'UNKNOWN';
    if (props.data["Not admitted"] === -1) {
        status = 'NOT_ADMITTED';
    } else if (primaryRule.name) {
        status = primaryRule.name.toUpperCase();
    }

    // 2. Build the simplified, clean response
    return {
        status: status,
        passport_country: passport.name,
        destination_country: destination.name,
        
        visa_rules: {
            primary_rule: {
                name: primaryRule.name,
                duration: primaryRule.duration,
                color: primaryRule.color || 'gray',
            },
            secondary_rule: {
                name: secondaryRule.name || 'N/A',
                duration: secondaryRule.duration || 'N/A',
                color: secondaryRule.color || 'gray',
            },
        },
        
        // Optional useful details
        mandatory_registration: mandatory_registration || null,
        passport_validity: destination?.passport_validity || 'N/A',
        destination_continent: destination?.continent || 'N/A'
    };
};

router.get('/passports', async (request, response) => {
    
    // Check for security variables (assuming we use the V2 endpoint for all passports)
    if (!RAPIDAPI_KEY || !RAPIDAPI_HOST) {
        return response.status(500).json({ error: 'Server configuration error: RapidAPI keys are missing in .env.' });
    }

    const options = {
        method: 'GET',
        // The URL is correct for listing all passports
        url: `https://visa-requirement.p.rapidapi.com/v2/passports`, 
        headers: {
            // Using correct environment variable names from a fixed .env file
            'X-RapidAPI-Key': RAPIDAPI_KEY,      
            'X-RapidAPI-Host': RAPIDAPI_HOST     
        }
        // Removed 'data' and 'Content-Type' since this is a simple GET request
    };

    console.log(`Fetching passport list from RapidAPI...`);

    try {
        // Execute the API call
        const apiResponse = await axios.request(options);

        // Send the data back to the client
        response.json(apiResponse.data);
        
    } catch (error) {
        console.error('External RapidAPI call failed:', error.message);
        
        response.status(500).json({ 
            error: 'Failed to retrieve data from RapidAPI service.',
            details: error.message 
        });
    }
});

router.get('/destinations', async (request, response) => {
    
    // Check for security variables (assuming we use the V2 endpoint for all passports)
    if (!RAPIDAPI_KEY || !RAPIDAPI_HOST) {
        return response.status(500).json({ error: 'Server configuration error: RapidAPI keys are missing in .env.' });
    }

    const options = {
        method: 'GET',
        // The URL is correct for listing all passports
        url: `https://visa-requirement.p.rapidapi.com/v2/destinations`, 
        headers: {
            // Using correct environment variable names from a fixed .env file
            'X-RapidAPI-Key': RAPIDAPI_KEY,      
            'X-RapidAPI-Host': RAPIDAPI_HOST     
        }
        // Removed 'data' and 'Content-Type' since this is a simple GET request
    };

    console.log(`Fetching destination list from RapidAPI...`);

    try {
        // Execute the API call
        const apiResponse = await axios.request(options);

        // Send the data back to the client
        response.json(apiResponse.data);
        
    } catch (error) {
        console.error('External RapidAPI call failed:', error.message);
        
        response.status(500).json({ 
            error: 'Failed to retrieve data from RapidAPI service.',
            details: error.message 
        });
    }
});

router.post('/visa/check', async (request, response) => {
    
    if (!RAPIDAPI_KEY || !RAPIDAPI_HOST) {
        return response.status(500).json({ error: 'Server configuration error: RapidAPI keys are missing in .env.' });
    }

    const options = {
        method: 'POST',
        // The URL is correct for listing all passports
        url: `https://visa-requirement.p.rapidapi.com/v2/visa/check`, 
        headers: {
            // Using correct environment variable names from a fixed .env file
            'X-RapidAPI-Key': RAPIDAPI_KEY,      
            'X-RapidAPI-Host': RAPIDAPI_HOST,
            'Content-Type': 'application/json'
        },
        data: request.body,
    };


    try {
        // Execute the API call
        const apiResponse = await axios.request(options);

        // Send the data back to the client
        const formattedData = formatVisaCheckData(apiResponse.data);
        response.json(formattedData);
        
    } catch (error) {
        console.error('External RapidAPI call failed:', error.message);
        
        response.status(500).json({ 
            error: 'Failed to retrieve data from RapidAPI service.',
            details: error.message 
        });
    }
});
router.post('/visa/map', async (request, response) => {
    
    if (!RAPIDAPI_KEY || !RAPIDAPI_HOST) {
        return response.status(500).json({ error: 'Server configuration error: RapidAPI keys are missing in .env.' });
    }
    console.log('Received /visa/map request with body:', request.body);

    const options = {
        method: 'POST',
        // The URL is correct for listing all passports
        url: `https://visa-requirement.p.rapidapi.com/v2/visa/map`, 
        headers: {
            // Using correct environment variable names from a fixed .env file
            'X-RapidAPI-Key': RAPIDAPI_KEY,      
            'X-RapidAPI-Host': RAPIDAPI_HOST,
            'Content-Type': 'application/json'
        },
        data: request.body,
    };


    try {
        // Execute the API call
        const apiResponse = await axios.request(options);

        // Send the data back to the client
        response.json(apiResponse.data);
        
    } catch (error) {
        console.error('External RapidAPI call failed:', error.message);
        
        response.status(500).json({ 
            error: 'Failed to retrieve data from RapidAPI service.',
            details: error.message 
        });
    }
});


module.exports = router;