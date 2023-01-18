import express from 'express';
import session from 'express-session';
import { request } from 'undici';
import { twitterOAuth2 } from 'twitter-oauth2';
import crypto from 'crypto';

const app = express();
const port = process.env.PORT || 3000

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.send("WELCOME")
})

app.use(session({
  name: crypto.randomBytes(32).toString('hex').slice(1,10),
  secret: [crypto.randomBytes(32).toString('hex')],
  resave: false,
  saveUninitialized: true
}))

// app.use(twitterOAuth2({
//   client_id: 'RnYzN3MyQmtJTXhTSkhfSnRHelY6MTpjaQ',
//   client_secret: 'giVGMttPgN1RhHbb0cuWUn4seai115fNRIKB592XN3YH4WPMmz',
//   redirect_uri: 'http://localhost:3000/twitter/callback',
//   scope: 'tweet.read users.read offline.access'
// }))

// app.use(twitterOAuth2({
//   consumer_key: 'TGBQQctL6WHXupgWrWBYEG3fj',
//   consumer_secret: 'do0pieZIJAcuQQsVRffzVoLF7EPwxe5ZBQT1RzLrmyP6Mrtevg',
//   grant_type: 'client_credentials'
// }))

// app.get('/twitter', async (req, res) => {
//   const tokenSet = req.session.tokenSet;
//   console.log('received tokens %j', req.session.tokenSet);
//   const { body } = await request('https://api.twitter.com/1.1/statuses/user_timeline.json?count=200&screen_name=RaineyAllDay',
//     {
//       headers: {
//         Authorization: `Bearer AAAAAAAAAAAAAAAAAAAAAGo2lAEAAAAA9Jp%2FHIWaq%2FhNTaQqwI9L9%2FKGwZU%3DLScKzuLTNnHXXCQwS3VzGvaDlzKFFLPhDtD7sonHd0wUyVFvRJ`
//       }
//     });
//   const data = await body.json();
//   console.log(data.length)
//   res.send(data);
// })

// app.get('/twitter', async (req, res) => {
//   const tokenSet = req.session.tokenSet;

//   const { body } = await request('https://api.twitter.com/2/users/me',
//     {
//       headers: {
//         Authorization: `Bearer ${tokenSet?.access_token}`
//       }
//     });

//     const datas = await body.json()

//     const user = {
//       userId: datas.data.id,
//       userName: datas.data.username,
//       userToken: req.session.tokenSet.access_token,
//       userRefreshToken: req.session.tokenSet.refresh_token
//     }
  
//   res.redirect(`https://no-code-ai-model-builder.com/version-test/twitter-login?userId=${user.userId}&userName=${user.userName}&userToken=${user.userToken}&userRefreshToken=${user.userRefreshToken}`)
  
// })
// import fetch from "node-fetch";

// const { body } = await fetch('https://api.twitter.com/2/oauth2/token', {
//     method: 'POST',
//     headers: {
//         'Content-Type': 'application/x-www-form-urlencoded',
//         'Authorization': 'Basic V1ROclFTMTRiVWhwTWw4M2FVNWFkVGQyTldNNk1UcGphUTotUm9LeDN4NThKQThTbTlKSXQyZm1BanEzcTVHWC1icVozdmpKeFNlR3NkbUd0WEViUA=='
//     },
//     body: 'code=T1BjcndHZGkybDREak5JZER6UkxYc3BCaHhQT3JqZVR5Z3VmVHZ2MU5qUl9LOjE2NzM0MzU0NTI1Mjc6MToxOmFjOjE&https://no-code-ai-model-builder.com/version-test/twitter-login?state=state&code_verifier=challenge'
// });
// //const data = await body.json();
// //console.log(body)

// const { body2 } = await request('https://api.twitter.com/2/tweets?ids=1577233594673676290',
//     {
//       headers: {
//         Authorization: `Bearer AAAAAAAAAAAAAAAAAAAAAGo2lAEAAAAA9Jp%2FHIWaq%2FhNTaQqwI9L9%2FKGwZU%3DLScKzuLTNnHXXCQwS3VzGvaDlzKFFLPhDtD7sonHd0wUyVFvRJ`
//       }
//     });
//   //const data = await body.json();
//   console.log(body2)

// // const { body2 } = await fetch('https://api.twitter.com/2/tweets?ids=1577233594673676290', {
// //     headers: {
// //       Authorization: `Bearer AAAAAAAAAAAAAAAAAAAAAGo2lAEAAAAA9Jp%2FHIWaq%2FhNTaQqwI9L9%2FKGwZU%3DLScKzuLTNnHXXCQwS3VzGvaDlzKFFLPhDtD7sonHd0wUyVFvRJ`
// //     }
// // });
// // //const data2 = await body.json();
// // console.log(body2)


// app.get('/twitter/callback', async (req, res) => {
//   res.send({'login': 'successful'})
// })

// app.listen(port, () => {
//   console.log(`listen port: ${port}`);
// });

import fetch from 'cross-fetch';

// (async () => {
//   try {
//     const res = await fetch("https://api.twitter.com/2/oauth2/token?code=TXhRTVNSTnBJLUVEeUFlMmNHQkYzUUtqa0preDJzMWJrSmp3Z3dPZlM1ckV2OjE2NzM0NTE5NDk4OTM6MTowOmFjOjE&grant_type=authorization_code&client_id=RnYzN3MyQmtJTXhTSkhfSnRHelY6MTpjaQ&redirect_uri=https://no-code-ai-model-builder.com/version-test/twitter-login&code_verifier=challenge", {
//       headers: {
//         Authorization: "Basic Um5Zek4zTXlRbXRKVFhoVFNraGZTblJIZWxZNk1UcGphUTpnaVZHTXR0UGdOMVJoSGJiMGN1V1VuNHNlYWkxMTVmTlJJS0I1OTJYTjNZSDRXUE1teg=="
//       },
//       method: "POST"
//     })
//     // if (res.status >= 400) {
//     //   throw new Error("Bad response from server");
//     // }

//     const user = await res.json();

//     console.log(user);
//   } catch (err) {
//     console.error(err);
//   }
// })();

(async () => {
  try {
    const res = await fetch("https://api.twitter.com/2/tweets?ids=1080910501280915456", {
      headers: {
        Authorization: "Bearer AAAAAAAAAAAAAAAAAAAAAGo2lAEAAAAA9Jp%2FHIWaq%2FhNTaQqwI9L9%2FKGwZU%3DLScKzuLTNnHXXCQwS3VzGvaDlzKFFLPhDtD7sonHd0wUyVFvRJ"
      }
    })
    // if (res.status >= 400) {
    //   throw new Error("Bad response from server");
    // }

    const user = await res.json();

    console.log(user);
  } catch (err) {
    console.error(err);
  }
})();