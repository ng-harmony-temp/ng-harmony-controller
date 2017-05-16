# Ng-Harmony
============

## Development

A Controller collection for different purposes ...

![Harmony = 6 + 7;](logo.png "Harmony - Fire in my eyes")

## Concept

    * Advanced Controller with In-Controller Eventing.
    * RoutingController for use with ngh-modules utilizing `angular-ui-router`
    * StatefulController ... a Redux like state-mechanism. But not single super-state, but each and every Controller knows its own stuff ... intercommunication mechanisms ...
    * DataController ... integration of ngh-model with it's dedicated validation-models and AJAX-Services

Use it in conjunction with

    * [literate-programming](http://npmjs.org/packages/literate-programming "click for npm-package-homepage") to write markdown-flavored literate JS, HTML and CSS
    * [jspm](https://www.npmjs.com/package/jspm "click for npm-package-homepage") for a nice solution to handle npm-modules with ES6-Module-Format-Loading ...

## Files

This serves as literate-programming compiler-directive

[build/index.js](#Compilation "save:")

## Compilation

```javascript
import "angular";
import "angular-router";
import bean from "fat/bean";
import zest from "zest";
import { Controller } from "ng-harmony-core";
import { Log, NotImplementedError, MissingBehaviourError, BehaviourError, StateTransitionError } from "ng-harmony-log";
import "ng-harmony-decorator";
```

The EventedController ...
Basically, you decouple the event-listening from your html and put it into your controller, right where the action is.

Please use in conjunction with the Event-method-decorator, like so:

```javascript
class MyCtrl extends EventedController {
    @Evented(
        //you can specify a delegator
        //sometimes it's necessary that the delegate isn't the same element as the ng-repeated one
        //this is necessary in order to provide $scope.n -> your nth-clicked element
    {
        selector: "#myComp > ul.myList",
        type: "click",
        delegate: "a.superlink",
        repeatable: "li.button"
    }, {
        //you can specify various events on a method
        //the only really necessary item is the even source type
        type: "hover"
    })
    mySuperMethod () {
        console.log("You clicked the" + this.$scope.n + " item");
        //oops, should do some handling of the different events above
    }
}
`

```javascript
export class EventedController extends Controller {
	constructor(...args) {
		super(...args);

	    this.constructor.EVENTS.forEach((behaviour) => {
			for (let [i, el] of (behaviour.ev.selector ?
					zest(behaviour.ev.selector, this.$element.context).entries() :
					[this.$element.context].entries())) {
				this._closurize((_key, _fn, _el, _i) => {
					let __fn = (...args) => {
						this._preEventedFunction(args[0], _el, _i, behaviour.ev);
						_fn(_el, _i, ...args);
						this._postEventedFunction(_key, _fn, _el, _i, behaviour.ev);
					}
					bean.on(el, behaviour.ev.type, behaviour.ev.delegate || _fn, behaviour.ev.delegate ? _fn : null);
				}, this, behaviour.ev, behaviour.fn, el, i);
				this._digest();
			}
		});
	}
	_preEventedFunction (descriptor, ev, ...args) {
        if (!this._isVoid(descriptor.delegate)) {
			let el = ev.currentTarget.parentNode;
			while (!zest.matches(el, descriptor.delegate)) { el = el.parentNode; }
			let list = Array.prototype.slice.call(el.parentNode.children);
			this.$scope.n = list.indexOf(el);
		} else {
			let el = ev.currentTarget;
			let list = Array.prototype.slice.call(el.parentNode.children);
			this.$scope.n = list.indexOf(el);
		}
	}
	_postEventedFunction (key, fn, el, i, descriptor) {
        this.log({
            name: "User Interaction processed ...",
            message: "Method _" + key + "_ was triggered"
        })
		this._emit(key, descriptor);
	}
	_emit (triggerFn, descriptor) {
		this.$scope.$emit("change", {
			scope: this,
			triggerFn: triggerFn,
			triggerTokens: descriptor
		});
	}
}
EventedController.$inject = ["$element", "$timeout"];
```

## CHANGELOG

*0.0.2* Minimalism - getting rid of everything too fancy
*0.0.1* Migration - the beginnings of a complete rewrite of the behaviour-paradigm to decorators ...

## MIGRATION CHANGELOG ng-harmony

*0.2.1* Add conditional initialize call to default base-constructor for better mixin-support

*0.3.2* About to pick up development again, new logo

*<0.4* Debuggin for [demo todo-mvc page on github.io](http://ng-harmony.github.io/ng-harmony)

*0.4.4* Enhancing mixing in with constructor-mixin-support ... mixin-constructors get called in Harmony-super-constructor

*0.4.5* Practical difficulties with mixing constructors, getting rid of it again

*0.4.6* Correcting Mixin plus adding Implement (Interface support), tweaking .babelrc