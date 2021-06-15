import { Timeline, Animation } from './animation.js';
import * as a from './ease.js';

let tl = new Timeline();

tl.add(new Animation(document.querySelector('#el').style, 'transform', 0, 500, 2000, 0, a.ease, v => `translateX(${v}px)`));
tl.start();

document.querySelector('#el2').style.transition = '2s ease-in';
document.querySelector('#el2').style.transform = 'translateX(500px)';

document.querySelector('#pause-btn').addEventListener('click', () => tl.pause());
document.querySelector('#resume-btn').addEventListener('click', () => tl.resume());