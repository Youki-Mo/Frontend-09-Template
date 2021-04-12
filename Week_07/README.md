# 学习笔记

## 运算符和表达式
* Member
  * a.b
  * a[b]
  * foo`string`
  * super.b
  * super['b']
  * new.target
  * new Foo()
* Reference
  * Object
  * Key
  * delete
  * assign
* Expression
  * Call
    * foo()
    * super()
    * foo()['b']
    * foo().b
    * foo()`abc`
  * Left Handside & Right Handside
  * Update
    * a++
    * a--
    * --a
    * ++a
  * Unary
    * delete a.b
    * void foo()
    * typeof a
    * +a
    * -a
    * ~a
    * !a
    * await a
  * Exponental
    * \**
  * Multiplicative
    * 乘(*)除(/)
  * Additive
    * 加(+)减(-)
  * Shift
    * <<
    * \>>
    * \>>>
  * Relationship
    * <
    * \>
    * <=
    * \>=
    * instanceof
    * in
  * Equality
    * == 
    * !=
    * ===
    * !==
  * Bitwise
    * &
    * ^
    * |
  * Logical
    * &&
    * ||
  * Conditional
    * ? :

## 类型转换
|  | Number | String | Boolean | Undefined | Null | Object | Symbol |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Number | - |  | 0 false | X | X | Boxing | X |
| String |  | - | "" false | X | X | Boxing | X |
| Boolean | true 1 <br> false 0 | 'true' <br> 'false' | - | X | X | Boxing | X |
| Undefined | NaN | "Undefined" | false | - | X | X | X |
| Null | 0 | 'null' | false | X | - | X | X |
| Object | valueOf | valueOf <br> toString | true | X | X | - | X |
| Symbol | X | X | X | X | X | Boxing | - |

### Unboxing
* ToPremitive
* toString vs valueOf
* Symbol.toPremitive

### Boxing
| 类型 | 对象 | 值 |
| --- | --- | --- |
| Number | new Number(1) | 1 |
| String | new String("a") | "a" |
| Boolean | new Boolean(true) | true |
| Symbol | new Object(Symbol("a")) | Symbol("a") |

### Exercise
```
function StringToNumber(str) {
  return Number(str);
}

function NumberToString(num) {
  return num.toString();
}
```
## 运行时相关概念
### Completion Record
* [[type]]: normal, break, continue, return, or throw
* [[value]]: 基本类型
* [[target]]: label

## 简单语句和复合语句
### 简单语句
* 表达式语句（ExpressionStatement） 加分号
* 空语句（EmptyStatement） 单独行一个分号
* debugger语句（DebuggerStatement）断点作用
* 控制语句
  * ThrowStatement 抛出异常
  * ContinueStatement 循环中结束当次循环
  * BreakStatement 结束跳出循环
  * ReturnStatement 函数中返回值使用
### 复合语句
* BlockStatement
* IfStatement
* SwitchStatement
* IterationStatement
* WithStatement
* LabelledStatement
* TryStatement

## 声明
* FunctionDeclaration
  * function
* GeneratorDeclaration
  * function *
* AsyncFunctionDeclaration
  * async function
* AsyncGeneratorDeclaration
  * async function *
* VariableStatement
  * var
* ClassDeclaration
  * class
* LexicalDeclaration
  * const
  * let
### 预处理
### 作用域

## 宏任务与微任务
### JS执行粒度（运行时）
* 宏任务
* 微任务（Promise）
* 函数调用（Execution Context）
* 语句/声明（Completion Record）
* 表达式（Reference）
* 直接量/变量/this等等... 
```
// 宏任务
let x = 1;
const p = new Promise(resolve => resolve());
p.then(() => {
  // 微任务
  x = 2;
})
x = 3;
```