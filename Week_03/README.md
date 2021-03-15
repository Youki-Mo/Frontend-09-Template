# 使用LL算法构建AST（抽象语法树）
在计算机分析过程中，先会把编程语言分词，接着会把分好的词构建成层层嵌套的树形结构，再之后再解析代码执行。

构建AST的过程被称为语法分析，最著名的语法分析算法核心的算法有两种（LL算法、LR算法），本周课程提到的是LL算法（Left Left算法，一种从左到右扫描，从左到右归并的算法）。

## 案例：四则运算分析
词法定义：
```
TokenNumber：1 2 3 4 5 6 7 8 9 0 的组合
Operator：\+ 、\- 、\* 、/ 之一
Whitespace：\<SP>
LineTerminator: \<LF> \<CR>
```
语法定义：
```
<Expression>::=
  <AdditiveExpression><EOF>

<AdditiveExpression>::=
  <MultiplicativeExpression>
  |<AdditiveExpression><+><MultiplicativeExpression>
  |<AdditiveExpression><-><MultiplicativeExpression>

<MultiplicativeExpression>::=
  <Number>
  |<MultiplicativeExpression><*><Number>
  |<MultiplicativeExpression></><Number>
```

## 技巧
* 正则表达式通过()|()加exec()可以分别匹配设置匹配内容别名

## 笔记
* es6的yield关键字，类似return，暂停或恢复代码运行