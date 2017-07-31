const collections = {};

Meteor.methods({
    /** request to relay request.publication on request.server, using collection
      request.collectionName.

      After calling this, you can subscribe to the synced collection using:

      const collection = new Mongo.Collection(request.collectionName);
      Meteor.subscribe(request.server + "/" + request.publication);
    */
    relay(request) {
      const name = request.server + ":" + request.publication;
      if (!collections[name]) {
        const server = DDP.connect(request.server);
        server.subscribe(request.publication);
        collections[name] =
          new Mongo.Collection(request.collectionName, { connection: server });

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

        return name;
      } else {
        console.log("relay", name, "is already defined; ignoring request.");
      }
    }
  });
