const {Client, Users} = require('node-appwrite')

// initialize SDK

const client = new Client();

const users = new Users(client)

client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('64832acf27f65e88cb6f')
    .setKey('3b7a7c1454d66106f305152993bae7fa425a54e9ec45bf29add2358fdb5523f1fe9520a057a397c1a06081bb96fef90b8dc26430ec0c9f89847713121c1f9fa92e8f4316161e45bf9d5f94ac468fbdf06d7cb659834501590705a760fc6a97d59a3d267db97c634ecb51e55d4016275abca80a145e35ac5bd4b32ab1738b812f')