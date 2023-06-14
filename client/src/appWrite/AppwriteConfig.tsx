import {Client, Account, Databases} from 'appwrite'
const setEndpoint = import.meta.env.VITE_APPWRITE_SET_ENDPOINT
const setProject = import.meta.env.VITE_APPWRITE_SET_PROJECT
const client = new Client()
client
    .setEndpoint(setEndpoint)
    .setProject(setProject)
    
export const account = new Account(client);

// Database
export const databases = new Databases(client)
