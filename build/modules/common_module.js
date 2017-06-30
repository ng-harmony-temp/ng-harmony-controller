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
						if (_key.delegate) {
							let nodes = zest(_key.delegate, this.$element[0].entries());
							nodes.forEach((node, $n) => {
								if (args[0].currentTarget.isEqualNode(node)) {
									this.$scope.$n = $n;
								}
							});
						}
						this._preEventedFunction(_key, args[0], _el, $n);
						_fn(_el, $n, ...args);
						this._postEventedFunction(_key, args[0], _el, $n, _fn.name);
					};
					bean.on(_el, behaviour.ev.type, behaviour.ev.delegate || __fn, behaviour.ev.delegate ? __fn : null);
				}, this, behaviour.ev, this[behaviour.fn], el, i);
				this._digest();
			}
		});
	}
	_preEventedFunction(descriptor, ev, el, $n) {
		if (!this._isVoid(descriptor.delegate)) {
			let el = ev.currentTarget.parentNode;
			while (!zest.matches(el, descriptor.delegate)) {
				el = el.parentNode;
			}
			let list = Array.prototype.slice.call(el.parentNode.children);
			this.$scope.n = list.indexOf(el);
		} else {
			let el = ev.currentTarget;
			let list = Array.prototype.slice.call(el.parentNode.children);
			this.$scope.n = list.indexOf(el);
		}
	}
	_postEventedFunction(descriptor, ev, el, $n, triggerFn) {
		this._emit(triggerFn, descriptor, { ev, el, $n });
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

//# sourceMappingURL=common_module.js.map