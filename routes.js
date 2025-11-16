const express = require('express');
const axios = require('axios'); 
const router = express.Router(); 


const RAPIDAPI_HOST = process.env.RAPIDAPI_HOST;
const RAPIDAPI_KEY = process.env.API_KEY; 



const formatVisaCheckData = (apiResponse) => {
    const data = apiResponse.data.data;
 
    return {
        visa_rules: data.visa_rules,
        mandatory_registration: data.mandatory_registration 
    };
};


router.get('/passports', async (request, response) => {

    const options = {
        method: 'GET',
        url: `https://visa-requirement.p.rapidapi.com/v2/passports`, 
        headers: {
            'X-RapidAPI-Key': RAPIDAPI_KEY,      
            'X-RapidAPI-Host': RAPIDAPI_HOST     
        }
    };

    try {
        const apiResponse = await axios.request(options);

        response.json(apiResponse.data);
        
    } catch (error) {
        console.error('External RapidAPI call failed:', error.message);
    }
});

router.get('/destinations', async (request, response) => {
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
    }
});

router.post('/visa/check', async (request, response) => {
    console.log('Received /visa/check request with body:', request.body);
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
        const formattedData = formatVisaCheckData(apiResponse);
       
       response.json({
        data: formattedData
    });    
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
        console.log(apiResponse.data)
        response.json(apiResponse.data);
        
        
    } catch (error) {
        console.error('External RapidAPI call failed:', error.message);
    }
});


module.exports = router;