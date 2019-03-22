
/* This makes the DOM button */
class Button {
    /* This function generates the test button. */
    constructor(name) {
        this.name = name;
        this.button = createButton(this.name);
        this.button.position(10, 10);
        this.button.size(150, 40);
        this.button.mouseOver(() => this.buttonReaction());
        this.button.mouseOut(() => this.buttonReaction());
        this.button.mousePressed(() => this.buttonReaction());
        this.button.mouseReleased(() => this.buttonReaction());
        this.event;
    }

    /* This is a handler for the button. */
    buttonReaction() {
        switch (event.type) {
            case 'mouseup':
                document.dispatchEvent(this.event);
                break;
            default:
                // console.log(event);
                break;
        }
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
        this.button.position(x, y);
    }

    setSize(w, h) {
        this.w = w;
        this.h = h;
        this.button.size(w, h);
    }

    setBold() {
        this.button.style('font-weight', 'bold');
    }

    setNormal() {
        this.button.style('font-weight', 'normal');
    }

    setEvent(e) {
        this.event = e;
    }
}

/* This makes the DOM p */
class P {
    constructor(name) {
        this.name = name;
        this.p = createP(this.name);
        this.x = 0;
        this.y = 0;
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
        this.p.position(this.x, this.y);
    }

    setHeader() {
        this.p.style('font-size', '40px');
        this.p.style('height', '1px');
        this.p.style('width', '500px');
        this.p.style('margin', '0px');
        this.p.style('text-align', 'justify')
    }

    setNormal() {
        this.p.style('font-size', '30px');
        this.p.style('height', '1px');
        this.p.style('width', '400px');
        this.p.style('margin', '0px');
        this.p.style('line-height', '1.7')
        this.p.style('text-align', 'justify')
    }

    update(string) {
        this.p.elt.innerText = string;
    }
}

/* This makes the DOM slider */
class Slider {
    constructor(name) {
        this.name = name;
        this.s = createSlider(0, 255, 0, 10);
        this.min = 0;
        this.max = 255;
        this.x = 0;
        this.y = 0;
        this.value = 0;
        this.s.changed(() => this.sliderReaction());
    }

    setRange(min, max, value, step) {
        this.s.elt.min = min;
        this.s.elt.max = max;
        this.s.elt.value = value;
        this.s.elt.setp = step;
    }

    getValue() {
        return this.s.elt.value;
    }

    setValue(v) {
        this.s.elt.value = v;
        this.value = v;
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
        this.s.position(x, y);
    }

    setEvent(e) {
        this.event = e;
    }

    sliderReaction() {
        document.dispatchEvent(this.event);
    }
}

/* This makes the P5 circle */
class Circle {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.h = 22;
        this.w = 22;
        this.r = 250;
        this.g = 250;
        this.b = 250;
        this.a = 0;

        this.selected = 0;
        this.hz = 0;
        this.e = ellipse(this.x, this.y, this.h, this.w);
    }

    setColor(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = 255
    }

    getColor() {
        return [this.r, this.g, this.b];
    }

    setPosition(x, y) {
        delete this.e;
        this.x = x;
        this.y = y;
        this.e = ellipse(this.x, this.y, this.h, this.w);
    }

    getPosition() {
        return [this.x, this.y];
    }

    getSelected() {
        return this.selected;
    }

    /* To keep if this circle is chosen */
    setSelected(value) {
        this.selected = value;
    }

    update() {
        delete this.e;

        /* If this circle is chosen, make the outline thicker */
        if (this.selected) {
            strokeWeight(3);
            stroke('white')
        } else {
            strokeWeight(1);
            stroke('white')
        }
        fill(this.r, this.g, this.b, this.a)
        this.e = ellipse(this.x, this.y, this.h, this.w);
        strokeWeight(1);
    }
}
