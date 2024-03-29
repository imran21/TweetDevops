// Use this code snippet in your app.
// If you need more information about configurations or implementing the sample code, visit the AWS docs:
// https://aws.amazon.com/developers/getting-started/nodejs/

// Load the AWS SDK
var AWS = require('aws-sdk'),
    region = "us-east-1",
    secretName = "arn:aws:secretsmanager:us-east-1:120763833592:secret:data/access/key-SxEnkL",
    secret,
    decodedBinarySecret;

// Create a Secrets Manager client
var client = new AWS.SecretsManager({
    region: region
});

// In this sample we only handle the specific exceptions for the 'GetSecretValue' API.
// See https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
// We rethrow the exception by default.

client.getSecretValue({SecretId: secretName}, function(err, data) {
    if (err) {
        if (err.code === 'DecryptionFailureException')
            // Secrets Manager can't decrypt the protected secret text using the provided KMS key.
            // Deal with the exception here, and/or rethrow at your discretion.
            //console.log(err)
            throw err;
        else if (err.code === 'InternalServiceErrorException')
            // An error occurred on the server side.
            // Deal with the exception here, and/or rethrow at your discretion.
            throw err;
        else if (err.code === 'InvalidParameterException')
            // You provided an invalid value for a parameter.
            // Deal with the exception here, and/or rethrow at your discretion.
            throw err;
        else if (err.code === 'InvalidRequestException')
            // You provided a parameter value that is not valid for the current state of the resource.
            // Deal with the exception here, and/or rethrow at your discretion.
            throw err;
        else if (err.code === 'ResourceNotFoundException')
            // We can't find the resource that you asked for.
            // Deal with the exception here, and/or rethrow at your discretion.
            throw err;
    }
    else {
        // Decrypts secret using the associated KMS CMK.
        // Depending on whether the secret is a string or binary, one of these fields will be populated.
        if ('SecretString' in data) {
            secret = data.SecretString;
            parse_secret = JSON.parse(secret)
            console.log(parse_secret.consumer_key)
            var consumer_key="consumer_key='"+parse_secret.consumer_key+"'"
            var consumer_secret="consumer_secret='"+parse_secret.consumer_secret+"'"
            var access_token="access_token='"+parse_secret.access_token+"'"
            var access_token_secret="access_token_secret='"+parse_secret.access_token_secret+"'"
            console.log(consumer_key+"\n"+consumer_secret+"\n"+access_token+"\n"+access_token_secret)
            var keydata=consumer_key+"\n"+consumer_secret+"\n"+access_token+"\n"+access_token_secret
        // Write data to file for generating env files
          const fs = require('fs');

          fs.writeFile(".env.aws", keydata, function(err) {
           if(err) {
             return console.log(err);
               }
              console.log("The file was saved!");
            }); 

        } else {
            let buff = new Buffer(data.SecretBinary, 'base64');
            decodedBinarySecret = buff.toString('ascii');
        }
    }
    
    // Your code goes here. 
});
