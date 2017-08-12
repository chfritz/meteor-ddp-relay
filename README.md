Allows relaying a server-to-server DDP connection to a client.

![Figure](https://github.com/chfritz/meteor-ddp-relay/raw/master/ddp-relay-figure.png)

### Problem
App A's client would like to use collections of App B, but App A's client may not have network access to App B's server (red arrow in the figure).

### Solution
App A requests its server to establish a DDP connection to App B's server, and to relay a certain publication (green arrows). That's what this package facilitates.

### Documentation

#### Subscribing to publications

All you need to do as a user in Client A is to call the a Meteor method added by this package called "ddp-relay-subscribe". It gives you back the name of the publication it created on the server:

```js
// Makes a request to relay `request.publication` on `request.server`, using
// collection `request.collectionName`, providing `request.subscriptionArgs`
// when subscribing to the remote publication. Afterwards, you can subscribe
// to the synced collection like this:
Meteor.call("ddp-relay-subscribe", {
    publication: "items", // name of publication on App B's server
    server: "http://example.com:3000", // App B's server
    collectionName: "items",
    subscriptionArgs: [{color: "blue"}]
  }), (err, name) => {

  // Then subscribe as usual:
  const collection = new Mongo.Collection("items"); // request.collectionName
  Meteor.subscribe(name); // name is the name of the new publication (within App A)
}
```

#### Calling methods

You can also call methods on the other server:

```js
Meteor.call('ddp-relay-call', server, method, arg1, arg2, (err, result) => {
  console.log(`Calling method ${method} on server ${server} returned:`,
    '\nError:', err,
    '\nResult:', result);
});
```
