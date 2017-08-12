
/// synced collections
const collections = {};

/// connection pool
const connections = {};

Meteor.methods({
    /** request to relay request.publication on request.server, using collection
      request.collectionName, providing request.subscriptionArgs (array) when
      subscribing to the remote publication. The array request.subscriptionArgs
      will be spread using the spread operator ("...") when subscribing.

      After calling this, you can subscribe to the synced collection using:

      const collection = new Mongo.Collection(request.collectionName);
      Meteor.subscribe(request.server + "/" + request.publication);

      The method pools connections, so if more than one ddp-relay request is
      sent for the same server, the existing connection is reused.
    */
    "ddp-relay"(request) {
      const name = request.server + ":" + request.publication;
      if (!collections[name]) {
        if (!connections[request.server]) {
          connections[request.server] = DDP.connect(request.server);
        }
        request.subscriptionArgs = request.subscriptionArgs || [];
        connections[request.server].subscribe(
          request.publication, ...request.subscriptionArgs);
        collections[name] =
          new Mongo.Collection(request.collectionName, {
              connection: connections[request.server] });

        // relay the publication
        Meteor.publish(name, (query) => {
            if (query) {
              return collections[name].find(query);
            } else {
              return collections[name].find();
            }
          });

        // relay the collection methods
        const methods = _.map(['insert', 'upsert', 'update', 'remove'],
          (op) => {
            return function(...args) {
              collections[name][op](...args);
            };
          });
        Meteor.methods(methods);

      } else {
        console.log("relay", name, "is already defined; ignoring request.");
      }
      return name;
    }
  });
