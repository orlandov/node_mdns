#!/usr/bin/env node
var mdns   = require('../../lib/mdns'),
    util   = require('util'),
    assert = require('assert');

var ad =  mdns.createAdvertisement(["node-mdns-test", 'a', 'b'], 4321, function(err, info, flags) {
  if (err) {
    assert.fail(err)
  } else {
    assert.equal(info['regtype'], '_node-mdns-test._tcp.');
    //util.puts('Advertising', util.inspect(info));
  }
});
var browser = mdns.createBrowser(["node-mdns-test", 'b'], 'tcp');

timeout_id = setTimeout(function() { assert.fail('time out'); }, 10000);

browser.on('serviceUp', function(info) {
  //util.puts('Up', util.inspect(info));
  assert.equal('_node-mdns-test._tcp.', info['regtype']);
  assert.equal(4321, info['port']);
  ad.stop();
});

browser.on('serviceDown', function(info) {
  //util.puts('Down', util.inspect(info));
  assert.equal('_node-mdns-test._tcp.', info['regtype']);
  browser.stop();
  clearTimeout(timeout_id);
});

browser.start();
ad.start();

//==============================================================================

assert.throws(function() { mdns.createAdvertisement()});
assert.throws(function() { mdns.createAdvertisement('narf')});
assert.throws(function() { mdns.createAdvertisement(function(){})});
assert.throws(function() { mdns.createAdvertisement('narf', function(){})});

var test_ad = mdns.createAdvertisement('node-mdns-test', 4321);
test_ad.start();
assert.throws(function() { test_ad.start()});
test_ad.stop();

