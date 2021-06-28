export class Dispatcher {
  constructor(element) {
    this.element = element;
  }
  dispatch(type, properties) {
    let event = new Event(type);
    for (let name in properties) {
      event[name] = properties[name];
    }
    this.element.dispatchEvent(event);
  }
}

export class Recognizer {
  constructor(dispatcher) {
    this.dispatcher = dispatcher;
  }

  initialise(point, context) {
    context.startX = point.clientX;
    context.startY = point.clientY;

    this.dispatcher.dispatch('start', {
      clientX: point.clientX,
      clientY: point.clientY
    });

    context.points = [{
      t: Date.now(),
      x: point.clientX,
      y: point.clientY
    }];
    context.isTap = true;
    context.isPan = false;
    context.isPress = false;
    context.isFlick = false;
    context.isVertical = undefined;
    context.distance = 0;
    context.velocity = 0;
  }

  start(point, context) {
    this.initialise(point, context);
    context.handler = setTimeout(() => {
      context.isTap = false;
      context.isPan = false;
      context.isPress = true;
      context.isFlick = false;
      context.handler = null;
      this.dispatcher.dispatch('press', {});
    }, 500);
  }

  move(point, context) {
    let dx = point.clientX - context.startX, dy = point.clientY - context.startY;
    if (!context.isPan && dx ** 2 + dy ** 2 > 100) {
      context.isPan = true;
      context.isTap = false;
      context.isPress = false;
      context.isVertical = Math.abs(dx) < Math.abs(dy);
      this.dispatcher.dispatch('pan-start', {
        clientX: point.clientX,
        clientY: point.clientY,
        startX: context.startX,
        startY: context.startY,
        endX: point.clientX,
        endY: point.clientY,
        isVertical: context.isVertical
      });
      clearTimeout(context.handler);
    }

    if (context.isPan) {
      context.points.push({
        t: Date.now(),
        x: point.clientX,
        y: point.clientY
      });
      this.dispatcher.dispatch('pan', {
        clientX: point.clientX,
        clientY: point.clientY,
        startX: context.startX,
        startY: context.startY,
        endX: point.clientX,
        endY: point.clientY,
        isVertical: context.isVertical
      });
    }

    clearTimeout(context.handler);
  }

  end(point, context) {
    if (context.isTap) {
      this.dispatcher.dispatch('tap', {
        clientX: point.clientX,
        clientY: point.clientY,
      });
    }

    if (context.isPress) {
      this.dispatcher.dispatch('press-end', {
        clientX: point.clientX,
        clientY: point.clientY,
      });
    }
    let velocity;
    {
      let distance;
      context.points = context.points.filter(p => Date.now() - p.t < 500);

      if (!context.points.length) {
        distance = 0;
        velocity = 0;
      } else {
        distance = Math.sqrt((point.clientX - context.points[0].x) ** 2 +
          (point.clientY - context.points[0].y) ** 2);
        velocity = distance / (Date.now() - context.points[0].t);
      }

      if (velocity > 1.5) {
        context.isFlick = true;
        this.dispatcher.dispatch('pan-end', {
          clientX: point.clientX,
          clientY: point.clientY,
          startX: context.startX,
          startY: context.startY,
          endX: point.clientX,
          endY: point.clientY,
          isVertical: context.isVertical,
          isFlick: context.isFlick,
          distance: distance,
          velocity: velocity
        });
      } else {
        context.isFlick = false;
      }
    }

    if (context.isPan) {
      this.dispatcher.dispatch('pan-end', {
        clientX: point.clientX,
        clientY: point.clientY,
        startX: context.startX,
        startY: context.startY,
        endX: point.clientX,
        endY: point.clientY,
        isVertical: context.isVertical,
        isFlick: context.isFlick,
        velocity: velocity
      });
    }

    this.dispatcher.dispatch('end', {
      clientX: point.clientX,
      clientY: point.clientY,
      startX: context.startX,
      startY: context.startY,
      isVertical: context.isVertical,
      isFlick: context.isFlick,
      velocity: velocity
    })
  }

  cancel(point, context) {
    this.dispatcher.dispatch('cancel', {});
    clearTimeout(context.handler);
  }
}

export class Listener {
  constructor(element, recognizer) {
    let contexts = new Map();
    let isListeningMouse = false;

    element.addEventListener('mousedown', event => {
      let context = Object.create(null);
      contexts.set('mouse' + (1 << event.button), context);
      recognizer.start(event, context);

      let mousemove = event => {
        let button = 1;

        while (button <= event.buttons) {
          if (button & event.buttons) {
            // order of buttons & button property is not same
            let key = button;
            if (button === 2) {
              key = 4;
            } else if (button === 4) {
              key = 2;
            }
            let context = contexts.get('mouse' + key);
            recognizer.move(event, context);
          }
          button = button << 1;
        }
      }

      let mouseup = event => {
        let context = contexts.get('mouse' + (1 << event.button));
        recognizer.end(event, context);
        contexts.delete('mouse' + (1 << event.button));

        if (event.buttons === 0) {
          document.removeEventListener('mousemove', mousemove);
          document.removeEventListener('mouseup', mouseup);
          isListeningMouse = false;
        }
      }

      if (!isListeningMouse) {
        document.addEventListener('mousemove', mousemove);
        document.addEventListener('mouseup', mouseup);
        isListeningMouse = true;
      }
    });
    element.addEventListener('touchstart', event => {
      for (let touch of event.changedTouches) {
        let context = Object.create(null);
        contexts.set(touch.identifier, context);
        recognizer.start(touch, context);
      }
    });
    element.addEventListener('touchmove', event => {
      for (let touch of event.changedTouches) {
        let context = contexts.get(touch.identifier);
        recognizer.move(touch, context);
      }
    });
    element.addEventListener('touchend', event => {
      for (let touch of event.changedTouches) {
        let context = contexts.get(touch.identifier);
        recognizer.end(touch, context);
        contexts.delete(touch.identifier);
      }
    });
    element.addEventListener('touchcancel', event => {
      for (let touch of event.changedTouches) {
        let context = contexts.get(touch.identifier);
        recognizer.cancel(touch, context);
      }
    });
  }
}

export function enableGesture(element) {
  new Listener(element, new Recognizer(new Dispatcher(element)));
}