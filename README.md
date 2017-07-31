Allows relaying a server-to-server DDP connection to a client.

![Figure](https://github.com/chfritz/meteor-ddp-relay/raw/master/ddp-relay-figure.png)

### Problem
App A's client would like to use collections of App B, but App A's client may not have network access to App B's server (red arrow in the figure).

### Solution
App A requests its server to establish a DDP connection to App B's server, and to relay a certain publication (green arrows). That's what this package facilitates.

### Documentation

All you need to do as a user in Client A is to call the one Meteor method added by this package called "relay".

```js
Meteor.call("relay", request, callback);
```
Make request to relay `request.publication` on `request.server`, using collection `request.collectionName`. After calling this, you can subscribe to the synced collection using:
```js
const collection = new Mongo.Collection(request.collectionName);
Meteor.subscribe(request.server + "/" + request.publication);
```
