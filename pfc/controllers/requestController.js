import * as fs from 'fs/promises';

import { getContentTypeFrom }  from '../scripts/contentTypeUtil.js';

const BASE = 'http://localhost/';
/**
*  Define a controller to retrieve static resources
*/
export default class RequestController {

  #request;
  #response;
  #url;

  constructor(request, response) {
    this.#request = request,
    this.#response = response;
    this.#url = new URL(this.request.url,BASE).pathname;   // On ne considère que le "pathname" de l'URL de la requête
  }

  get response() {
    return this.#response;
  }
  get request() {
    return this.#request;
  }
  get url() {
    return this.#url;
  }

  async handleRequest() {
    this.response.setHeader("Content-Type" , getContentTypeFrom(this.url) );
    await this.buildResponse();
    this.response.end();
  }

  /**
  * Send the requested resource as it is, if it exists, else responds with a 404 
  */
  async buildResponse() {

    let errorPath = "./public/404.html"
    let filePath = "";
    switch (this.url) {
      case "/pfc":
        filePath = "./public/pfc.html";
        break;
      case "/pfcia":
        filePath = "./public/pfcia.html";
        break;
      case "/":
        filePath = "./public/index.html";
        break;
      case "/about":
        filePath = "./public/about.html";
        break;
      default:
        filePath = `.${this.url}`;
    }
  
    try {
      await fs.access(filePath);
      const data = await fs.readFile(filePath);
      this.response.statusCode = 200;
      this.response.write(data);
    } catch (err) {
      await fs.access(errorPath);
      const data = await fs.readFile(errorPath);
      this.response.statusCode = 404;
      this.response.write(data);
    }
  }
   
}
