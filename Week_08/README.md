# 学习笔记
## 浏览器工作原理总论
1. 根据URL通过HTTP请求得到HTML（URL → HTTP → HTML）
2. 对HTML进行解析得到DOM树（HTML → parse → DOM）
3. 对CSS进行计算，得到一颗带样式的DOM树（DOM → CSS compuing → DOM with CSS）
4. 对DOM进行布局（DOM with CSS → layout → DOM with position）
5. 对DOM进行渲染（DOM with position → render → Bitmap）
5. 最终得到一张Bitmap
