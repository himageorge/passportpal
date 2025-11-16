const express = require('express');
const axios = require('axios'); 
const router = express.Router(); 


const RAPIDAPI_HOST = process.env.RAPIDAPI_HOST;
const RAPIDAPI_KEY = process.env.API_KEY; 

const formatVisaCheckData = (props) => {
   
    const { passport, destination, mandatory_registration, visa_rules } = props.data;
    
    const primaryRule = visa_rules.primary_rule;
    const secondaryRule = visa_rules.secondary_rule;


    let status = 'UNKNOWN';
    if (props.data["Not admitted"] === -1) {
        status = 'NOT_ADMITTED';
    } else if (primaryRule.name) {
        status = primaryRule.name.toUpperCase();
    }

    
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
    
    
    if (!RAPIDAPI_KEY || !RAPIDAPI_HOST) {
        return response.status(500).json({ error: 'Server configuration error: RapidAPI keys are missing in .env.' });
    }

    const options = {
        method: 'GET',
        url: `https://visa-requirement.p.rapidapi.com/v2/passports`, 
        headers: {
            'X-RapidAPI-Key': RAPIDAPI_KEY,      
            'X-RapidAPI-Host': RAPIDAPI_HOST     
        }
    };

    console.log(`Fetching passport list from RapidAPI...`);

    try {
        const apiResponse = await axios.request(options);

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
    if (!RAPIDAPI_KEY || !RAPIDAPI_HOST) {
        return response.status(500).json({ error: 'Server configuration error: RapidAPI keys are missing in .env.' });
    }

    const options = {
        method: 'GET',
        url: `https://visa-requirement.p.rapidapi.com/v2/destinations`, 
        headers: {
            'X-RapidAPI-Key': RAPIDAPI_KEY,      
            'X-RapidAPI-Host': RAPIDAPI_HOST     
        }
    };

    console.log(`Fetching destination list from RapidAPI...`);

    try {
        const apiResponse = await axios.request(options);
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
    const options = {
        method: 'POST',
        url: `https://visa-requirement.p.rapidapi.com/v2/visa/check`, 
        headers: {
            'X-RapidAPI-Key': RAPIDAPI_KEY,      
            'X-RapidAPI-Host': RAPIDAPI_HOST,
            'Content-Type': 'application/json'
        },
        data: request.body,
    };
    try {
        const apiResponse = await axios.request(options);
        const formattedData = formatVisaCheckData(apiResponse.data);
        response.json(formattedData);
        
    } catch (error) {
        console.error('External RapidAPI call failed:', error.message);

    }
});


router.post('/visa/map', async (request, response) => {
    
    if (!RAPIDAPI_KEY || !RAPIDAPI_HOST) {
        return response.status(500).json({ error: 'Server configuration error: RapidAPI keys are missing in .env.' });
    }
    console.log('Received /visa/map request with body:', request.body);

    const options = {
        method: 'POST',
        url: `https://visa-requirement.p.rapidapi.com/v2/visa/map`, 
        headers: {
            'X-RapidAPI-Key': RAPIDAPI_KEY,      
            'X-RapidAPI-Host': RAPIDAPI_HOST,
            'Content-Type': 'application/json'
        },
        data: request.body,
    };


    try {
        const apiResponse = await axios.request(options);

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