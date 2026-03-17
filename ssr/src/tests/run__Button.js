const { test__Button } = require('./Button');
const { createRoot } = require('react-dom/client');
const React = require('react');

const _c = require('../../../src/components/Button');
const Component = _c.default ?? _c;
const element = React.createElement(Component, null);

const result = test__Button(element);
console.log('[test__Button]', result);

createRoot(document.getElementById('root')).render(element);
