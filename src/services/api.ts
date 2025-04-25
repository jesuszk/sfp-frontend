import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://172.30.0.94/greenbrier/sfp-price-quotation-webservice',
});