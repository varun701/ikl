# Commands

Command files are to be placed in `./commands` folder.
Import command and export in `commmandsList`, array in `utils/commands.js` file.

## Structure

Command structure is *not tested* during runtime.
Invalid command structure may cause error or broken command.

```javascript
// Data Object must contain 'name' property and may consist other details if needed.
const data = {
  name: 'Command Name',
}
const execute = interaction => {}
const builder = {}

// Optional setup function is executed once, before login.
const setup = (client) => { return }

// Command file exports default object.
export default {
  data,
  execute,
  builder,
}
```

## Deployment

Commands are deployed through running npm script  
`npm run deploy`

If you want to deploy commands in test server  
`npm run deploy test`
