
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