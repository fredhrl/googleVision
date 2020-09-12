const fs = require('fs');
const vision = require('@google-cloud/vision');

const {client_email, private_key, project_id} = require('./google-cloud-credentials.json');
const { application } = require('express');

const client = new vision.ImageAnnotatorClient({
    credentials:{
        client_email,
        private_key,
        project_id
    }
});

module.exports.extract = async function(filepath = '' , mimetype = ''){

    const fileBuffer = fs.readFileSync(filepath);
    const requestNeeded = ['application/pdf','application/gif','application/tiff'].some(e => e === mimetype);
    
    const iputConfig = {
        mimetype,
        content: fileBuffer
    };

    const features = [{type: 'DOCUMENT_TEXT_DETECTION'}];
    
    const request = {
        requests: [
            {
            iputConfig,
            features,
            pages: [1]
            }
        ]
    };

    

    const [result] = requestNeeded ? client.batchAnnotateFiles(request): await client.documentTextDetection(fileBuffer);

    const fullTextAnnotation = result.fullTextAnnotation || result.responses[0].responses[0].fullTextAnnotation;

    return result.fullTextAnnotation.text;
}