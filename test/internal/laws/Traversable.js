'use strict';

var jsc = require('jsverify');
var Z = require('sanctuary-type-classes');

var S = require('../sanctuary');

var Compose = require('../Compose');


function naturality(F, G, t, u) {
  var lhs = t(Z.traverse(function(x) { return Z.of(F, x); }, S.I, u));
  var rhs = Z.traverse(function(x) { return Z.of(G, x); }, t, u);
  return Z.equals(lhs, rhs);
}

function identity(F, u) {
  var lhs = Z.traverse(function(x) { return Z.of(F, x); }, function(x) { return Z.of(F, x); }, u);
  var rhs = Z.of(F, u);
  return Z.equals(lhs, rhs);
}

function composition(F, G, u) {
  var C = Compose(F)(G);
  var lhs = Z.traverse(function(x) { return Z.of(C, x); }, C, u);
  var rhs = C(Z.map(function(x) { return Z.traverse(function(x) { return Z.of(G, x); }, S.I, x); }, Z.traverse(function(x) { return Z.of(F, x); }, S.I, u)));
  return Z.equals(lhs, rhs);
}

exports.naturality = function(F, G, t, u) {
  test('Traversable naturality', function() {
    jsc.assert(jsc.forall(F, G, t, u, naturality));
  });
};

exports.identity = function(F, u) {
  test('Traversable identity', function() {
    jsc.assert(jsc.forall(F, u, identity));
  });
};

exports.composition = function(F, G, u) {
  test('Traversable composition', function() {
    jsc.assert(jsc.forall(F, G, u, composition));
  });
};