const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/', async function(req, res, next) {
    const apiUrl = 'https://ubci-api.ubcindex.com/v1/crix/feargreed';

    try {
        await axios.get(apiUrl, {
            headers: {
                'ngrok-skip-browser-warning': '69420'
                }
            }).then(response => {
                // const responseDataArray = [response.data];
                res.send(response.data);
            })
            .catch(error => {
            console.error('Error:', error.message);
        });
    } catch (error) {
        console.error('Error during Axios request:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;