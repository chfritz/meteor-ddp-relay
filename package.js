Package.describe({
  name: 'chfritz:ddp-relay',
  version: '0.0.2',
  summary: 'Relay a DDP connection from a server to our clients',
  git: 'https://github.com/chfritz/meteor-ddp-relay',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.4.1');
  api.use('ecmascript');
  api.mainModule('ddp-relay.js', 'server');
});
