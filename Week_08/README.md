# 浏览器工作原理总论
1. 根据URL通过HTTP请求得到HTML（URL → HTTP → HTML）
2. 对HTML进行解析得到DOM树（HTML → parse → DOM）
3. 对CSS进行计算，得到一颗带样式的DOM树（DOM → CSS compuing → DOM with CSS）
4. 对DOM进行布局（DOM with CSS → layout → DOM with position）
5. 对DOM进行渲染（DOM with position → render → Bitmap）
5. 最终得到一张Bitmap


# HTTP请求
## HTTP解析
* ISO-OSI七层网络模型
  <table>
    <tr>
      <td>应用</td>
      <td rowspan="3">HTTP</td>
      <td rowspan="3">require('http')</td>
    </tr>
    <tr>
      <td>表示</td>
    </tr>
    <tr>
      <td>会话</td>
    </tr>
    <tr>
      <td>传输</td>
      <td>TCP</td>
      <td>require('net')</td>
    </tr>
    <tr>
      <td>网络</td>
      <td>Internet</td>
      <td></td>
    </tr>
    <tr>
      <td>数据链路</td>
      <td rowspan="2">4G/5G/Wi-Fi</td>
      <td></td>
    </tr>
    <tr>
      <td>物理层</td>
      <td></td>
    </tr>
  </table>
* TCP与IP的一些基础知识
  * TCP：require('net')、端口、流
  * IP：libnet/libpcap、IP地址、包
* HTTP：由Request和Response组成
