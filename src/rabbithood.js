const logger = require('sst').logger;
const axios = require('axios');

class Rabbithood {
  constructor(authToken, customHeaders) {
    // durring construction we need to create / test a connection with robinhood.
    // all following calls against the api will be fine
    this.defaultHeaders = {
        'Accept': '*/*',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'en;q=1, fr;q=0.9, de;q=0.8, ja;q=0.7, nl;q=0.6, it;q=0.5',
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        'Connection': 'keep-alive',
        'X-Robinhood-API-Version': '1.403.0',
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36'
    };
    this.headers = {};
    this.setHeaders(customHeaders);
    this.authenticate(authToken);
  }

  setHeaders(customHeaders) {
    if(authToken && authToken.length >1) {
      this.headers = customHeaders;
      logger.info(`Using custom headers`);
    } else {
      this.headers = this.defaultHeaders;
      logger.info(`Using default headers`);
    }
  }

  /**
   * authenticate
   * @param {string} authToken -
   **/
  authenticate(authToken) {
    if(authToken && authToken.length >1) {
      this.headers.Authorization = 'Bearer ' + authToken;
    } else {
      logger.info(`Auth tokens are required for all calls through robinhood`);
      logger.warn(`You have not entered an auth token into the constructor`);
    }
  }

  getFundamentals(ticker) {
    const uri = this.apiUrl + this.endpoints.fundamentals;

    const data = { 'symbols': ticker };
    const options = {
      method: 'GET',
      headers: this.headers,
      data: qs.stringify(data),
      uri,
    };

    return axios(options);
  }

  getInvestmentProfile(ticker) {
    const uri = this.apiUrl + this.endpoints.investmentProfile;

    const data = { 'symbols': ticker };
    const options = {
      method: 'GET',
      headers: this.headers,
      data: qs.stringify(data),
      uri,
    };

    return axios(options);
  }

  getInstruments(symbol) {
    const uri = this.apiUrl + this.endpoints.instruments;

    const data = {'query': symbol.toUpperCase()};
    const options = {
      method: 'GET',
      headers: this.headers,
      data: qs.stringify(data),
      uri,
    };

    return axios(options);
  }
}
