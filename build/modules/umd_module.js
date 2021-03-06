import bean from "bean";
import zest from "zest";
import { Controller } from "ng-harmony-core";
import { Log, NotImplementedError, MissingBehaviourError, BehaviourError, StateTransitionError } from "ng-harmony-log";
import "ng-harmony-decorator";

export let EventedController = class EventedController extends Controller {
	constructor(...args) {
		super(...args);

		this.constructor.EVENTS.forEach(behaviour => {
			for (let [i, el] of behaviour.ev.selector ? zest(behaviour.ev.selector, this.$element[0]).entries() : [this.$element[0]].entries()) {
				this._closurize((_key, _fn, _el, _i) => {
					let __fn = (...args) => {
						this._preEventedFunction(_key, args[0], _el);
						this[_fn](_el, ...args);
						this._postEventedFunction(_key, args[0], _el, _fn);
					};
					bean.on(_el, behaviour.ev.type, behaviour.ev.delegate || __fn, behaviour.ev.delegate ? __fn : null);
				}, this, behaviour.ev, behaviour.fn, el, i);
				this._digest();
			}
		});
	}
	_preEventedFunction(descriptor, ev, el) {
		if (descriptor.delegate) {
			let nodes = zest(descriptor.delegate, this.$element[0]).entries();
			for (let [$n, node] of nodes) {
				if (ev.currentTarget.isEqualNode(node)) {
					this.$scope.$n = $n;
					break;
				}
			};
		} else {
			let _el = ev.currentTarget;
			let list = Array.prototype.slice.call(_el.parentNode.children);
			this.$scope.$n = list.indexOf(_el);
		}
	}
	_postEventedFunction(descriptor, ev, el, triggerFn) {
		this._emit(triggerFn, descriptor, { ev, el, $n: this.$scope.$n });
	}
	_emit(triggerFn, descriptor, opts) {
		this.$scope.$emit("change", {
			scope: this,
			triggerFn: triggerFn,
			triggerTokens: descriptor,
			ev: opts.ev,
			el: opts.el,
			$n: opts.$n
		});
	}
};
EventedController.$inject = ["$element", "$timeout"];

//# sourceMappingURL=umd_module.js.map