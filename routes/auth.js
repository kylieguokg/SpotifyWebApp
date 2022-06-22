const express = require('express');
const querystring = require('querystring');
const axios = require('axios');
const jwt = require('jsonwebtoken');


const router = express.Router();

router.get('/login', (req, res) => {
    res.redirect(`https://accounts.spotify.com/authorize?${querystring.stringify({
        response_type: 'code',
        client_id: process.env.SPOTIFY_CLIENT_ID,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
    })}`);
});

router.get('/callback', function(req, res) {

  // your application requests refresh and access tokens
  // after checking the state parameter

  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;
  var client_id = process.env.SPOTIFY_CLIENT_ID;
  var client_secret = process.env.SPOTIFY_SECRET;
  var redirect_uri = process.env.SPOTIFY_REDIRECT_URI;


  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    console.log("helo!");
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {

        var access_token = body.access_token,
            refresh_token = body.refresh_token;

        var options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };

        // use the access token to access the Spotify Web API
        request.get(options, function(error, response, body) {
          console.log(body);
        });

        // we can also pass the token to the browser to make requests from there
        res.redirect('/#' +
          querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token
          }));
      } else {
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
});

// router.get('/callback', async (req, res) => {
//     const {code} = req.query;
//     const clientId = process.env.SPOTIFY_CLIENT_ID;
//     var state = req.query.state || null;
//     const secret = process.env.SPOTIFY_CLIENT_SECRET;
//     const redirect_uri = process.env.SPOTIFY_REDIRECT_URI;
//     const grant_type = 'authorization_code';

//     const basicHeader = Buffer.from(`${clientId}:${secret}`).toString('base64');
//     const {data} = await axios.post('https://accounts.spotify.com/api/token', querystring.stringify({
//         grant_type,
//         code,
//         redirect_uri,
//         grant_type
//     }), {
//         headers: {
//             Authorization: `Basic ${basicHeader}`,
//             'Content-Type': 'application/x-www-form-urlencoded'
//         }
//     });

//     const sessionJWTObject = {
//         token: data.access_token,
//     };

//     req.session.jwt = jwt.sign(sessionJWTObject, process.env.JWT_SECRET_KEY);

//     return res.redirect('/');
// });

router.get('/current-session', (req, res) => {
    jwt.verify(req.session.jwt, process.env.JWT_SECRET_KEY, (err, decodedToken) => {
        if (err || !decodedToken) {
            res.send(false);
        } else {
            res.send(decodedToken);
        }
    });
})

router.get('/logout', (req, res) => {
    req.session = null;
    res.redirect(
        `/`
    );
});

module.exports = router;


// const querystring = require('querystring');
// const axios = require('axios');
// const jwt = require('jsonwebtoken');
// const express = require('express'); // Express web server framework
// const session = require('cookie-session');
// const helmet = require('helmet'); // sets HTTP headers to defend against common web app security vulnerabilities e.g. xss attacks
// const hpp = require('hpp'); // protects against HTTP Parameter Pollution attacks
// const csurf = require('csurf'); // protects against cross-site request forgery
// const dotenv = require('dotenv');
// const path = require('path');

// const { auth } = require('express-openid-connect');
// const passport = require('passport');

// const jwtRequired = passport.authenticate('jwt', {session: false});

// const router = express.Router();


// /**
//  * Generates a random string containing numbers and letters
//  * @param  {number} length The length of the string
//  * @return {string} The generated string
//  */
//  var generateRandomString = function(length) {
//     var text = '';
//     var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
//     for (var i = 0; i < length; i++) {
//       text += possible.charAt(Math.floor(Math.random() * possible.length));
//     }
//     return text;
//   };


// router.get('/login', (req, res) => {

//     var state = generateRandomString(16);
//     var scope = 'user-follow-read'
//     var show_dialog = false

//     console.log("login");

