# ain-storage

## Usage

### Set-up

you can choose what type of storage to use in your code. Currently ain-storage supports local and firebase storage.
- `adapter`
  - `provider` : type of storage to use
  - `path` : designated path in the storage

**Local storage**
```js
const config = {
    adapter: {
      provider: 'local',
      path: process.cwd(),
    }
}
const adapterClient = adapter_interface.create(config)
```

**Firebase storage**

```js
const config = {
  adapter: {
    provider: 'firebase',
    path: 'trainModel/test',
  },
}

const firebase_config = require('<path_to_your_firebase_config>')
config = Object.assign({}, config, firebase_config)
const adapterClient = require('./adapter_interface').create(config)

```


**Firebase configuration** ([firebase docs](https://firebase.google.com/docs/web/setup#config-object))
- `apiKey`
- `authDomain`
- `databaseURL`
- `projectId`
- `storageBucket`
- `messagingSenderId`
- `appId`
- `measurementId`
- `appName` - (optional) to specify name for this app, otherwise the same as appId

### Upload a file to Storage

**parameters**
- `file` - File or blob object to be uploaded
- `options`
  - `path` -  relative path for a file to be uploaded
  - `fileName` - file name to be designated
  - `dispatch` - (optional) function to dispatch events during this process
  - `dispatchType` - (optional) type defining progress of uploading a file
  - `afterUploaded` - (optional) async function to execute when uploading is done
```js
adapterClient.upload(file, options)
```

### Download a file from Storage

**parameters**
- `storagePath` - relative path for a file to be downloaded
- `options`
  - `destPath` - local path to be downloaded
```js
adapterClient.download(storagePath, options)
```


## Unit Testing
For testing with firebase, You need to set up configurations for firebase in test/private/firebase_config.js


