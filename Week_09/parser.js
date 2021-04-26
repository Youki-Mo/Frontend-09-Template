const css = require('css');
const EOF = Symbol('EOF');
const spaceReg = /^[\n\f\t ]$/;
const tagNameReg = /^[a-zA-Z]$/;


let currentToken = null;
let currentAttribute = null;
let currentTextNode = null;

let stack = [{ type: 'element', children: [] }];
let rules = [];

function addCSSRules(text) {
  var ast = css.parse(text);
  rules.push(...ast.stylesheet.rules);
}

function match(element, selector) {
  if (!selector || !element.attributes) {
    return false;
  }
  if (selector.charAt(0) === '#') {
    let attr = element.attributes.filter(attr => attr.name === 'id')[0];
    if (attr && attr.value === selector.replace('#', '')) {
      return true;
    } 
  } else if (selector.charAt(0) === '.') {
    let attr = element.attributes.filter(attr => attr.name === 'class')[0];
    if (attr && attr.value === selector.replace('.','')) {
      return true;
    }
  } else {
    if (element.tagName === selector) {
      return true;
    }
  }
  return false;
}

function specificity(selector) {
  var p = [0, 0, 0, 0];
  var selectorParts = selector.split(' ');
  for (let part of selectorParts) {
    if (part.charAt(0) === '#') {
      p[1] += 1;
    } else if (part.charAt(0) === '.') {
      p[2] += 1; 
    } else {
      p[3] += 1;
    }
  }
  return p;
}

function compare(sp1, sp2) {
  if (sp1[0] - sp2[0]) return sp1[0] - sp2[0];
  if (sp1[1] - sp2[1]) return sp1[1] - sp2[1];
  if (sp1[2] - sp2[2]) return sp1[2] - sp2[2];
  return sp1[3] - sp2[3];
}

function computerCSS(element) {
  var elements = stack.slice().reverse();
  if (!element.computedStyle) {
    element.computedStyle = {};
  }
  for (let rule of rules) {
    var selectorParts = rule.selectors[0].split(' ').reverse();
    if (!match(element, selectorParts[0])) {
      continue;
    }
    let matched = false;
    var j = 1;
    for (var i = 0; i < elements.length; i++) {
      if (match(elements[i], selectorParts[j])) {
        j++;
      }
    }
    if (j >= selectorParts.length) matched = true;
    if (matched) {
      var computedStyle = element.computedStyle;
      var sp = specificity(rule.selectors[0]);
      for (let declaration of rule.declarations) {
        if (!computedStyle[declaration.property]) {
          computedStyle[declaration.property] = {};
        }
        if (!computedStyle[declaration.property].specificity) {
          computedStyle[declaration.property].value = declaration.value;
          computedStyle[declaration.property].specificity = sp;
        } else if (compare(computedStyle[declaration.property].specificity, sp) < 0) {
          computedStyle[declaration.property].value = declaration.value;
          computedStyle[declaration.property].specificity = sp;
        }
      }
    }
  }
}

function emit(token) {
  const top = stack[stack.length - 1];
  if (token.type === 'startTag') {
    const element = {
      type: 'element',
      children: [],
      attributes: [],
      tagName: token.tagName
    };
    for (let p in token) {
      if (p !== 'tagName' && p !== 'type') {
        element.attributes.push({
          name: p,
          value: token[p]
        });
      }
    }
    computerCSS(element);

    top.children.push(element);
    element.parent = top;

    if (!token.isSelfClosing) stack.push(element);
    currentTextNode = null;
  } else if (token.type === 'endTag') {
    if (token.tagName !== top.tagName) {
      throw new Error('Tag start end doesn\'t match!');
    } else {
      // tagName === style 执行添加 CSS 规则的操作
      if (top.tagName === 'style') {
        addCSSRules(top.children[0].content);
      }
      stack.pop();
    }
    currentTextNode = null;
  } else if (token.type === 'text') {
    if (currentTextNode === null) {
      currentTextNode = {
        type: 'text',
        content: ''
      }
      top.children.push(currentTextNode);
    }
    currentTextNode.content += token.content;
  }
}

