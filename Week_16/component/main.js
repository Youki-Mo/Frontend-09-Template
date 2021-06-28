
import { createElement } from './framework.js';
import { Carousel } from './carousel';
import { Button } from './button'
import { List } from './list'

let images = [
  {
    src: 'https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg',
    url: 'https://time.geekbang.org',
    title: 'xx1'
  },
  {
    src: 'https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg',
    url: 'https://time.geekbang.org',
    title: 'xx2'
  },
  {
    src: 'https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg',
    url: 'https://time.geekbang.org',
    title: 'xx3'
  },
  {
    src: 'https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg',
    url: 'https://time.geekbang.org',
    title: 'xx4'
  }
];

// let dom = <Carousel src={images} onChange={event => console.log(event.detail.position)} onClick={event => window.location.href = event.detail.data.url} />;

// let dom = <Button>123</Button>

let dom = <List data={images}>
{
    (v) => (
        <div>
            <img src={v.src} alt=""/>
            <a href={v.url}>{v.title}</a>
        </div>
    )
}
</List>;

dom.mountTo(document.body);