//     res.redirect('https://accounts.spotify.com/authorize?' +
//     querystring.stringify({
//       response_type: 'code',
//       client_id: process.env.SPOTIFY_CLIENT_ID,
//       state: state, 
//       scope: scope,
//       show_dialog: show_dialog,
//       redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
//       state: state,
//     }));


  
// });

// router.get('/callback', function(req, res) {

//   // your application requests refresh and access tokens
//   // after checking the state parameter

//   var code = req.query.code || null;
//   var state = req.query.state || null;
//   var storedState = req.cookies ? req.cookies[stateKey] : null;

//   const client_id = process.env.SPOTIFY_CLIENT_ID;
//   const client_secret = process.env.SPOTIFY_SECRET;
//   const redirect_uri = process.env.SPOTIFY_REDIRECT_URI;
//   const grant_type = 'authorization_code';


//   if (state === null || state !== storedState) {
//     res.redirect('/#' +
//       querystring.stringify({
//         error: 'state_mismatch'
//       }));
//   } else {
//     res.clearCookie(stateKey);
//     var authOptions = {
//       url: 'https://accounts.spotify.com/api/token',
//       form: {
//         code: code,
//         redirect_uri: redirect_uri,
//         grant_type: 'authorization_code'
//       },
//       headers: {
//         'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
//       },
//       json: true
//     };

//     request.post(authOptions, function(error, response, body) {
//       if (!error && response.statusCode === 200) {

//         var access_token = body.access_token,
//             refresh_token = body.refresh_token;

//         var options = {
//           url: 'https://api.spotify.com/v1/me',
//           headers: { 'Authorization': 'Bearer ' + access_token },
//           json: true
//         };

//         // use the access token to access the Spotify Web API
//         request.get(options, function(error, response, body) {
//           console.log(body);
//         });

//         // we can also pass the token to the browser to make requests from there
//         res.redirect('/#' +
//           querystring.stringify({
//             access_token: access_token,
//             refresh_token: refresh_token
//           }));
//       } else {
//         res.redirect('/#' +
//           querystring.stringify({
//             error: 'invalid_token'
//           }));
//       }
//     });
//   }
// });

// // router.get('/callback', async (req, res) => {

// //     const code = req.query.code;
// //     const client_id = process.env.SPOTIFY_CLIENT_ID;
// //     const secret = process.env.SPOTIFY_SECRET;
// //     const redirect_uri = process.env.SPOTIFY_REDIRECT_URI;
// //     const grant_type = 'authorization_code';

// //     const basicHeader =
// //     Buffer.from('${clientId}:${secret}').toString('base64');
// //     const {data} = await axios.post('https://accounts.spotify.com/api/token', 
// //     querystring.stringify({
// //         grant_type,
// //         code,
// //         redirect_uri,
// //     }), {
// //         headers: {
// //             Authorization: 'Basic ${basicHeader}',
// //             'Content-Type' : 'application/x-www-form-urlencoded'
// //         }

// //     });

// //     const sessionJWTObject = {
// //         token: data.access_token,
// //     };

// //     req.session.jwt = jwt.sign(sessionJWTObject, process.env.JWT_SECRET_KEY);

// //     return res.redirect('/');


// // });



// // const config = {
// //   authRequired: false,
// //   auth0Logout: true,
// //   secret: 'a long, randomly-generated string stored in env',
// //   baseURL: 'http://localhost:3000',
// //   clientID: 'eIbxXFpt4vnQZYJimkGVYkEkvn8M0rwK',
// //   issuerBaseURL: 'https://kylieg.au.auth0.com'
// // };


// // verifying the JWT token in session
// router.get('/current-session', (req, res) => {
//     jwt.verify(req.session.jwt, process.env.JWT_SECRET_KEY, (err, decodedToken) => {
//         if (err || !decodedToken){
//             res.send(false);
//         } else {
//             res.send(decodedToken);
//         }
//     })
// });


// // destroyes JWT token
// router.get('/logout', (req, res) => {

//     req.session = null;
//     req.redirect(
//         '/'
//     );

// });






// module.exports = router;