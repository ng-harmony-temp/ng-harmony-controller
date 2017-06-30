# Ng-Harmony
============

## Development

A Controller collection for different purposes ...

![Harmony = 6 + 7;](./logo.png)

## Concept

    * Advanced Controller with In-Controller Eventing.

Use it in conjunction with

    * [literate-programming](http://npmjs.org/packages/literate-programming "click for npm-package-homepage") to write markdown-flavored literate JS, HTML and CSS
    * [jspm](https://www.npmjs.com/package/jspm "click for npm-package-homepage") for a nice solution to handle npm-modules with ES6-Module-Format-Loading ...

## Files

This serves as literate-programming compiler-directive

[build/index.js](#Compilation "save:")

## Compilation

```javascript
import bean from "bean";
import zest from "zest";
import { Controller } from "ng-harmony-core";
import { Log, NotImplementedError, MissingBehaviourError, BehaviourError, StateTransitionError } from "ng-harmony-log";
import "ng-harmony-decorator";
```

The EventedController ...
Basically, you decouple the event-listening from your html and put it into your controller, right where the action is.

Please use in conjunction with the Event-method-decorator, like so:

```javascript
export class EventedController extends Controller {
	constructor(...args) {
		super(...args);

	    this.constructor.EVENTS.forEach((behaviour) => {
			for (let [i, el] of (behaviour.ev.selector ?
					zest(behaviour.ev.selector, this.$element[0]).entries() :
					[this.$element[0]].entries())) {
				this._closurize((_key, _fn, _el, _i) => {
					let __fn = (...args) => {
						this._preEventedFunction(_key, args[0], _el, $n);
						_fn(_el, $n, ...args);
						this._postEventedFunction(_key, args[0], _el, $n, _fn.name);
					}
					bean.on(_el, behaviour.ev.type, behaviour.ev.delegate || __fn, behaviour.ev.delegate ? __fn : null);
				}, this, behaviour.ev, this[behaviour.fn], el, i);
				this._digest();
			}
		});
	}
	_preEventedFunction (descriptor, ev, el, $n) {
		if (descriptor.delegate) {
			let nodes = zest(descriptor.delegate, this.$element[0].entries());
			nodes.forEach((node, $n) => {
				if (ev.currentTarget.isEqualNode(node)) {
					this.$scope.$n = $n;
					return false;
				}
			});
		}
		else {
			let _el = ev.currentTarget;
			let list = Array.prototype.slice.call(_el.parentNode.children);
			this.$scope.$n = list.indexOf(_el);
		}
	}
	_postEventedFunction (descriptor, ev, el, $n, triggerFn) {
		this._emit(triggerFn, descriptor, { ev, el, $n });
	}
	_emit (triggerFn, descriptor, opts) {
		this.$scope.$emit("change", {
			scope: this,
			triggerFn: triggerFn,
			triggerTokens: descriptor,
			ev: opts.ev,
			el: opts.el,
			$n: opts.$n
		});
	}
}
EventedController.$inject = ["$element", "$timeout"];
```

## CHANGELOG
*0.0.3* Publish Bump
*0.0.2* Minimalism - getting rid of everything too fancy
*0.0.1* Migration - the beginnings of a complete rewrite of the behaviour-paradigm to decorators ...

## MIGRATION CHANGELOG ng-harmony

*0.2.1* Add conditional initialize call to default base-constructor for better mixin-support

*0.3.2* About to pick up development again, new logo

*<0.4* Debuggin for [demo todo-mvc page on github.io](http://ng-harmony.github.io/ng-harmony)

*0.4.4* Enhancing mixing in with constructor-mixin-support ... mixin-constructors get called in Harmony-super-constructor

*0.4.5* Practical difficulties with mixing constructors, getting rid of it again

*0.4.6* Correcting Mixin plus adding Implement (Interface support), tweaking .babelrc
