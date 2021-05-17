
## CSS总体结构
* CSS
  * AT-Rules
  * Rule

## CSS@规则（AT-Rules）的研究
* @charset：[https://www.w3.org/TR/css-syntax-3/](https://www.w3.org/TR/css-syntax-3/)
* @import:[https://www.w3.org/TR/css-cascade-4/](//www.w3.org/TR/css-cascade-4/)
* @media：[https://www.w3.org/TR/css-conditional/](https://www.w3.org/TR/css-conditional/)
* @page：[https://www.w3.org/TR/css-page-3/](https://www.w3.org/TR/css-page-3/)
* @counter-style：[https://www.w3.org/TR/css-counter-styles-3/](https://www.w3.org/TR/css-counter-styles-3/)
* @keyframes：[https://www.w3.org/TR/css-animations-1/](https://www.w3.org/TR/css-animations-1/)
* @fontface：[https://www.w3.org/TR/css-fonts-3/](https://www.w3.org/TR/css-fonts-3/)
* @supports：[https://www.w3.org/TR/css-conditional/](https://www.w3.org/TR/css-conditional/)
* @namespace：[https://www.w3.org/TR/css-namespaces-3/](https://www.w3.org/TR/css-namespaces-3/)

## CSS规则（Rule）的研究
* 选择器（Selector）[https://www.w3.org/TR/selectors-3/](https://www.w3.org/TR/selectors-3/)[https://www.w3.org/TR/selectors-4/](https://www.w3.org/TR/selectors-4/)
  * selector_group
  * selector
    * 大于号( > )
    * 空格(\<sp>)
    * 加号( \+ )
    * 减号( \- )
  * simple_selector
    * 类型(type)
    * 通配符( * )
    * 类选择器( . )
    * ID选择器( # )
    * 属性选择器([])
    * 伪类选择器( : )
    * 伪元素选择器( :: )
    * 排除选择器(:not())
* 声明（例：selector { background-color: blue; }）
  * Key
    * Properties
    * Variables：[https://www.w3.org/TR/css-variables/](https://www.w3.org/TR/css-variables/)
  * Value[https://www.w3.org/TR/css-values-4/](https://www.w3.org/TR/css-values-4/)
    * calc
    * number
    * length
    * ......

## 收集标准
详见 [css_crawler.js](./css_crawler.js) 文件

## 选择器语法
* 简单选择器
  * \*
  * div svg|a
  * .cls
  * #id
  * [attr=value]
  * :hover
  * ::before
* 复合选择器
  * <简单选择器><简单选择器><简单选择器>
  * * 或 div 必须写在最前面，伪类或者伪元素必须写在最后面
* 复杂选择器
  * 子孙选择器：<复合选择器><sp><复合选择器>
  * 直接父子选择器：<复合选择器>">"<复合选择器>
  * 兄弟选择器<复合选择器>("~"|"+")<复合选择器>
  * 表格的列选择器<复合选择器>"||"<复合选择器>

## 选择器的优先级
* 优先级计算公式：S=Num(标签内样式) * N<sup>3</sup> + Num(ID选择器) * N<sup>2</sup> + Num(类选择器) * N<sup>1</sup> + Num(标签选择器)
* 练习

  ```
  let n = 10000;

  function computed(x1, x2, x3, x4) {
    let s = x1 * n**3 + x2 * n**2 + x3 * n + x4;
    console.log(s);
    return s;
  }

  // div#a.b .c[id=x] 0 1 3 1
  computed(0, 1, 3, 1) // 100030001

  // #a:not(#b) 0 2 0 0
  computed(0, 2, 0, 0) // 200000000

  // *.a 0 0 1 0
  computed(0, 0, 1, 0) // 10000

  // div.a 0 0 1 1
  computed(0, 0, 1, 1) // 10001
  ```

## 选择