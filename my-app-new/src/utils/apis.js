const CLIENT_ID = '';
const AUTH_ID = '';
const BASE_URL = 'https://api-sandbox.arity.com/services/roadside/v1/oauth';

export function getToken() {
  var xhr = new XMLHttpRequest();
    xhr.open('POST', BASE_URL + '/accesstoken?grant_type=client_credentials', true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    // set the authorization HTTP header
    xhr.setRequestHeader('client_id', CLIENT_ID);
    xhr.setRequestHeader('Authorization', AUTH_ID);
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        return {
          response: xhr.response,
          //accessToken: xhr.response.access_token
        }
      } else {
        return {
          response: xhr.response
        }
      }
    });
  xhr.send(null);

  //let idToken = getParameterByName('id_token');
  //ocalStorage.setItem(ID_TOKEN_KEY, idToken);
}



