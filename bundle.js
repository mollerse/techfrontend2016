(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var vivus = require('vivus');

new vivus('background', {duration: 50, type: 'oneByOne', start: 'autostart'});

var sections = document.querySelectorAll('.two-column section');
setTimeout(function() {
  sections[0].classList.add('fade-in');
}, 300);

setTimeout(function() {
  sections[1].classList.add('fade-in');
}, 600);

require('./konami')(require('./solitaire'));
},{"./konami":2,"./solitaire":4,"vivus":3}],2:[function(require,module,exports){
/*
 * Konami-JS ~ 
 * :: Now with support for touch events and multiple instances for 
 * :: those situations that call for multiple easter eggs!
 * Code: http://konami-js.googlecode.com/
 * Examples: http://www.snaptortoise.com/konami-js
 * Copyright (c) 2009 George Mandis (georgemandis.com, snaptortoise.com)
 * Version: 1.4.2 (9/2/2013)
 * Licensed under the MIT License (http://opensource.org/licenses/MIT)
 * Tested in: Safari 4+, Google Chrome 4+, Firefox 3+, IE7+, Mobile Safari 2.2.1 and Dolphin Browser
 */

var Konami = function (callback) {
    var konami = {
        addEvent: function (obj, type, fn, ref_obj) {
            if (obj.addEventListener)
                obj.addEventListener(type, fn, false);
            else if (obj.attachEvent) {
                // IE
                obj["e" + type + fn] = fn;
                obj[type + fn] = function () {
                    obj["e" + type + fn](window.event, ref_obj);
                }
                obj.attachEvent("on" + type, obj[type + fn]);
            }
        },
        input: "",
        pattern: "38384040373937396665",
        load: function (link) {
            this.addEvent(document, "keydown", function (e, ref_obj) {
                if (ref_obj) konami = ref_obj; // IE
                konami.input += e ? e.keyCode : event.keyCode;
                if (konami.input.length > konami.pattern.length)
                    konami.input = konami.input.substr((konami.input.length - konami.pattern.length));
                if (konami.input == konami.pattern) {
                    konami.code(link);
                    konami.input = "";
                    e.preventDefault();
                    return false;
                }
            }, this);
            this.iphone.load(link);
        },
        code: function (link) {
            window.location = link
        },
        iphone: {
            start_x: 0,
            start_y: 0,
            stop_x: 0,
            stop_y: 0,
            tap: false,
            capture: false,
            orig_keys: "",
            keys: ["UP", "UP", "DOWN", "DOWN", "LEFT", "RIGHT", "LEFT", "RIGHT", "TAP", "TAP"],
            code: function (link) {
                konami.code(link);
            },
            load: function (link) {
                this.orig_keys = this.keys;
                konami.addEvent(document, "touchmove", function (e) {
                    if (e.touches.length == 1 && konami.iphone.capture == true) {
                        var touch = e.touches[0];
                        konami.iphone.stop_x = touch.pageX;
                        konami.iphone.stop_y = touch.pageY;
                        konami.iphone.tap = false;
                        konami.iphone.capture = false;
                        konami.iphone.check_direction();
                    }
                });
                konami.addEvent(document, "touchend", function (evt) {
                    if (konami.iphone.tap == true) konami.iphone.check_direction(link);
                }, false);
                konami.addEvent(document, "touchstart", function (evt) {
                    konami.iphone.start_x = evt.changedTouches[0].pageX;
                    konami.iphone.start_y = evt.changedTouches[0].pageY;
                    konami.iphone.tap = true;
                    konami.iphone.capture = true;
                });
            },
            check_direction: function (link) {
                x_magnitude = Math.abs(this.start_x - this.stop_x);
                y_magnitude = Math.abs(this.start_y - this.stop_y);
                x = ((this.start_x - this.stop_x) < 0) ? "RIGHT" : "LEFT";
                y = ((this.start_y - this.stop_y) < 0) ? "DOWN" : "UP";
                result = (x_magnitude > y_magnitude) ? x : y;
                result = (this.tap == true) ? "TAP" : result;

                if (result == this.keys[0]) this.keys = this.keys.slice(1, this.keys.length);
                if (this.keys.length == 0) {
                    this.keys = this.orig_keys;
                    this.code(link);
                }
            }
        }
    }

    typeof callback === "string" && konami.load(callback);
    if (typeof callback === "function") {
        konami.code = callback;
        konami.load();
    }

    return konami;
};

module.exports = Konami;
},{}],3:[function(require,module,exports){
/**
 * vivus - JavaScript library to make drawing animation on SVG
 * @version v0.2.3
 * @link https://github.com/maxwellito/vivus
 * @license MIT
 */

'use strict';

(function (window, document) {

  'use strict';

/**
 * Pathformer
 * Beta version
 *
 * Take any SVG version 1.1 and transform
 * child elements to 'path' elements
 *
 * This code is purely forked from
 * https://github.com/Waest/SVGPathConverter
 */

/**
 * Class constructor
 *
 * @param {DOM|String} element Dom element of the SVG or id of it
 */
function Pathformer(element) {
  // Test params
  if (typeof element === 'undefined') {
    throw new Error('Pathformer [constructor]: "element" parameter is required');
  }

  // Set the element
  if (element.constructor === String) {
    element = document.getElementById(element);
    if (!element) {
      throw new Error('Pathformer [constructor]: "element" parameter is not related to an existing ID');
    }
  }
  if (element.constructor instanceof window.SVGElement || /^svg$/i.test(element.nodeName)) {
    this.el = element;
  } else {
    throw new Error('Pathformer [constructor]: "element" parameter must be a string or a SVGelement');
  }

  // Start
  this.scan(element);
}

/**
 * List of tags which can be transformed
 * to path elements
 *
 * @type {Array}
 */
Pathformer.prototype.TYPES = ['line', 'ellipse', 'circle', 'polygon', 'polyline', 'rect'];

/**
 * List of attribute names which contain
 * data. This array list them to check if
 * they contain bad values, like percentage. 
 *
 * @type {Array}
 */
Pathformer.prototype.ATTR_WATCH = ['cx', 'cy', 'points', 'r', 'rx', 'ry', 'x', 'x1', 'x2', 'y', 'y1', 'y2'];

/**
 * Finds the elements compatible for transform
 * and apply the liked method
 *
 * @param  {object} options Object from the constructor
 */
Pathformer.prototype.scan = function (svg) {
  var fn, element, pathData, pathDom,
    elements = svg.querySelectorAll(this.TYPES.join(','));
  for (var i = 0; i < elements.length; i++) {
    element = elements[i];
    fn = this[element.tagName.toLowerCase() + 'ToPath'];
    pathData = fn(this.parseAttr(element.attributes));
    pathDom = this.pathMaker(element, pathData);
    element.parentNode.replaceChild(pathDom, element);
  }
};


/**
 * Read `line` element to extract and transform
 * data, to make it ready for a `path` object.
 *
 * @param  {DOMelement} element Line element to transform
 * @return {object}             Data for a `path` element
 */
Pathformer.prototype.lineToPath = function (element) {
  var newElement = {};
  newElement.d = 'M' + element.x1 + ',' + element.y1 + 'L' + element.x2 + ',' + element.y2;
  return newElement;
};

/**
 * Read `rect` element to extract and transform
 * data, to make it ready for a `path` object.
 * The radius-border is not taken in charge yet.
 * (your help is more than welcomed)
 *
 * @param  {DOMelement} element Rect element to transform
 * @return {object}             Data for a `path` element
 */
Pathformer.prototype.rectToPath = function (element) {
  var newElement = {},
    x = parseFloat(element.x) || 0,
    y = parseFloat(element.y) || 0,
    width = parseFloat(element.width) || 0,
    height = parseFloat(element.height) || 0;
  newElement.d  = 'M' + x + ' ' + y + ' ';
  newElement.d += 'L' + (x + width) + ' ' + y + ' ';
  newElement.d += 'L' + (x + width) + ' ' + (y + height) + ' ';
  newElement.d += 'L' + x + ' ' + (y + height) + ' Z';
  return newElement;
};

/**
 * Read `polyline` element to extract and transform
 * data, to make it ready for a `path` object.
 *
 * @param  {DOMelement} element Polyline element to transform
 * @return {object}             Data for a `path` element
 */
Pathformer.prototype.polylineToPath = function (element) {
  var i, path;
  var newElement = {};
  var points = element.points.trim().split(' ');
  
  // Reformatting if points are defined without commas
  if (element.points.indexOf(',') === -1) {
    var formattedPoints = [];
    for (i = 0; i < points.length; i+=2) {
      formattedPoints.push(points[i] + ',' + points[i+1]);
    }
    points = formattedPoints;
  }

  // Generate the path.d value
  path = 'M' + points[0];
  for(i = 1; i < points.length; i++) {
    if (points[i].indexOf(',') !== -1) {
      path += 'L' + points[i];
    }
  }
  newElement.d = path;
  return newElement;
};

/**
 * Read `polygon` element to extract and transform
 * data, to make it ready for a `path` object.
 * This method rely on polylineToPath, because the
 * logic is similar. The path created is just closed,
 * so it needs an 'Z' at the end.
 *
 * @param  {DOMelement} element Polygon element to transform
 * @return {object}             Data for a `path` element
 */
Pathformer.prototype.polygonToPath = function (element) {
  var newElement = Pathformer.prototype.polylineToPath(element);
  newElement.d += 'Z';
  return newElement;
};

/**
 * Read `ellipse` element to extract and transform
 * data, to make it ready for a `path` object.
 *
 * @param  {DOMelement} element ellipse element to transform
 * @return {object}             Data for a `path` element
 */
Pathformer.prototype.ellipseToPath = function (element) {
  var startX = element.cx - element.rx,
      startY = element.cy;
  var endX = parseFloat(element.cx) + parseFloat(element.rx),
      endY = element.cy;

  var newElement = {};
  newElement.d = 'M' + startX + ',' + startY +
                 'A' + element.rx + ',' + element.ry + ' 0,1,1 ' + endX + ',' + endY +
                 'A' + element.rx + ',' + element.ry + ' 0,1,1 ' + startX + ',' + endY;
  return newElement;
};

/**
 * Read `circle` element to extract and transform
 * data, to make it ready for a `path` object.
 *
 * @param  {DOMelement} element Circle element to transform
 * @return {object}             Data for a `path` element
 */
Pathformer.prototype.circleToPath = function (element) {
  var newElement = {};
  var startX = element.cx - element.r,
      startY = element.cy;
  var endX = parseFloat(element.cx) + parseFloat(element.r),
      endY = element.cy;
  newElement.d =  'M' + startX + ',' + startY +
                  'A' + element.r + ',' + element.r + ' 0,1,1 ' + endX + ',' + endY +
                  'A' + element.r + ',' + element.r + ' 0,1,1 ' + startX + ',' + endY;
  return newElement;
};

/**
 * Create `path` elements form original element
 * and prepared objects
 *
 * @param  {DOMelement} element  Original element to transform
 * @param  {object} pathData     Path data (from `toPath` methods)
 * @return {DOMelement}          Path element
 */
Pathformer.prototype.pathMaker = function (element, pathData) {
  var i, attr, pathTag = document.createElementNS('http://www.w3.org/2000/svg','path');
  for(i = 0; i < element.attributes.length; i++) {
    attr = element.attributes[i];
    if (this.ATTR_WATCH.indexOf(attr.name) === -1) {
      pathTag.setAttribute(attr.name, attr.value);
    }
  }
  for(i in pathData) {
    pathTag.setAttribute(i, pathData[i]);
  }
  return pathTag;
};

/**
 * Parse attributes of a DOM element to
 * get an object of attribute => value
 *
 * @param  {NamedNodeMap} attributes Attributes object from DOM element to parse
 * @return {object}                  Object of attributes
 */
Pathformer.prototype.parseAttr = function (element) {
  var attr, output = {};
  for (var i = 0; i < element.length; i++) {
    attr = element[i];
    // Check if no data attribute contains '%', or the transformation is impossible
    if (this.ATTR_WATCH.indexOf(attr.name) !== -1 && attr.value.indexOf('%') !== -1) {
      throw new Error('Pathformer [parseAttr]: a SVG shape got values in percentage. This cannot be transformed into \'path\' tags. Please use \'viewBox\'.');
    }
    output[attr.name] = attr.value;
  }
  return output;
};

  'use strict';

var requestAnimFrame, cancelAnimFrame, parsePositiveInt;

/**
 * Vivus
 * Beta version
 *
 * Take any SVG and make the animation
 * to give give the impression of live drawing
 *
 * This in more than just inspired from codrops
 * At that point, it's a pure fork.
 */

/**
 * Class constructor
 * option structure
 *   type: 'delayed'|'async'|'oneByOne'|'script' (to know if the item must be drawn asynchronously or not, default: delayed)
 *   duration: <int> (in frames)
 *   start: 'inViewport'|'manual'|'autostart' (start automatically the animation, default: inViewport)
 *   delay: <int> (delay between the drawing of first and last path)
 *   dashGap <integer> whitespace extra margin between dashes
 *   pathTimingFunction <function> timing animation function for each path element of the SVG
 *   animTimingFunction <function> timing animation function for the complete SVG
 *   forceRender <boolean> force the browser to re-render all updated path items
 *   selfDestroy <boolean> removes all extra styling on the SVG, and leaves it as original
 *
 * The attribute 'type' is by default on 'delayed'.
 *  - 'delayed'
 *    all paths are draw at the same time but with a
 *    little delay between them before start
 *  - 'async'
 *    all path are start and finish at the same time
 *  - 'oneByOne'
 *    only one path is draw at the time
 *    the end of the first one will trigger the draw
 *    of the next one
 *
 * All these values can be overwritten individually
 * for each path item in the SVG
 * The value of frames will always take the advantage of
 * the duration value.
 * If you fail somewhere, an error will be thrown.
 * Good luck.
 *
 * @constructor
 * @this {Vivus}
 * @param {DOM|String}   element  Dom element of the SVG or id of it
 * @param {Object}       options  Options about the animation
 * @param {Function}     callback Callback for the end of the animation
 */
function Vivus (element, options, callback) {

  // Setup
  this.isReady = false;
  this.setElement(element, options);
  this.setOptions(options);
  this.setCallback(callback);

  if (this.isReady) {
    this.init();
  }
}

/**
 * Timing functions
 ************************************** 
 * 
 * Default functions to help developers.
 * It always take a number as parameter (between 0 to 1) then
 * return a number (between 0 and 1)
 */
Vivus.LINEAR          = function (x) {return x;};
Vivus.EASE            = function (x) {return -Math.cos(x * Math.PI) / 2 + 0.5;};
Vivus.EASE_OUT        = function (x) {return 1 - Math.pow(1-x, 3);};
Vivus.EASE_IN         = function (x) {return Math.pow(x, 3);};
Vivus.EASE_OUT_BOUNCE = function (x) {
  var base = -Math.cos(x * (0.5 * Math.PI)) + 1,
    rate = Math.pow(base,1.5),
    rateR = Math.pow(1 - x, 2),
    progress = -Math.abs(Math.cos(rate * (2.5 * Math.PI) )) + 1;
  return (1- rateR) + (progress * rateR);
};


/**
 * Setters
 **************************************
 */

/**
 * Check and set the element in the instance
 * The method will not return anything, but will throw an
 * error if the parameter is invalid
 *
 * @param {DOM|String}   element  SVG Dom element or id of it
 */
Vivus.prototype.setElement = function (element, options) {
  // Basic check
  if (typeof element === 'undefined') {
    throw new Error('Vivus [constructor]: "element" parameter is required');
  }

  // Set the element
  if (element.constructor === String) {
    element = document.getElementById(element);
    if (!element) {
      throw new Error('Vivus [constructor]: "element" parameter is not related to an existing ID');
    }
  }
  this.parentEl = element;

  // Create the object element if the property `file` exists in the options object
  if (options && options.file) {
    var objElm = document.createElement('object');
    objElm.setAttribute('type', 'image/svg+xml');
    objElm.setAttribute('data', options.file);
    objElm.setAttribute('width', '100%');
    objElm.setAttribute('height', '100%');
    element.appendChild(objElm);
    element = objElm;
  }

  switch (element.constructor) {
  case window.SVGSVGElement:
  case window.SVGElement:
    this.el = element;
    this.isReady = true;
    break;

  case window.HTMLObjectElement:
    // If the Object is already loaded
    this.el = element.contentDocument && element.contentDocument.querySelector('svg');
    if (this.el) {
      this.isReady = true;
      return;
    }

    // If we have to wait for it
    var self = this;
    element.addEventListener('load', function () {
      self.el = element.contentDocument && element.contentDocument.querySelector('svg');
      if (!self.el) {
        throw new Error('Vivus [constructor]: object loaded does not contain any SVG');
      }
      else {
        self.isReady = true;
        self.init();
      }
    });
    break;

  default:
    throw new Error('Vivus [constructor]: "element" parameter is not valid (or miss the "file" attribute)');
  }
};

/**
 * Set up user option to the instance
 * The method will not return anything, but will throw an
 * error if the parameter is invalid
 *
 * @param  {object} options Object from the constructor
 */
Vivus.prototype.setOptions = function (options) {
  var allowedTypes = ['delayed', 'async', 'oneByOne', 'scenario', 'scenario-sync'];
  var allowedStarts =  ['inViewport', 'manual', 'autostart'];

  // Basic check
  if (options !== undefined && options.constructor !== Object) {
    throw new Error('Vivus [constructor]: "options" parameter must be an object');
  }
  else {
    options = options || {};
  }

  // Set the animation type
  if (options.type && allowedTypes.indexOf(options.type) === -1) {
    throw new Error('Vivus [constructor]: ' + options.type + ' is not an existing animation `type`');
  }
  else {
    this.type = options.type || allowedTypes[0];
  }

  // Set the start type
  if (options.start && allowedStarts.indexOf(options.start) === -1) {
    throw new Error('Vivus [constructor]: ' + options.start + ' is not an existing `start` option');
  }
  else {
    this.start = options.start || allowedStarts[0];
  }

  this.isIE        = (window.navigator.userAgent.indexOf('MSIE') !== -1 || window.navigator.userAgent.indexOf('Trident/') !== -1 || window.navigator.userAgent.indexOf('Edge/') !== -1 );
  this.duration    = parsePositiveInt(options.duration, 120);
  this.delay       = parsePositiveInt(options.delay, null);
  this.dashGap     = parsePositiveInt(options.dashGap, 2);
  this.forceRender = options.hasOwnProperty('forceRender') ? !!options.forceRender : this.isIE;
  this.selfDestroy = !!options.selfDestroy;
  this.onReady     = options.onReady;

  this.ignoreInvisible = options.hasOwnProperty('ignoreInvisible') ? !!options.ignoreInvisible : false;

  this.animTimingFunction = options.animTimingFunction || Vivus.LINEAR;
  this.pathTimingFunction = options.pathTimingFunction || Vivus.LINEAR;

  if (this.delay >= this.duration) {
    throw new Error('Vivus [constructor]: delay must be shorter than duration');
  }
};

/**
 * Set up callback to the instance
 * The method will not return enything, but will throw an
 * error if the parameter is invalid
 *
 * @param  {Function} callback Callback for the animation end
 */
Vivus.prototype.setCallback = function (callback) {
  // Basic check
  if (!!callback && callback.constructor !== Function) {
    throw new Error('Vivus [constructor]: "callback" parameter must be a function');
  }
  this.callback = callback || function () {};
};


/**
 * Core
 **************************************
 */

/**
 * Map the svg, path by path.
 * The method return nothing, it just fill the
 * `map` array. Each item in this array represent
 * a path element from the SVG, with informations for
 * the animation.
 *
 * ```
 * [
 *   {
 *     el: <DOMobj> the path element
 *     length: <number> length of the path line
 *     startAt: <number> time start of the path animation (in frames)
 *     duration: <number> path animation duration (in frames)
 *   },
 *   ...
 * ]
 * ```
 *
 */
Vivus.prototype.mapping = function () {
  var i, paths, path, pAttrs, pathObj, totalLength, lengthMeter, timePoint;
  timePoint = totalLength = lengthMeter = 0;
  paths = this.el.querySelectorAll('path');

  for (i = 0; i < paths.length; i++) {
    path = paths[i];
    if (this.isInvisible(path)) {
      continue;
    }
    pathObj = {
      el: path,
      length: Math.ceil(path.getTotalLength())
    };
    // Test if the path length is correct
    if (isNaN(pathObj.length)) {
      if (window.console && console.warn) {
        console.warn('Vivus [mapping]: cannot retrieve a path element length', path);
      }
      continue;
    }
    totalLength += pathObj.length;
    this.map.push(pathObj);
    path.style.strokeDasharray  = pathObj.length + ' ' + (pathObj.length + this.dashGap);
    path.style.strokeDashoffset = pathObj.length;

    // Fix IE glitch
    if (this.isIE) {
      pathObj.length += this.dashGap;
    }
    this.renderPath(i);
  }

  totalLength = totalLength === 0 ? 1 : totalLength;
  this.delay = this.delay === null ? this.duration / 3 : this.delay;
  this.delayUnit = this.delay / (paths.length > 1 ? paths.length - 1 : 1);

  for (i = 0; i < this.map.length; i++) {
    pathObj = this.map[i];

    switch (this.type) {
    case 'delayed':
      pathObj.startAt = this.delayUnit * i;
      pathObj.duration = this.duration - this.delay;
      break;

    case 'oneByOne':
      pathObj.startAt = lengthMeter / totalLength * this.duration;
      pathObj.duration = pathObj.length / totalLength * this.duration;
      break;

    case 'async':
      pathObj.startAt = 0;
      pathObj.duration = this.duration;
      break;

    case 'scenario-sync':
      path = paths[i];
      pAttrs = this.parseAttr(path);
      pathObj.startAt = timePoint + (parsePositiveInt(pAttrs['data-delay'], this.delayUnit) || 0);
      pathObj.duration = parsePositiveInt(pAttrs['data-duration'], this.duration);
      timePoint = pAttrs['data-async'] !== undefined ? pathObj.startAt : pathObj.startAt + pathObj.duration;
      this.frameLength = Math.max(this.frameLength, (pathObj.startAt + pathObj.duration));
      break;

    case 'scenario':
      path = paths[i];
      pAttrs = this.parseAttr(path);
      pathObj.startAt = parsePositiveInt(pAttrs['data-start'], this.delayUnit) || 0;
      pathObj.duration = parsePositiveInt(pAttrs['data-duration'], this.duration);
      this.frameLength = Math.max(this.frameLength, (pathObj.startAt + pathObj.duration));
      break;
    }
    lengthMeter += pathObj.length;
    this.frameLength = this.frameLength || this.duration;
  }
};

/**
 * Interval method to draw the SVG from current
 * position of the animation. It update the value of
 * `currentFrame` and re-trace the SVG.
 *
 * It use this.handle to store the requestAnimationFrame
 * and clear it one the animation is stopped. So this
 * attribute can be used to know if the animation is
 * playing.
 *
 * Once the animation at the end, this method will
 * trigger the Vivus callback.
 *
 */
Vivus.prototype.drawer = function () {
  var self = this;
  this.currentFrame += this.speed;

  if (this.currentFrame <= 0) {
    this.stop();
    this.reset();
    this.callback(this);
  } else if (this.currentFrame >= this.frameLength) {
    this.stop();
    this.currentFrame = this.frameLength;
    this.trace();
    if (this.selfDestroy) {
      this.destroy();
    }
    this.callback(this);
  } else {
    this.trace();
    this.handle = requestAnimFrame(function () {
      self.drawer();
    });
  }
};

/**
 * Draw the SVG at the current instant from the
 * `currentFrame` value. Here is where most of the magic is.
 * The trick is to use the `strokeDashoffset` style property.
 *
 * For optimisation reasons, a new property called `progress`
 * is added in each item of `map`. This one contain the current
 * progress of the path element. Only if the new value is different
 * the new value will be applied to the DOM element. This
 * method save a lot of resources to re-render the SVG. And could
 * be improved if the animation couldn't be played forward.
 *
 */
Vivus.prototype.trace = function () {
  var i, progress, path, currentFrame;
  currentFrame = this.animTimingFunction(this.currentFrame / this.frameLength) * this.frameLength;
  for (i = 0; i < this.map.length; i++) {
    path = this.map[i];
    progress = (currentFrame - path.startAt) / path.duration;
    progress = this.pathTimingFunction(Math.max(0, Math.min(1, progress)));
    if (path.progress !== progress) {
      path.progress = progress;
      path.el.style.strokeDashoffset = Math.floor(path.length * (1 - progress));
      this.renderPath(i);
    }
  }
};

/**
 * Method forcing the browser to re-render a path element
 * from it's index in the map. Depending on the `forceRender`
 * value.
 * The trick is to replace the path element by it's clone.
 * This practice is not recommended because it's asking more
 * ressources, too much DOM manupulation..
 * but it's the only way to let the magic happen on IE.
 * By default, this fallback is only applied on IE.
 * 
 * @param  {Number} index Path index
 */
Vivus.prototype.renderPath = function (index) {
  if (this.forceRender && this.map && this.map[index]) {
    var pathObj = this.map[index],
        newPath = pathObj.el.cloneNode(true);
    pathObj.el.parentNode.replaceChild(newPath, pathObj.el);
    pathObj.el = newPath;
  }
};

/**
 * When the SVG object is loaded and ready,
 * this method will continue the initialisation.
 *
 * This this mainly due to the case of passing an
 * object tag in the constructor. It will wait
 * the end of the loading to initialise.
 * 
 */
Vivus.prototype.init = function () {
  // Set object variables
  this.frameLength = 0;
  this.currentFrame = 0;
  this.map = [];

  // Start
  new Pathformer(this.el);
  this.mapping();
  this.starter();

  if (this.onReady) {
    this.onReady(this);
  }
};

/**
 * Trigger to start of the animation.
 * Depending on the `start` value, a different script
 * will be applied.
 *
 * If the `start` value is not valid, an error will be thrown.
 * Even if technically, this is impossible.
 *
 */
Vivus.prototype.starter = function () {
  switch (this.start) {
  case 'manual':
    return;

  case 'autostart':
    this.play();
    break;

  case 'inViewport':
    var self = this,
    listener = function () {
      if (self.isInViewport(self.parentEl, 1)) {
        self.play();
        window.removeEventListener('scroll', listener);
      }
    };
    window.addEventListener('scroll', listener);
    listener();
    break;
  }
};


/**
 * Controls
 **************************************
 */

/**
 * Get the current status of the animation between
 * three different states: 'start', 'progress', 'end'.
 * @return {string} Instance status
 */
Vivus.prototype.getStatus = function () {
  return this.currentFrame === 0 ? 'start' : this.currentFrame === this.frameLength ? 'end' : 'progress';
};

/**
 * Reset the instance to the initial state : undraw
 * Be careful, it just reset the animation, if you're
 * playing the animation, this won't stop it. But just
 * make it start from start.
 *
 */
Vivus.prototype.reset = function () {
  return this.setFrameProgress(0);
};

/**
 * Set the instance to the final state : drawn
 * Be careful, it just set the animation, if you're
 * playing the animation on rewind, this won't stop it.
 * But just make it start from the end.
 *
 */
Vivus.prototype.finish = function () {
  return this.setFrameProgress(1);
};

/**
 * Set the level of progress of the drawing.
 * 
 * @param {number} progress Level of progress to set
 */
Vivus.prototype.setFrameProgress = function (progress) {
  progress = Math.min(1, Math.max(0, progress));
  this.currentFrame = Math.round(this.frameLength * progress);
  this.trace();
  return this;
};

/**
 * Play the animation at the desired speed.
 * Speed must be a valid number (no zero).
 * By default, the speed value is 1.
 * But a negative value is accepted to go forward.
 *
 * And works with float too.
 * But don't forget we are in JavaScript, se be nice
 * with him and give him a 1/2^x value.
 *
 * @param  {number} speed Animation speed [optional]
 */
Vivus.prototype.play = function (speed) {
  if (speed && typeof speed !== 'number') {
    throw new Error('Vivus [play]: invalid speed');
  }
  this.speed = speed || 1;
  if (!this.handle) {
    this.drawer();
  }
  return this;
};

/**
 * Stop the current animation, if on progress.
 * Should not trigger any error.
 *
 */
Vivus.prototype.stop = function () {
  if (this.handle) {
    cancelAnimFrame(this.handle);
    delete this.handle;
  }
  return this;
};

/**
 * Destroy the instance.
 * Remove all bad styling attributes on all
 * path tags
 *
 */
Vivus.prototype.destroy = function () {
  var i, path;
  for (i = 0; i < this.map.length; i++) {
    path = this.map[i];
    path.el.style.strokeDashoffset = null;
    path.el.style.strokeDasharray = null;
    this.renderPath(i);
  }
};


/**
 * Utils methods
 * include methods from Codrops
 **************************************
 */

/**
 * Method to best guess if a path should added into
 * the animation or not.
 *
 * 1. Use the `data-vivus-ignore` attribute if set
 * 2. Check if the instance must ignore invisible paths
 * 3. Check if the path is visible
 *
 * For now the visibility checking is unstable.
 * It will be used for a beta phase.
 *
 * Other improvments are planned. Like detecting
 * is the path got a stroke or a valid opacity.
 */
Vivus.prototype.isInvisible = function (el) {
  var rect,
    ignoreAttr = el.getAttribute('data-ignore');

  if (ignoreAttr !== null) {
    return ignoreAttr !== 'false';
  }

  if (this.ignoreInvisible) {
    rect = el.getBoundingClientRect();
    return !rect.width && !rect.height;
  }
  else {
    return false;
  }
};

/**
 * Parse attributes of a DOM element to
 * get an object of {attributeName => attributeValue}
 *
 * @param  {object} element DOM element to parse
 * @return {object}         Object of attributes
 */
Vivus.prototype.parseAttr = function (element) {
  var attr, output = {};
  if (element && element.attributes) {
    for (var i = 0; i < element.attributes.length; i++) {
      attr = element.attributes[i];
      output[attr.name] = attr.value;
    }
  }
  return output;
};

/**
 * Reply if an element is in the page viewport
 *
 * @param  {object} el Element to observe
 * @param  {number} h  Percentage of height
 * @return {boolean}
 */
Vivus.prototype.isInViewport = function (el, h) {
  var scrolled   = this.scrollY(),
    viewed       = scrolled + this.getViewportH(),
    elBCR        = el.getBoundingClientRect(),
    elHeight     = elBCR.height,
    elTop        = scrolled + elBCR.top,
    elBottom     = elTop + elHeight;

  // if 0, the element is considered in the viewport as soon as it enters.
  // if 1, the element is considered in the viewport only when it's fully inside
  // value in percentage (1 >= h >= 0)
  h = h || 0;

  return (elTop + elHeight * h) <= viewed && (elBottom) >= scrolled;
};

/**
 * Alias for document element
 *
 * @type {DOMelement}
 */
Vivus.prototype.docElem = window.document.documentElement;

/**
 * Get the viewport height in pixels
 *
 * @return {integer} Viewport height
 */
Vivus.prototype.getViewportH = function () {
  var client = this.docElem.clientHeight,
    inner = window.innerHeight;

  if (client < inner) {
    return inner;
  }
  else {
    return client;
  }
};

/**
 * Get the page Y offset
 *
 * @return {integer} Page Y offset
 */
Vivus.prototype.scrollY = function () {
  return window.pageYOffset || this.docElem.scrollTop;
};

/**
 * Alias for `requestAnimationFrame` or
 * `setTimeout` function for deprecated browsers.
 *
 */
requestAnimFrame = (function () {
  return (
    window.requestAnimationFrame       ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame    ||
    window.oRequestAnimationFrame      ||
    window.msRequestAnimationFrame     ||
    function(/* function */ callback){
      return window.setTimeout(callback, 1000 / 60);
    }
  );
})();

/**
 * Alias for `cancelAnimationFrame` or
 * `cancelTimeout` function for deprecated browsers.
 *
 */
cancelAnimFrame = (function () {
  return (
    window.cancelAnimationFrame       ||
    window.webkitCancelAnimationFrame ||
    window.mozCancelAnimationFrame    ||
    window.oCancelAnimationFrame      ||
    window.msCancelAnimationFrame     ||
    function(id){
      return window.clearTimeout(id);
    }
  );
})();

/**
 * Parse string to integer.
 * If the number is not positive or null
 * the method will return the default value
 * or 0 if undefined
 *
 * @param {string} value String to parse
 * @param {*} defaultValue Value to return if the result parsed is invalid
 * @return {number}
 *
 */
parsePositiveInt = function (value, defaultValue) {
  var output = parseInt(value, 10);
  return (output >= 0) ? output : defaultValue;
};


  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], function() {
      return Vivus;
    });
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = Vivus;
  } else {
    // Browser globals
    window.Vivus = Vivus;
  }

}(window, document));

},{}],4:[function(require,module,exports){
module.exports = function() {
    var canvas = document.createElement( 'canvas' );
    canvas.style.position = 'fixed';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.zIndex = 999;
    document.body.insertBefore(canvas, document.body.firstChild);

    var context = canvas.getContext( '2d' );

    var id = 52;

    var cwidth = 71, cwidthhalf = cwidth / 2;
    var cheight = 96, cheighthalf = cheight / 2;

    var particles = [];

    var Particle = function ( id, x, y, sx, sy ) {

        if ( sx === 0 ) sx = 2;

        var cx = ( id % 4 ) * cwidth;
        var cy = Math.floor( id / 4 ) * cheight;

        this.update = function () {

            x += sx;
            y += sy;

            if ( x < ( - cwidthhalf ) || x > ( canvas.width + cwidthhalf ) ) {

                var index = particles.indexOf( this );
                particles.splice( index, 1 );

                return false;

            }

            if ( y > canvas.height - cheighthalf ) {

                y = canvas.height - cheighthalf;
                sy = - sy * 0.85;

            }

            sy += 0.98;

            context.drawImage( image, cx, cy, cwidth, cheight, Math.floor( x - cwidthhalf ), Math.floor( y - cheighthalf ), cwidth, cheight );

            return true;

        }

    }

    var image = document.createElement( 'img' );
    image.src = "data:image/png;base64,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";
    // jørans bilde fra twitter
    // image.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAABkCAYAAADaIVPoAAAACXBIWXMAAAsTAAALEwEAmpwYAAAMA2lDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjarVdnVFTn2t2nTIFhho6AlEGkCwLSkd4FpNegMswMzMAwjDMDCnZjSARjFwtWNPaoQQUkVsRgIXbF2IIxWCLXYAx25fvBoLnL+/24a913rbPWPvvd736f/Zx1fjwAr0+gUMhIPaBUrlamxoTzs3Ny+axfwQETHAwHLRCqFGHJyQn4z4sAXlwHAQBXXAUKhQz/3dIXiVVCgEgGUCBSCUsB4gBA3RAqlGqAsQCA7RS1Qg0w9gEwUmbn5AKMdgBGRYP4BgCjgkHcC8BImZ4aATABsHUEAmURwNMBwK8QFqkB3igA7nKRVA7w8gAECyUCEcBbC2BUaWmZCOCdBuBY8A+fon/zLPjoKRAUfcSDWQAA7EipSiETVOJ/vUpl5UN3jACgI1HGpgIwAojtJWXxqQB4AHFYXjA+ScOflYoAAAYAcVdSHpsBwAQg+oSqiNxBTDJFgsj4QQ1pUV6SEabh3QRKAIApQEZK1XHpQ3plWarGn8wTq6LSNBqFRByXMFgD+Y1cNj4BgBVA1hVKo+M0+gNVkvQsjeZ0hTRzvObsdVVJWrzG/2mVJGL8oIaileWpmpopg0JldOqgnnIsVQEaPlQo+FSDWpIeC0AHoDLFquyEIV4kjozS6AvE8ow0DZ6qUIenDuVSyJIThrBYFpM62BNqoaoiLUqDN6qV6UN8Y7FgXPJgLqpdoU7+2B9kIgZh4EMBJaQogQBVQ1zr9sbTl9w1b65QoQTFEEOJUiRAgEoIoARfsz/kUwIpiiGGDFVEChJRBjmkUKPsM+2g4wMoUTrE0F60Hx1Gh9CBtDftz/RiOjC9mE7gM/2ZHkyfj+fDUAgpaQYBij9yyRBADjUEkEEGwRDPuMu4x7j52c0FEEMMGURQQQiJJtXQrhy/oxJqqPFiKNeqssqATAkS0Q05+JCgF3JIPksvghQqKCCDGMVDbGFwZUCmhLagg+kg2o8Op4Pp0I8nP3VIjPJ/9CgZAigggBICyIdYHpvn+lmWf+/xUCWRHysRoJLaQLVQndQRqvk/foPf/5GejyiUaG7VMO4d7pvdD7l3ufe6b1GLp6oBIKJMUamUFknU/DCFQibmx8mFbqP4nu4e3kB2Ti5/8Nd/fgMEAMKE/YkrawXGbgGImZ+4Ai7QeBjgLv7E2ekCehuBdmthubJikKMBgAFt6MIIZrCCLRzhCk/4IBChiMI4JCEdOZgIISQohRJTMB1zUI1aLMYKrMEGbMZ2fI9GNOMwTuAnnMNFXMMtdKMHT9CHF3hLEASL4BKGhBlhTdgRLoQn4UcEE1FEApFK5BD5RBEhJ8qJ6cSXRC2xlFhDbCJ2ED8Qh4gTxBniEvELcY94TPxFvCEpUoc0Ii1Je3I06UeGkfFkOjmBLCInk1XkPHIhuYpsIHeTTeQJ8hx5jewmn5D9FCgOZULZUK6UHxVBJVG5VCGlpGZSNVQd1UDtoVqpDuoK1U31Uq9pJm1I82lXOpCOpTNoIT2ZnkkvoNfQ2+kmup2+Qt+j++gPDC7DguHCCGDEMbIZRYwpjGpGHWMr4yDjFOMao4fxgslkmjAdmL7MWGYOs5g5jbmAuY65l3mceYl5n9nPYrHMWC6sIFYSS8BSs6pZq1m7WcdYl1k9rFdsDtua7cmOZuey5ey57Dr2TvZR9mX2Q/ZbLT0tO60ArSQtkVal1iKtLVqtWhe0erTeautrO2gHaadrF2vP0V6lvUf7lPZt7eccDmcEx5+TwpFyZnNWcfZxTnPucV7rGOg460To5OmU6yzU2aZzXOcXnedcLteeG8rN5aq5C7k7uCe5d7mveIY8N14cT8SbxavnNfEu857qauna6YbpTtSt0q3T3a97QbdXT0vPXi9CT6A3U69e75Bel16/vqG+h36Sfqn+Av2d+mf0HxmwDOwNogxEBvMMNhucNLhvSBnaGkYYCg2/NNxieMqwx4hp5GAUZ1RsVGv0vdF5oz5jA2Mv40zjqcb1xkeMu00oE3uTOBOZySKTRpPrJm+GWQ4LGyYeNn/YnmGXh700HW4aaio2rTHda3rN9I0Z3yzKrMRsiVmz2R1z2tzZPMV8ivl681PmvcONhgcOFw6vGd44/KYFaeFskWoxzWKzRadFv6WVZYylwnK15UnLXisTq1CrYqvlVketHlsbWgdbS62XWx+z/oNvzA/jy/ir+O38PhsLm1ibcptNNudt3o5wGJExYu6IvSPu2Grb+tkW2i63bbPtG2k9MnHk9JG7Rt6007Lzs5PYrbTrsHtp72CfZf+1fbP9IwdThziHKoddDrcduY4hjpMdGxyvOjGd/JxKnNY5XXQmnb2dJc71zhdcSBcfF6nLOpdLoxij/EfJRzWM6nLVcQ1zrXDd5XrPzcQtwW2uW7Pb09EjR+eOXjK6Y/QHd293mfsW91seBh7jPOZ6tHr85ensKfSs97w6hjsmesysMS1jnnm5eIm91nvd8Db0TvT+2rvN+72Pr4/SZ4/PY9+Rvvm+a327/Iz8kv0W+J32Z/iH+8/yP+z/OsAnQB3QGPBnoGtgSeDOwEdjHcaKx24Zez9oRJAgaFNQdzA/OD94Y3B3iE2IIKQh5LdQ21BR6NbQh2FOYcVhu8OehruHK8MPhr+MCIiYEXE8koqMiayJPB9lEJURtSbqbvSI6KLoXdF9Md4x02KOxzJi42OXxHbFWcYJ43bE9Y3zHTdjXHu8Tnxa/Jr43xKcE5QJrYlk4rjEZYm3x9uNl49vTkJSXNKypDvJDsmTk39MYaYkp9SnPEj1SJ2e2pFmmDYpbWfai/Tw9EXptzIcM8oz2jJ1M/Myd2S+zIrMWprVnT06e0b2uRzzHGlOSy4rNzN3a27/F1FfrPiiJ887rzrv+gSHCVMnnJloPlE28cgk3UmCSfvzGflZ+Tvz3wmSBA2C/oK4grUFfcII4UrhE1GoaLnosThIvFT8sDCocGnho6KgomVFjyUhkjpJrzRCukb6rDi2eEPxy5Kkkm0lA7Is2d5Sdml+6SG5gbxE3l5mVTa17JLCRVGt6J4cMHnF5D5lvHKrilBNULWojdQKdWe5Y/lX5fcqgivqK15NyZyyf6r+VPnUzkrnyvmVD6uiq76bRk8TTmubbjN9zvR7M8JmbJpJzCyY2TbLdta8WT2zY2Zvn6M9p2TOz3Pd5y6d+/eXWV+2zrOcN3ve/a9ivtpVzatWVnd9Hfj1hm/ob6TfnJ8/Zv7q+R9qRDVna91r62rfLRAuOPutx7ervh1YWLjw/CKfResXMxfLF19fErJk+1L9pVVL7y9LXNa0nL+8ZvnfKyatOFPnVbdhpfbK8pXdqxJWtaweuXrx6ndrJGuu1YfX711rsXb+2pfrROsurw9dv2eD5YbaDW82Sjfe2BSzqanBvqFuM3NzxeYHWzK3dHzn992OreZba7e+3ybf1r09dXv7Dt8dO3Za7Fy0i9xVvuvx7rzdF7+P/L5lj+ueTXtN9tbuw77yfX/8kP/D9cb4xrb9fvv3HLA7sPag4cGaJqKpsqmvWdLc3ZLTcunQuENtrYGtB390+3HbYZvD9UeMjyw6qn103tGBY1XH+o8rjveeKDpxv21S262T2Sevtqe0nz8Vf+r0T9E/newI6zh2Ouj04TMBZw6d9TvbfM7nXFOnd+fBn71/Pnje53zTBd8LLRf9L7ZeGnvp6OWQyyeuRF756Wrc1XPXxl+7dD3j+o2uvK7uG6Ibj36R/fLsZsXNt7dm32bcrrmjd6fursXdhl+dft3b7dN95F7kvc7f0n67dV94/8nvqt/f9cx7wH1Q99D64Y5Hno8OP45+fPGPL/7oeaJ48ra3+l/6/1r71PHpgT9D/+zsy+7reaZ8NvDXgudmz7f97fV3W39y/90XpS/evqx5ZfZq+2u/1x1vst48fDvlHevdqvdO71s/xH+4PVA6MKAQKAUAAAoAWVgI/LUN4OYAhhcBbd7g7KSZ+YhP09//hwfnKwCAD7AZQM5xIOU4sDEUsAOgOxtIDgXSQ0GOGfPx0SxV4RjPQS9OM8CoGxh4ngWwnID3XQMDb5sHBt5vBaibwPEXgzMbAHANgJOVADid7s8/m53+D2s8XnKrN51mAAA6FGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS41LWMwMTQgNzkuMTUxNDgxLCAyMDEzLzAzLzEzLTEyOjA5OjE1ICAgICAgICAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIgogICAgICAgICAgICB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIgogICAgICAgICAgICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iCiAgICAgICAgICAgIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIj4KICAgICAgICAgPHhtcDpDcmVhdG9yVG9vbD5BZG9iZSBQaG90b3Nob3AgQ0MgKE1hY2ludG9zaCk8L3htcDpDcmVhdG9yVG9vbD4KICAgICAgICAgPHhtcDpDcmVhdGVEYXRlPjIwMTUtMTEtMTBUMjI6NDM6NTIrMDE6MDA8L3htcDpDcmVhdGVEYXRlPgogICAgICAgICA8eG1wOk1ldGFkYXRhRGF0ZT4yMDE1LTExLTEwVDIyOjQzOjUyKzAxOjAwPC94bXA6TWV0YWRhdGFEYXRlPgogICAgICAgICA8eG1wOk1vZGlmeURhdGU+MjAxNS0xMS0xMFQyMjo0Mzo1MiswMTowMDwveG1wOk1vZGlmeURhdGU+CiAgICAgICAgIDx4bXBNTTpJbnN0YW5jZUlEPnhtcC5paWQ6MWY0OGI3ZWMtODQ1Mi00MDBjLWI1MjMtMTY4OGE2YWU5NGE1PC94bXBNTTpJbnN0YW5jZUlEPgogICAgICAgICA8eG1wTU06RG9jdW1lbnRJRD54bXAuZGlkOjBhMDJkNTdhLTViNDMtNDY0Yy05MjVjLTE2Y2VjZDlmMmFhNjwveG1wTU06RG9jdW1lbnRJRD4KICAgICAgICAgPHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD54bXAuZGlkOjBhMDJkNTdhLTViNDMtNDY0Yy05MjVjLTE2Y2VjZDlmMmFhNjwveG1wTU06T3JpZ2luYWxEb2N1bWVudElEPgogICAgICAgICA8eG1wTU06SGlzdG9yeT4KICAgICAgICAgICAgPHJkZjpTZXE+CiAgICAgICAgICAgICAgIDxyZGY6bGkgcmRmOnBhcnNlVHlwZT0iUmVzb3VyY2UiPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6YWN0aW9uPmNyZWF0ZWQ8L3N0RXZ0OmFjdGlvbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0Omluc3RhbmNlSUQ+eG1wLmlpZDowYTAyZDU3YS01YjQzLTQ2NGMtOTI1Yy0xNmNlY2Q5ZjJhYTY8L3N0RXZ0Omluc3RhbmNlSUQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDp3aGVuPjIwMTUtMTEtMTBUMjI6NDM6NTIrMDE6MDA8L3N0RXZ0OndoZW4+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpzb2Z0d2FyZUFnZW50PkFkb2JlIFBob3Rvc2hvcCBDQyAoTWFjaW50b3NoKTwvc3RFdnQ6c29mdHdhcmVBZ2VudD4KICAgICAgICAgICAgICAgPC9yZGY6bGk+CiAgICAgICAgICAgICAgIDxyZGY6bGkgcmRmOnBhcnNlVHlwZT0iUmVzb3VyY2UiPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6YWN0aW9uPnNhdmVkPC9zdEV2dDphY3Rpb24+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDppbnN0YW5jZUlEPnhtcC5paWQ6MWY0OGI3ZWMtODQ1Mi00MDBjLWI1MjMtMTY4OGE2YWU5NGE1PC9zdEV2dDppbnN0YW5jZUlEPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6d2hlbj4yMDE1LTExLTEwVDIyOjQzOjUyKzAxOjAwPC9zdEV2dDp3aGVuPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6c29mdHdhcmVBZ2VudD5BZG9iZSBQaG90b3Nob3AgQ0MgKE1hY2ludG9zaCk8L3N0RXZ0OnNvZnR3YXJlQWdlbnQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpjaGFuZ2VkPi88L3N0RXZ0OmNoYW5nZWQ+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICA8L3JkZjpTZXE+CiAgICAgICAgIDwveG1wTU06SGlzdG9yeT4KICAgICAgICAgPGRjOmZvcm1hdD5pbWFnZS9wbmc8L2RjOmZvcm1hdD4KICAgICAgICAgPHBob3Rvc2hvcDpDb2xvck1vZGU+MzwvcGhvdG9zaG9wOkNvbG9yTW9kZT4KICAgICAgICAgPHBob3Rvc2hvcDpJQ0NQcm9maWxlPkRpc3BsYXk8L3Bob3Rvc2hvcDpJQ0NQcm9maWxlPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICAgICA8dGlmZjpYUmVzb2x1dGlvbj43MjAwMDAvMTAwMDA8L3RpZmY6WFJlc29sdXRpb24+CiAgICAgICAgIDx0aWZmOllSZXNvbHV0aW9uPjcyMDAwMC8xMDAwMDwvdGlmZjpZUmVzb2x1dGlvbj4KICAgICAgICAgPHRpZmY6UmVzb2x1dGlvblVuaXQ+MjwvdGlmZjpSZXNvbHV0aW9uVW5pdD4KICAgICAgICAgPGV4aWY6Q29sb3JTcGFjZT42NTUzNTwvZXhpZjpDb2xvclNwYWNlPgogICAgICAgICA8ZXhpZjpQaXhlbFhEaW1lbnNpb24+NjA8L2V4aWY6UGl4ZWxYRGltZW5zaW9uPgogICAgICAgICA8ZXhpZjpQaXhlbFlEaW1lbnNpb24+MTAwPC9leGlmOlBpeGVsWURpbWVuc2lvbj4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgCjw/eHBhY2tldCBlbmQ9InciPz6/NwNqAAAAIGNIUk0AAG4nAABzrwAA9qYAAImPAAB5cAAA8IQAAC/VAAAT5VxarV0AAB4NSURBVHja7JxZjCXndd9/5/u+2u/a++wLN1GkZDKSqc1RLMMC4iCIkQVB3uLECQIECJCnIILtyC95SZDYcBYbMRA4sYXEjgPLii1bMGlZEuVQsjYu5k7ODDnT09N7361uVX1LHurOkCNK5NDIS+IuYNC3b92ern+dc/7nf5ZqCSHw5+lQ/Dk7jgEfAz4GfAz4GPAx4GPAx4CPAR8DPgZ8DPgY8DHgY8DHgP//OwxwDeje6Q+EEEAsYPAIGjgab7Nz5Wn+5NHP8cRjv8fd95xBJXD27L0Uac7B3jXKcs7pc2f59lNP8viXnyRLl1ld6ePqGRcunGFpaUhjK5z1zGaWampRWPJuwu7+EQdHR0RRQpH30SYQXEWWwPJyysnz7+Ev/fV/RL7+MB5QIRAAEfnuyx9L+K4u3s1vv/vDb3wqINJgiTAI48k2T/zBr1LvXuFLf/jH9LOcUxtDTl5cxXnD17/+HXa2rnP/ffdz7sJZfv/RL3L96pyNjdPAlCyJCbbBmMDyyhJ5llPXNU1liUxMFCmOJjNG0xlxnDCbVtzYvka306G3PGRjo8u5vrCxcYEH/+Y/o796DyG0OJSSt+AywPjNFv4ed4UQ/OJcGwEewdB+7g9/6xcYvfxN9g8qJnXNqTOnGS4v05SWL33pCTa3xrgAyseMt47oqh75hSHdToaWiDxOGR+NAWimltLNMZHCNnOiSIOkxKnQUwmzecX+3gH93jJpJ2dcwvzqGKYaok3k8f/Cw3/5n5JlK8ji+sLCWgtcY3NnjiyIeEKwgEIkAuDzv/lv2Xr265xeP8l3nvs2vW5BU1VMpjMuP3OFG9ePMHGP1ZV1LIqt3W1Speh3MnqdHBNFQGAQRVjrmTWO2lrSOEUiECekRYIoTRZBhKJ38S6OZiVXt27QBMHamqNdxcQpst6r7L3wGKcf+hsgEXhAPCC3xfA7w1183gMKhQCP/v5n+Ornf4VPfvSjPP38dTZv7PPge/okJrC1s8uf/uklil6fOIvpx4adazdYXelw8fRJChWhPGgdoU2EToW5bZiL4LxHieDSDi544iSmE0doFRG6HcbTCbN6xtr6Co31pMZgBbb35jz9zVdZXn2CpXMXyYc/2Jo3gKg7Brz4ieCxonFAInC0/zr/81d+jkfefy9bhyO+9eS3Obl+EqUSjo7GbG/v4GKFN0I/iUnnJUvDAcO8QxGnJKJxdUOaZpgoQilFXwsz22CDwzmL0hql2hCK4xitFGVTocXhWGZ/NqdxEBrH0WSK1sL1vRHf/ua3OPmeB8h670V0QfDS8s7Cyu+cloKHIASEWASo+Y1f/DRZM+Hk8km+/o3n2J9UnDt3nrpquHZ1i2Zek5qIPElZWepzYm2JlcGAbpKRmhgRRZJmKCUIDrCIt6TeUQRPX2sGkWn/xRGFQEZgNU050x9wdjDk7rUN1pIcX9UEpTgalzgxbF3e4rlvPI3oBfkqebNHv5OFBdBY8UQLi3/z0V/i0p9+jQfue4B6Zjk8mNPrDKjmFfN5DcbQLwZ0x55u3qPIU7ppjg6gI4PSGhHBoAi+IQh45wneE2lpU4r3aCdoBKUVLgSUCKY1FitFh65Argx5lvDazgG7ewfsVRXrJwZceeYSo60teht332SgO4/h1hlaR7j+yrd4+dlvUPQH5N0Ol668xOrSAIJh6/JVQgQra2vMJiN6WcFKt0cuBlc3JElCFEfE2iAugAheabQIeIX3vrW0KCJt8CEgotA6weEQramdxQsIlkQJg64hjQu6ymCc42svvcLIe06okvLokN5GG5TybpWWFmFv5xmuvPAYqSvodU9gRRiPp3S6HSbzGaNyQnfQw2hNM6+wvkaJR4vCeo9ojTERRmmM1gRAa43WGpGA0qCURumYoAyIRqsIEYUxMaDQJsLEEWiFKEOcGLI4sNpNeOTBezi93OH61assDTuEevctYO8I8E2G3nn9Ga698gx7+2PSvM9oPMMTUVnH1u4N4n4OSqgmM4ooJ04jgvZYV6OVuuUvYfGfqgUfeh/wOMCjVIyomIBGKYNzDu8axHusrQneohCMjnAh4D3EaUqUJ/SKDh956GE2ljdYXV5ifHCZyk3fAviO0lLTzKimiqXBOZ57+nFmDcSJQkQxmZZUTYOJYiZHI/y8ZHkwoEgSvLe4IK3Vgid48OLx1qONJgSH955IJ4CgUSjRIKDwOFvjQkCCJwDWOYzW+ODBe0QrnBJ0lpBnA973vrMUS8voZMqrL3+blR/4K6T94jZL35FL721dY7B6guGJDfb2N3n9tSuUs5rGNRwd7KODwlcBbzVeNG0mEEIwaLXQZErhnUdEobQmeMArNIYQBIK0OV5BUOC1EEyEDUKQ9jzBoHSC1gYjrdrzDkJT47CsXbyLj/zwJ5kJPPfktzh45eU/W7Vk4oTDwy1eef5pzp49RxTFEGBaTiEE4sjgXUMcp6RZl6qumUxmNNahtWmBiLRZ3YeFK/sFey7eDwHnHHVd473DhUDjW9JUaJIoQStDCG3sG9MyvhGFuMBsMuJwtM3a6bMMVu5DScrR9ku3cs0dAw5AVqTsXHmZ0Y1NqiaQFz16vR7OuoW12lw6nUyZjKfYxnM0OkSCRyu1cClB69aC2hgi3Vp+EdWtkvMeCeAaS/AeUYJJUlAGLwoxGu89Td0gAs458AF8IJbAfHcLOys5d+GDdPtDGnsdsO+StIB6PiampJ5NePmFS+RZj6XhEiY2zMoSs4jHw8N9drZ32D8cUXuHSAA8OtaIgLW2ZUEN1tlFRaOwTYNzjkUk4KW9DSaKCGJoFpftFSit0drgvUeJIgRBghDKCsoZo9EOg+U1+oMVrl97leDrd+/SSmuCEm7cOKBICsTPEbHEUUJkNHlWUJYVyIKMGs9qd5k87qBIUCREOkWJQTB411pFALmpd2/FjyJOE4JSNB58CK1bL9w5aAGtWsN6h0YIztLY1trlaB8IrCyfxs4cvmneHUt7D0pD1imoayFLI5ZXC+q6pJ5V5GmKcoraBXQRgfUsZwXrgyWWe0M6vR6pRERKENVGZAjS5lbvQARjNEoUxiR4HUAJxigQ05ocQaTl8RA8xsQ463HNHJEGFSmcUljn8XNHQOgNV9ndvsS8nlIk/TcAhzdqRb57o0dEUApGeze4/PKzJFlEkeQsL63x8quXmM0qgm9JJHhPCMJSr08vy1FakeUZWZoQo8F5RLWEZa1DxRoVBGstohUmjtEmRhCsb9OPUhrnAiE4nGvlZQiCtb4lMBMDDb6xrWxVisZanLXEccy8mlM3NcWbsKk3F/wiN++k3KY/93eucrD1OmdOryNauHzlMiKGunY0zRt5VWmNdR6tNVEU3ap4nHMtPflAYxtEKXwIOA0+UhBpglEgiiTJSfMOQUVtvN8EqxRKaYQI0C0AD8GCkoASMEnUpjjfcn9wHr0oDVtsgnqzVdvXAuIJ4hbvOcY3rtLt9Mk7HY4Oj7jy6mv42jGbzpjVNV4rmqZBlOCCo5zNF5JRUMYgonDeY5sGa5vWZaMIjCIYhY40iMaKpgoBFSdESY5JcqIkQTSgAo6AR/BBsE7j0QRpWV+IERRRpFGxYfvGDby15J2lWz2qEMJbYzgECGIXbRHN9HCb0dYVhssbXHn1GnlcsL5ssGVFksTMQ6DG4QFvG+auwmpNkqakaYKEQOMs4tobqI1BxRG1azjc38WHgI5iTJZRdCISLSjrMapVcqIjTGzx3lFXDUmco3SE1QbvNd5bKusRiYh0gs5ioiJnc3OTTn8ZY7q3KS3z3S4dQqDlRQ3Awc5Vmvkeg36PJInIi4KqrMFoYqXwzmLrqu1UOEewDYIjzWLi2OCtpW7mIKDjmCiJOJzPuHH9KuX0kMYrRpOSeT1nZdBnfW2NpcGQQbdLGvXxwbeeogVtWuKLIo0oT11BCBGiFXGSIXFKkmbgS8bljLvf/8htRYF8T5ZeEINIC3hytEXRW8J7RR7FVLpkt5yxvLbGdJbSHI3RQXCimFcV3TgmThKyLAECja3QGmyAxluqsubq1hbzckYWpyQSk6R99g52ee21V7n6+qt0O11OnzjBXeffS573iKJWoQVvqesZzjV439bQCMSRQXRg3owZzw5h8zk6/ZyL7/vY9+xL347XBxCPR1B4tHOcvudDPPudP2H3yjZm3nBmdRVT5OiNE2R5zmg8pawt1jsaa1lZXaHTLVAh4H1LUiYI87KkcZ5u1mGjN6CfJShtmFWeM6vrTM6fZXd/l9HuIYf7Ezbjq5w6cR7TywgIIYAXi2sagg/YYGlcze7+hIPZhKNQMrxxmvfeezfnLtxFsXrmLdLye+Thtr3ugWArinSFjbvu4Y8ef4zD1zY501mjc3LIYWNJiDm7vs51vcd4XJFkXQZ5xKCXo6zFWUfwDuU9QcXotMBXFamz7G7e4MVmyihKsKWjY4W14SqDYo0zSyewwVNZx7yek9gYpTRex6AbCiy2rCidZ2+yz+FoStARSsUc7WxyKYn58I/9fdJ05SYp3ZJYbyUtaUNcAQ7Pxt0PoHPD5tVLNE3N6ZOnIUt46dkX2J9MeO/D72FtuMb+/piin7PSz+mmKd46nHNESkiiGEuEswGthPH0gBevbvHZbz7D84dzfvIf/gMe+egP8ewf/B7sbnHxzAm6vQFR4vA4qqYmzwqCBIw29Ltdmp6wfWmTl17eoogLHnjgXk5cOI9VIw68kPZPtLYNfmFi+T4WFkXbsoOgY1Sn4HD7WY6uXifr9Tl59wUuv/Aqymn66ZD97RGrp1fYWB0wq6YsFT3yqMDRtnGCCxArUmVQwTFVis6w4IM/+BDNYIPoT77DyeGA+x58L/7gGpe+/QRHswqvLVnqEOOxVYVJUmIT6AyGjCx89rGv8uyrr3Pq9Bny+ZzZ00/zoxfOce6eh2h2x8RZZ4EnvD3gVvqF1tKLhvvma6+QW0X/zDqlqZiP9jl7Yo3SeSpdkSeKbpFgjKMT56ig2kac0kgUtWWiWLT3ZGmMxB1y4Cd+7KP8+Cc+wu7+Ic9/4TcxjWW938HVlmLQZVruYedTFII0BZkxSHD8h1/7HL/4+f/N6Qvn+ed/+yd4eC3l6nN/zPbhVTrjU0yahLwYLjy2rfjU22lptSjc/OL7rc1XWDq1yriBmoTaN+zubdFdXuPMxgpxaugUGUZbtPa3VFFkYoJYQtmglEW0RozCE1OVFVub1+h2lrg4HFCWU47qOXmcEXUimnqKNHM0gdxoTAj4qmLrxgzE8on3XeTCXQ9QjA7Zn1asDVc4sbqBd567H3jo1uBAaKupm8xlvm9NeKtXCVorShN4/dI29v0p597/Pjr7B1y6fJX4oObc2gUGts/V8R5eWUKmMUkBjcPXloiF3FMBLUKkDCYzlPOG0dEeRw6cD2AUURzR1A12NqbQnjzPSBCCq6nqBpVn/NCHfoAfeVDoRQmTvSuMvePCRz7A+smzTE2HlY312+r5d9mmhX5/DWWF7euvc2n7Mp/8wAc5bx3eBkajPcragYkJvq1wREXoJMfZEitCUJZYNArQHqIguOAp4oRaNN44CB6xDSSCC+BTjSQJQQJV07Syt2roD5dY6cLW1Suk3Q691ZTV9WVOrq9QjTy9C2soleMXN/j22vMOGwB5lmHnc5QWnnv9VXyec+3aDU5urHPyxFmms0Ca9dpUUtu25lUalSZInOCNwYsgSvDeo60nQTASiAgkClIlpCYijQxFkpDGEToyiFJY53CubdqhFOfOnmft1CpOKlw5oZoe8vrlFzncuUYc5W9cuPeIs4sm0h1auGkstTd86CMfZzILPPXis/zul/+ID568yOjGNlVVQy8jTiNE2iJdGY1EGlEgdYyrHd5ZXPCtO2uDC4FYBdIsW1RT0HiPC4BxOJrFNMLgXNO6pQhBKbJ+l3MXz7N74wq2rnFl4MgdkKU1zWxKsmgvSxBC0MibxPQ7WriqKs7e+wHuf+RjDJcSOlnCo198lO3RLt3+EkobXKgRb8nTAq00eEvTzPHi2xIxaLz11PMa7TWomCCGEDxKRSSmj9E9TNLDJCnj8Yi9vV3qsqKpGmxtMVoTicE6ISQxed6h2x0wWFmmOxhS5F1SMfhm/gYNKQXGLJLsHQIuipxef4ODwyNUaDjR79Ppd3np9cvMlccq6BQdvA9kaUGSZC1NBFCi0JHBq1bEREbTOIf1HhXFiEnwQeEVSCQ4PIcHB1y5fBlbW/I4aVs4ITCZTFq2rRwZhvFsyvRghCsrtFIUaUZadPGRuW1jQd40TLgjl75ZTe3f2GFyMCJPEvqDDZZWV5m6ms3rm6zGpzh/5l6UNXhn2yK8cYgx7V2OFL4RamsJSpMsfMyrmIDChppyOqUsK8ajEdW85q5z5+j1etSNpdvrUs5KajzqYAwHU0yeUI4mxD6nCkckfcEMB+ii845LLXd06CgjT1LSJCdOcrpxRp6nZCbm8MYu4f77WFldY3RwhGsaRJpFIIHShkagdg0+aIJr2g6FihHtqZop4/GILM3p93vsJTHj0Yi6mlGWc7JOTmRisqUhTKHZn7B2/wbbTyp0Y/FNg5snOBOTdIa3JaS3AH7bJ9PkjQy2tLTOWr8DJmGwvEy/yHClp9cbMFeOspwRGYMxhuAsrq7auZAxgMf6gPYCEvDOtbMjBdp7fFUSq7Y3FpmIk6fOsLO1RVnOMJEm7I9Q4rkrVQwGy1RhxOSlI4J1WIHIQmg8Ju1iit5tHZybNf7Nr+bNbvvdDb0335+jpkSniqW1DYqlVQpdMJ9XNMHTXeqTZTlVXaF0O8edliU6iohCwHqH8wHl1OK8bkcveObTCc2sJslS5tbRVCVRt0PHrpA1DkRxeDBi/dQqRa/PJFTsbF+mGZVkUYKLoJtm1FFCMlxDmZjvt6AjIm/teLzldWiLgOHJ04TeMhsX7kInXdz+nCgJOD9H64K8yLHO0oS24e5smzvVQqoaownKtaPO2BCMUI6PmM1mGBNjLcz9vO2OuEAwEKc5TSMMN3JMnlEjjMs5Ehuy4RJ63qAjj88ypNOhWD/x9ljeMYZvrngIXLz7L/DSibuJ0wHD1VU2D6+g40CcGOZl2VZiIdB4R900RIs+sa0akjRppaMWxCgwgncV46MDJIqRLIagyYlJkphYNHhPZUtMo6mqhqPJLlZnOGVIo4TIJPgamqakiQOdk+v01k7fkhjyZyKtBac7IE06fODjP8784ADdEebzl+g0gaXBMruHu5SjCcForG3wjUd5RfBtl1GICGKxwWOdxziHD4E0j2ms8OqzryBGMegNSOIYjyLWEbFSaK3JEiEEjzgh7vQZbqwT65it5irlaETeRCydvR8VFfi2j/9nZ+kA6MVi2ul7P0RVl+y+9h20NjTTI5I4wzvP9GCX6NQ6dd0QyoZ5cKRpQhwnNLW9tWBSeUtkPWkao/odypFjmHTYurHFc5evYoImCxGxxMSJIc0jsiwhSyN0GqNpcL2KG9MddrdeJ42gm52gf/K+tgx0b4/qndPSokXSEhokcYag0YliHgVKOycrCmaHRwyWh9jGtmtHUdts94txirW2HYAp3U4SlcJEMXHccObCKZbXBszGE8rRFD+34BTGpDjnqKYl1aQkLgrigWK0d8jLrzxFKoH++gk6Z8+is2FbDmr+7+RhEXUrs7nDEfXhiKyXsnd1F+U9vlaMru8iBKwGbR1KWPSOwVmPeI8AtmloKoU3ARNB8BYTw7CXU6QRjfdUc4d4RR6nKA3BN0gaceY951BZ4Gi+RVTOKVaGZPe02zrKv7N2vAPAgheP4FCigJqj169gRxP0cMBKUbB17Rq1yRDn8VozbSpSC6LiNhycB9euNzRNjQmBWCscLM5ZtHaINkgEOghR6lABmqrCuppBr0NvbYhLKsb1nO7SMtFszvDsRdL1UzhAWw+R3K4l3wmwD34B7I2lFkERELwrmY22iLpdqiji2vXrrMYxiYkYHY2JrKcMAesbmsX4o6nmpMGC8wTRi16KI4ilqloxYjBtp1QbRHsSL6QGlBFKXWInjto6yklNHZWkeUK/M8SmFYML9xPrPg0gJtD6ob5zwDcZbntnkxAa1tfOLbxEQCeMt/cZXriP+5eWGV9+hc3nn2M2b+g7z2jnADoFVgfmdUmKIo5irG03Y6O43b6prEU1DVoniGrztohG0EgQYqXa3+ccqdJEvR5GFNYGVBMwovFxQtIf0jlxDrnpySIL3fA2Lv1mdXWzgPrcZ3+Df/fv/w1RanjogQfp5hn3P/Qw73/gvSwPNGRLNEWX4coJVu96kJeeeJydr3+DppkSZhafwaSuGVdCnjpybYkDGGmIVCBSgq8tRRajAnh8OwHUEUYMvnHtyoNtPUOMQsUG8gQvnqoqcUXB6pn3kCyfbq/6pjJUb935frN8NrLo3foASileePFpfvk//QI7WzuI0lx57nMcTfYoEdZW13nw/gt88kd+lI99/BP0z92DdJa5d+kUGxcfZPMrj7P53NOEUCNRxN5kztFkxno3JraWyHmKLMUT8PUcrVoPiEyEaxyNr4i0Rvt2tJIoQXtFtUiuUZKitEIrweQ9Oqcvgkpx0AadqJsb0t+/CPqZn/3pT4moREk7af/Klx/j8a9+CZEIkRhlcpJ8SBwVTCcVTz71Ir/7+cf48le+xOa16ywPB5y75y5Wzt9D9/QZvDgOb1zDTStCClNbMjtoqCtP5S2iFEmk0O36GbiAkYgguu1o+IALAVTb6jWxAaNpbEOcJmSdDihN99R5Vu77QDthvE0+yq1Z8O1zb0FEav1TP/tTn1KY5GZd9I2vfYUnvv51ghis8zTe4oMn0hpjNP1uj7zbY/P6Dl987Ks8+oXf5vIrL7N+9iwX3/8wK2fOsDzcQEaW/e0tTBIxR3NQNjRVQ91UiNaLhCko3f6eADgRdBQhqj2nTYRK2ulgU9VYb0mKDiQFw/veRzY88bYy8nsctf7ZT//Mp7To5OY7X3rsCzz1zNNoY0BJKxSkZW8fPM57fNOQZxnDYY/RaMJX/vjb/M7/+m3KsuSRD32MU+/9AcyZU/STPkevbNFUM9JBlzooxrM5h7Mai6J2DaiWuZ137faODyhptwaaxoL3+CAEDzYEoiInWjrB+v0PoeP83T7UUut/8emf/pQSkwB4V/O7v/NZjo5GJHmG1lE7pbO2XfENAWebdsLo2+WROO0xWBpwcLDHH3zhMb76xOOcuHCeBx/5MEunzrO8fpLJwQG71zfJOxk6j5nWnoPxnHFVU9sa7xsaZ/GNp64bvPO4xmGtJRCo6/Z13ssJaUZx5m5W73oQTztWEPneRHWzBn7T+7X+9Kc//SkRlQC8+MIz/Mb/+O+MRmNGByOqugGlMEbjnMc2HmcDEtytOaMPgRA8RVHQ60c889SL/M5v/TqdueMDP/RxevdfZO3COaytufbS83S9sDTMUVnE1AcODydUVUVTN8xns3ZteNHH0pHC6AgVhChSqETj8w53ffgvkhTD9uGRm1rhe8Ttm+P3poUlBD8C6YYA/+Qf/10+8+uf4fS5C0RWqBrP3DkiEZSJEDR12eDCnIDDB0ErWWzTSUsyRrN7sMvRwZy/9Vf/Gv/q5/81J06f5/rmNle/8TWe//3f4+DwEmolY64LmnlMU87BT0kjRxLFDIs+WRJjVbslFOaG7lKP9QtnufejP8qJ9zyEI6C8grcXVm99bsk5O1JKd4+O9vnJv/d38DiK3pDICjs7+2wdHGCrOWVZ4Vy7SmhDTVXXSBC01kAbd6I0PjhEoKoarl3b5r677+a//upneP8DD7O9c4PD/dd5+Ytf4sZzTyFxg046VFohiUFoVV6RF3TynCCWqL/E6qn7GG6c5OT5C3T7K9SABEfk1RsmvlPA1tqgtebJJ7/KL/3ifwQXmE5miIOj8YxJUxKnMU1pGU/G7RTAWsqypCxLmqZBL9aTlJJbzzbd1KWXLl1lqTfgv/3ar/OBv/gxrm2/xrCJ2XvhBZ5/6ss0RzuYPMJpRafTodfv0xn0yDsZ/VPnOfPQD98mCD0LocJi55p3BRgJIVwbT/a6P/fz/5Lnn32ePOmhEFzZtMOuaopTFlr9T1NbnG9Bz+dzZrMZZVlinW2tvBipKKPxPqBUzJVLr1HkBb/yy/+ZDz3yYXZGB2RFF7e/z+Y3/ohm9zKiIIpism5Ot98hSjWrD32C5bsfvjXFVMFD8O1jCbKQn/KuWHosx39P6xjwMeBjwMeAjwEfAz4GfAz4GPAx4GPAx4CPAR8DPgZ8DPgY8P9jx/8ZACDJ4XXTWLjbAAAAAElFTkSuQmCC';

    var throwCard = function ( x, y ) {

        id > 0 ? id -- : id = 51;

        var particle = new Particle( id, x, y, Math.floor( Math.random() * 6 - 3 ) * 2, - Math.random() * 16 );
        particles.push( particle );

    }

    document.addEventListener( 'mousedown', function ( event ) {

        event.preventDefault();

        document.addEventListener( 'mousemove', onMouseMove, false );

    }, false );

    document.addEventListener( 'mouseup', function ( event ) {

        event.preventDefault();

        throwCard( event.clientX, event.clientY );

        document.removeEventListener( 'mousemove', onMouseMove, false );

    }, false );

    function onMouseMove( event ) {

        event.preventDefault();

        throwCard( event.clientX, event.clientY );

    }

    document.addEventListener( 'touchstart', function ( event ) {

        event.preventDefault();

        for ( var i = 0; i < event.changedTouches.length; i ++ ) {

            throwCard( event.changedTouches[ 0 ].pageX, event.changedTouches[ 0 ].pageY );

        }

    }, false );

    document.addEventListener( 'touchmove', function ( event ) {

        event.preventDefault();

        for ( var i = 0; i < event.touches.length; i ++ ) {

            throwCard( event.touches[ i ].pageX, event.touches[ i ].pageY );

        }

    }, false );

    setInterval( function () {

        var i = 0, l = particles.length;

        while ( i < l ) {

            particles[ i ].update() ? i ++ : l --;

        }

    }, 1000 / 60 );    
};
},{}]},{},[1]);
