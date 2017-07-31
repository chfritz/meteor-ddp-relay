Allows relaying a server-to-server DDP connection to a client.

### Problem
App A's client would like to use collections of App B, but App A's client may not have network access to App B's server.

### Solution
App A requests its server to establish a DDP connection to App B's server, and to relay a certain publication. That's what this package facilitates.

### Documentation

All the package does is add one Meteor method called "relay".

```js
Meteor.call("relay", request, callback);
```
Make request to relay `request.publication` on `request.server`, using collection `request.collectionName`. After calling this, you can subscribe to the synced collection using:
```js
const collection = new Mongo.Collection(request.collectionName);
Meteor.subscribe(request.server + "/" + request.publication);
```
