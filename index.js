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

app.use(twitterOAuth2({
  client_id: 'RnYzN3MyQmtJTXhTSkhfSnRHelY6MTpjaQ',
  client_secret: 'giVGMttPgN1RhHbb0cuWUn4seai115fNRIKB592XN3YH4WPMmz',
  redirect_uri: 'http://localhost:3000/twitter/callback',
  scope: 'tweet.read users.read offline.access'
}))

app.get('/twitter', async (req, res) => {
  const tokenSet = req.session.tokenSet;

  const { body } = await request('https://api.twitter.com/2/users/me',
    {
      headers: {
        Authorization: `Bearer ${tokenSet?.access_token}`
      }
    });

    const datas = await body.json()

    const user = {
      userId: datas.data.id,
      userName: datas.data.username,
      userToken: req.session.tokenSet.access_token,
      userRefreshToken: req.session.tokenSet.refresh_token
    }
    
  // res.status(200).send({user: {
  //   userId: datas.data.id,
  //   userName: datas.data.username,
  //   userToken: req.session.tokenSet.access_token,
  //   userRefreshToken: req.session.tokenSet.refresh_token
  // }})
  
  res.redirect(`https://no-code-ai-model-builder.com/version-test/twitter-login?user=${JSON.stringify(user)}`)
  
})

app.get('/twitter/callback', async (req, res) => {
  res.send({'login': 'successful'})
})

app.listen(port, () => {
  console.log(`listen port: ${port}`);
});