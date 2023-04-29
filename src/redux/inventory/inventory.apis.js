import axios from 'axios';

const token = window.localStorage.getItem('token');
const headers = {
    'Access-Control-Allow-Origin': '*',
    Authorization: `Bearer ${token}`
};
export const localAPI = axios.create({
    baseURL: 'http://localhost:3000',
    headers
});

const testAPI = axios.create({
    baseURL: 'https://hectrewebapp-develop-wip.azurewebsites.net',
    headers
});

const betaAPI = axios.create({
    baseURL: 'https://hectre-webapp-betatesting.azurewebsites.net',
    headers
});

const baseURL = window.location.origin;
export const sprayAPI = axios.create({
    baseURL,
    headers
});
