import {Client, Account, Databases} from 'appwrite'
const client = new Client()
client
    .setEndpoint('http://localhost/v1')
    .setProject('6483a47331769af5f5f8');
export const account = new Account(client);

// Database
export const databases = new Databases(client)

