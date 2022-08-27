### Prerequirements

- Bot user account with proper permissions in test server
- Node.js installed
- - Discord.js@14.3.0 requirement nodejs@16.9.0 or above
- - Successfull run on nodejs@18.7.0

### Setup

Only if you are on `termux`, run below command first.
```
npm install sqlite3 --build-from-source --sqlite=~/../usr/bin/sqlite3
```
Now Start with  
```
npm install
```  

Create `.env` file  
```
TOKEN={bot token without parenthesis}
CLIENTID={application id without parenthesis}
GUILDID={testing server id without parenthesis}
```

#### Database Init
You can initialise database with below commands.
It will create the sqlite database with members table.

```
mkdir database
npm run dbInit
```

#### Deploying Commands
Start with deploying commands  
```
npm run deploy
```

It may take up to an hour to deploy these global commands.

If you want to use commands only in your test server, run below command instead.
```
npm run deploy test
```

### Start bot

```
npm run start
```

with `nodemon`  
```
npm run dev
```