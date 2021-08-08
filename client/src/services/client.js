import { create } from 'axios';
// import router from '../router.js';

let client = create({
  //baseURL: `${process.env.PROTOCOL || "http" }://${process.env.ORIGIN || "localhost" }`
});

export default client;