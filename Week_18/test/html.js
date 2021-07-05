var assert = require('assert');

import { parserHTML } from '../html/parser';

describe('parse html:', function() {
  it ('<a></a>', function() {
    let tree = parserHTML('<a></a>')
    assert.equal(tree.children[0].tagName, 'a');
    assert.equal(tree.children[0].children.length, 0);
  })
  it ('<a />', function() {
    let tree = parserHTML('<a />')
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].children.length, 0);
  })
  it ('<a/>', function() {
    let tree = parserHTML('<a/>')
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].children.length, 0);
  })
  it ('<>', function() {
    let tree = parserHTML('<>')
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].type, 'text');
  })
  it ('<a href="#"></a>', function() {
    let tree = parserHTML('<a href="#"></a>')
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].children.length, 0);
  })
  it ('<a href=\'#\'></a>', function() {
    let tree = parserHTML('<a href=\'#\'></a>')
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].children.length, 0);
  })
  it ('<a href=#></a>', function() {
    let tree = parserHTML('<a href=#></a>')
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].children.length, 0);
  })
  it ('<a href></a>', function() {
    let tree = parserHTML('<a href></a>')
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].children.length, 0);
  })
  it ('<a href id></a>', function() {
    let tree = parserHTML('<a href id></a>')
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].children.length, 0);
  })
  it ('<a href=# />', function() {
    let tree = parserHTML('<a href=# />')
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].children.length, 0);
  })
  it ('<a  href=# />', function() {
    let tree = parserHTML('<a  href=# />')
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].children.length, 0);
  })
  it ('</>', function() {
    let tree = parserHTML('</>')
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].type, 'text');
  })
  it ('css selector', function() {
    let tree = parserHTML(`<html>
<style>
.a {
  width: 100px;
}
#a {
  height: 50px;
}
a {
  background-color: #333;
}
a#a {
  height: 40px;
}
</style>
<a class="a" id="a" href="#"></a>
</html>`)
    assert.equal(tree.children.length, 1);
    assert.equal(typeof tree.children[0].children.find(v => v.tagName === 'a').computedStyle, 'object');
    assert.equal(typeof tree.children[0].children.find(v => v.tagName === 'a').computedStyle.width, 'object');
    assert.equal(tree.children[0].children.find(v => v.tagName === 'a').computedStyle.width.value, '100px');
  })
})