function data(c) {
  if (c === '<') {
    return tagOpen;
  } else if (c === EOF) {
    emit({ type: 'EOF' });
    return;
  }
  emit({ type: 'text', content: c });
  return data;
}

function tagOpen(c) {
  if (c === '/') {
    return endTagOpen;
  } else if (c.match(tagNameReg)) {
    currentToken = {
      type: 'startTag',
      tagName: ''
    };
    return tagName(c);
  }
  return;
}

function endTagOpen(c) {
  if (c.match(tagNameReg)) {
    currentToken = {
      type: 'endTag',
      tagName: ''
    };
    return tagName(c);
  } else if (c === '>') {
    console.error('endTagOpen', '>')
  } else if (c === EOF) {
    console.error('endTagOpen', 'EOF')
  }
}

function tagName(c) {
  if (c.match(spaceReg)) {
    return beforeAttributeName;
  } else if (c.match(tagNameReg)) {
    currentToken.tagName += c;
    return tagName;
  } else if (c === '/') {
    return selfClosingStartTag;
  } else if (c === '>') {
    emit(currentToken)
    return data;
  }
  return tagName;
}

function beforeAttributeName(c) {
  if (c.match(spaceReg)) {
    return beforeAttributeName;
  } else if (c === '>' || c === '/' || c === EOF) {
    return afterAttributeName(c);
  } else if (c === '=') {
    console.error('beforeAttributeName', '=')
  }
  currentAttribute = {
    name: '',
    value: ''
  }
  return attributeName(c);
}

function selfClosingStartTag(c) {
  if (c === '>') {
    currentToken.isSelfClosing = true;
    return data;
  } else if (c === EOF) {
    console.error('selfClosingStartTag', 'EOF')
  }
  console.error('selfClosingStartTag')
}

function attributeName(c) {
  if (c.match(spaceReg) || c === '/' || c === '>' || c === EOF) {
    return afterAttributeName(c);
  } else if (c === '=') {
    return beforeAttributeValue;
  } else if (c === '\u0000') {

  } else if (c === '"' || c === '\'' || c === '<') {

  }
  currentAttribute.name += c;
  return attributeName;
}

function afterAttributeName(c) {
  if (c.match(spaceReg)) {
    return afterAttributeName;
  } else if (c === '/') {
    return selfClosingStartTag;
  } else if (c === '=') {
    return beforeAttributeValue;
  } else if (c === '>') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else if (c === EOF) {

  }
  currentToken[currentAttribute.name] = currentAttribute.value;
  currentAttribute = {
    name: '',
    value: ''
  }
  return attributeName(c);
}

function beforeAttributeValue(c) {
  if (c.match(spaceReg) || c === '/' || c === '>' || c === EOF) {
    return beforeAttributeValue;
  } else if (c === '"') {
    return doubleQuotedAttributeValue;
  } else if (c === '\'') {
    return singleQuotedAttributeValue;
  } else if (c === '>') {

  }
  return unquotedAttributeValue(c);
}

function doubleQuotedAttributeValue(c) {
  if (c === '"') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return afterAttributeName;
  } else if (c === '\u0000') {

  } else if (c === EOF) {

  }
  currentAttribute.value += c;
  return doubleQuotedAttributeValue;
}

function singleQuotedAttributeValue(c) {
  if (c === '\'') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return afterAttributeName;
  } else if (c === '\u0000') {

  } else if (c === EOF) {

  }
  currentAttribute.value += c;
  return singleQuotedAttributeValue;
}

function unquotedAttributeValue(c) {
  if (c.match(spaceReg)) {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return beforeAttributeName;
  } else if (c === '/') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return selfClosingStartTag;
  } else if (c === '>') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else if (c === '\u0000') {

  } else if (c === '"' || c === '\'' || c === '<' || c === '=' || c === '`') {

  } else if (c === EOF) {

  }
  currentAttribute.value += c;
  return unquotedAttributeValue;
}

module.exports.parserHTML = function parserHTML(html) {
  let state = data;
  for (let c of html) {
    state = state(c);
  }
  state = state(EOF);
  return stack[0];
}