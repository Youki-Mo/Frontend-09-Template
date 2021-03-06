# HTML解析
### parse模块的文件拆分
* 为了方便文件管理，把parser单独拆到文件中
* parserHTML接收HTML文本作为参数返回DOM树

### 用FSM实现HTML的分析
* HTML标准中已规定HTML状态
* 通过FSM完成挑选出来的一部分HTML状态

### 解析标签
* 标签分类
  * 开始标签
  * 结束标签
  * 自封闭标签
* 标签属性（待解析）

### 创建元素
* 在状态机中，除了状态迁移，我们还可以加入相关处理逻辑
* 在标签结束状态时提交标签token

### 处理属性
* 属性有三种写法，需要分别处理
  * 双引号 xxx="dd"
  * 单引号 xxx='dd'
  * 无引号 xxx=dd

### 用token构建DOM树
* 从标签构建DOM树的基本技巧就是使用栈
* 遇到开始标签创建元素入栈，遇到结束标签出栈
* 自封闭节点可视为入栈后立即出栈
* 任何元素的父元素是他入栈前的栈顶

### 将文本节点加到DOM树
* 多个文本节点需要合并

# CSS计算
### 收集CSS规则
* 判定tagName=style开始收集CSS规则

### 添加调用
* 创建元素后立即计算CSS

### 获取父元素序列
* 在computeCSS函数中，我们必须知道元素的所有父元素才能判断元素与规则是否匹配
* 由于首先获得的是当前元素，向外层结构追溯即可获得所有父元素

### 选择器与元素匹配
* 选择器也要从当前元素向外排列
* 复杂选择器拆成针对单个元素的选择器，用循环匹配父元素队列

### 生成computed属性
* 一旦选择匹配，就应用选择器到元素上，形成computeStyle

### CSS优先级计算
* 原则
1. 原则一：继承不如指定
2. 原则二：#id > .class > 标签选择符
3. 原则三：越具体越强大
4. 原则四：标签#id > #id ; 标签.class > .class

* CSS优先级权重计算法

  CSS优先级包含四个级别（标签内选择符，ID选择符，Class选择符，元素选择符）以及各级别出现的次数，根据这四个级别出现的次数计算得到CSS优先级，CSS优先级的计算规则如下
  * 元素标签中定义的样式（Style属性），加1,0,0,0
  * 每个ID选择符（如#id），加0,1,0,0
  * 每个Class选择符（如.class），加0,0,1,0
  * 每个元素选择符（如p）或者伪元素选择符（如:first-child）等，加0,0,0,1

  然后，将这四个数字分别累加，就得到每个CSS定义的优先级的值
  然后从左到右逐位比较大小，数字大的CSS样式优先级就高

  例子：
CSS文件或者\<style>中如下定义：
  ```
  1. h1 { color: red; }
  /* 一个元素选择符，结果是0,0,0,1 */
  2. body h1 { color: red; }
  /* 两个元素选择符，结果是0,0,0,2 */
  3. h2.grape { color: green }
  /* 一个元素选择符，一个Class选择符，结果是0,0,1,1 */
  4. li#answer { color: gray }
  /* 一个元素选择符，一个ID选择符，结果是0,1,0,1 */
  5. <h1 style="color: blue"></h1>
  /* 元素标签中定义，结果是1,0,0,0 */
  ```

  如此一来，h1元素的颜色是蓝色

  注意：
  1. !important声明的样式优先级最高，如果冲突再进行如上计算
  2. 如果优先级相同，则选择最后出现的样式
  3. 继承得到的样式优先级最低