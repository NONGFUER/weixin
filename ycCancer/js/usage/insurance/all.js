function Swipe(t, e) {
	function n(t, e) {
		if(Math.abs(e) < f.iniT && Math.abs(t) > f.iniL) {
			var n = 0 > t ? "left" : "right";
			return n
		}
		return !1
	}

	function i(t, e) {
		return t < f.bL || t > f.bRb || e < f.bT || e > f.bBb
	}

	function o(t) {
		return 180 * Math.atan(t) / Math.PI
	}

	function r(t, e) {
		return Math.sqrt(Math.pow(t, 2) + Math.pow(e, 2))
	}

	function a(t, e) {
		if(e)
			for(var i in e) f.setAttr(i, e[i]);
		else {
			var r = new Date;
			f.endX = t.pageX, f.endY = t.pageY, f.endTime = r.getTime(), f.duration = f.endTime - f.startTime, f.mX = t.pageX - f.startX, f.mY = t.pageY - f.startY, f.direction = n(f.mX, f.mY), f.angle = o(f.mY / f.mX)
		}
	}

	function c(t) {
		if(f.tLen = t.touches.length, f.tLen > 1) {
			var e = t.touches[0],
				n = t.touches[1],
				i = n.pageX - e.pageX,
				a = n.pageY - e.pageY,
				c = o(a / i),
				s = r(i, a);
			f.mutiTouch ? (f.gEndDis = s, f.gEndAngle = c, f.scale = s / f.gStartDis, f.rotation = c - f.gStartAngle) : (f.gStartDis = s, f.gStartAngle = c), f.mutiTouch = !0
		} else f.mutiTouch = !1
	}

	function s(t) {
		var e = t.touches[0],
			n = new Date,
			i = {
				startX: e.pageX,
				startY: e.pageY,
				startTime: n.getTime(),
				identifier: e.identifier
			};
		a(e, i), f.touch = !0, "function" == typeof f.sCallback && f.sCallback(f)
	}

	function u(t) {
		var e = t.touches[0];
		return i(e.pageX, e.pageY) ? (f.touch = !1, !1) : (f.touch && (a(e), c(t), "function" == typeof f.mCallback && f.mCallback(f)), void(Math.abs(f.angle) < f.iniAngle && t.preventDefault()))
	}

	function l(t) {
		f.touch = !1, f.mutiTouch = !1, "function" == typeof f.eCallback && f.eCallback(f)
	}
	var f = {
		self: t,
		count: 0,
		speed: 300,
		iniL: 30,
		iniT: 30,
		iniAngle: 30,
		touch: !1,
		mutiTouch: !1,
		setAttr: function(t, e) {
			f[t] = e
		}
	};
	! function() {
		_this = f.self;
		for(var t in e) f[t] = e[t];
		var n = _this.offset();
		f.bL = n.left, f.bT = n.top, f.bW = _this.width(), f.bH = _this.height(), f.bRb = f.bL + f.bW, f.bBb = f.bT + f.bH, f.total = _this.children().children().length
	}(), f.vendor = /webkit/i.test(navigator.appVersion) ? "webkit" : /firefox/i.test(navigator.userAgent) ? "Moz" : "opera" in window ? "O" : "", f.has3d = "WebKitCSSMatrix" in window && "m11" in new WebKitCSSMatrix, f.hasTouch = "ontouchstart" in window, f.hasTransform = f.vendor + "Transform" in document.documentElement.style, "function" == typeof f.beforeCallback && f.beforeCallback(f), _this.die("touchstart,touchmove,touchend"), _this.get(0).addEventListener("touchstart", s), _this.get(0).addEventListener("touchmove", u), _this.get(0).addEventListener("touchend", l), "function" == typeof f.afterCallback && f.afterCallback(f)
}

function imgScrollRequest(t) {
	var e = "undefined" != typeof arguments[1] ? arguments[1] : !1;
	$(t).each(function() {
		var t = $(this);
		if(t.attr("_src")) {
			if(e) return void t.attr("src", t.attr("_src")).removeAttr("_src");
			$.visible(t) && t.attr("src", t.attr("_src")).removeAttr("_src")
		}
	})
}

function androindDeleteHeader() {
	$("header").remove()
}

function reloadWebView() {
	location.reload()
}! function(t) {
	String.prototype.trim === t && (String.prototype.trim = function() {
		return this.replace(/^\s+|\s+$/g, "")
	}), Array.prototype.reduce === t && (Array.prototype.reduce = function(e) {
		if(void 0 === this || null === this) throw new TypeError;
		var n, i = Object(this),
			o = i.length >>> 0,
			r = 0;
		if("function" != typeof e) throw new TypeError;
		if(0 == o && 1 == arguments.length) throw new TypeError;
		if(arguments.length >= 2) n = arguments[1];
		else
			for(;;) {
				if(r in i) {
					n = i[r++];
					break
				}
				if(++r >= o) throw new TypeError
			}
		for(; o > r;) r in i && (n = e.call(t, n, i[r], r, i)), r++;
		return n
	})
}();
var Zepto = function() {
	function t(t) {
		return null == t ? String(t) : X[W.call(t)] || "object"
	}

	function e(e) {
		return "function" == t(e)
	}

	function n(t) {
		return null != t && t == t.window
	}

	function i(t) {
		return null != t && t.nodeType == t.DOCUMENT_NODE
	}

	function o(e) {
		return "object" == t(e)
	}

	function r(t) {
		return o(t) && !n(t) && t.__proto__ == Object.prototype
	}

	function a(t) {
		return t instanceof Array
	}

	function c(t) {
		return "number" == typeof t.length
	}

	function s(t) {
		return M.call(t, function(t) {
			return null != t
		})
	}

	function u(t) {
		return t.length > 0 ? T.fn.concat.apply([], t) : t
	}

	function l(t) {
		return t.replace(/::/g, "/").replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2").replace(/([a-z\d])([A-Z])/g, "$1_$2").replace(/_/g, "-").toLowerCase()
	}

	function f(t) {
		return t in N ? N[t] : N[t] = new RegExp("(^|\\s)" + t + "(\\s|$)")
	}

	function d(t, e) {
		return "number" != typeof e || O[l(t)] ? e : e + "px"
	}

	function h(t) {
		var e, n;
		return P[t] || (e = A.createElement(t), A.body.appendChild(e), n = D(e, "").getPropertyValue("display"), e.parentNode.removeChild(e), "none" == n && (n = "block"), P[t] = n), P[t]
	}

	function p(t) {
		return "children" in t ? j.call(t.children) : T.map(t.childNodes, function(t) {
			return 1 == t.nodeType ? t : void 0
		})
	}

	function m(t, e, n) {
		for(C in e) n && (r(e[C]) || a(e[C])) ? (r(e[C]) && !r(t[C]) && (t[C] = {}), a(e[C]) && !a(t[C]) && (t[C] = []), m(t[C], e[C], n)) : e[C] !== k && (t[C] = e[C])
	}

	function v(t, e) {
		return e === k ? T(t) : T(t).filter(e)
	}

	function g(t, n, i, o) {
		return e(n) ? n.call(t, i, o) : n
	}

	function b(t, e, n) {
		null == n ? t.removeAttribute(e) : t.setAttribute(e, n)
	}

	function w(t, e) {
		var n = t.className,
			i = n && n.baseVal !== k;
		return e === k ? i ? n.baseVal : n : void(i ? n.baseVal = e : t.className = e)
	}

	function y(t) {
		var e;
		try {
			return t ? "true" == t || ("false" == t ? !1 : "null" == t ? null : isNaN(e = Number(t)) ? /^[\[\{]/.test(t) ? T.parseJSON(t) : t : e) : t
		} catch(n) {
			return t
		}
	}

	function x(t, e) {
		e(t);
		for(var n in t.childNodes) x(t.childNodes[n], e)
	}
	var k, C, T, _, E, S, $ = [],
		j = $.slice,
		M = $.filter,
		A = window.document,
		P = {},
		N = {},
		D = A.defaultView.getComputedStyle,
		O = {
			"column-count": 1,
			columns: 1,
			"font-weight": 1,
			"line-height": 1,
			opacity: 1,
			"z-index": 1,
			zoom: 1
		},
		I = /^\s*<(\w+|!)[^>]*>/,
		L = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
		Z = /^(?:body|html)$/i,
		F = ["val", "css", "html", "text", "data", "width", "height", "offset"],
		H = ["after", "prepend", "before", "append"],
		q = A.createElement("table"),
		B = A.createElement("tr"),
		R = {
			tr: A.createElement("tbody"),
			tbody: q,
			thead: q,
			tfoot: q,
			td: B,
			th: B,
			"*": A.createElement("div")
		},
		U = /complete|loaded|interactive/,
		z = /^\.([\w-]+)$/,
		Y = /^#([\w-]*)$/,
		V = /^[\w-]+$/,
		X = {},
		W = X.toString,
		J = {},
		G = A.createElement("div");
	return J.matches = function(t, e) {
		if(!t || 1 !== t.nodeType) return !1;
		var n = t.webkitMatchesSelector || t.mozMatchesSelector || t.oMatchesSelector || t.matchesSelector;
		if(n) return n.call(t, e);
		var i, o = t.parentNode,
			r = !o;
		return r && (o = G).appendChild(t), i = ~J.qsa(o, e).indexOf(t), r && G.removeChild(t), i
	}, E = function(t) {
		return t.replace(/-+(.)?/g, function(t, e) {
			return e ? e.toUpperCase() : ""
		})
	}, S = function(t) {
		return M.call(t, function(e, n) {
			return t.indexOf(e) == n
		})
	}, J.fragment = function(t, e, n) {
		t.replace && (t = t.replace(L, "<$1></$2>")), e === k && (e = I.test(t) && RegExp.$1), e in R || (e = "*");
		var i, o, a = R[e];
		return a.innerHTML = "" + t, o = T.each(j.call(a.childNodes), function() {
			a.removeChild(this)
		}), r(n) && (i = T(o), T.each(n, function(t, e) {
			F.indexOf(t) > -1 ? i[t](e) : i.attr(t, e)
		})), o
	}, J.Z = function(t, e) {
		return t = t || [], t.__proto__ = T.fn, t.selector = e || "", t
	}, J.isZ = function(t) {
		return t instanceof J.Z
	}, J.init = function(t, n) {
		if(!t) return J.Z();
		if(e(t)) return T(A).ready(t);
		if(J.isZ(t)) return t;
		var i;
		if(a(t)) i = s(t);
		else if(o(t)) i = [r(t) ? T.extend({}, t) : t], t = null;
		else if(I.test(t)) i = J.fragment(t.trim(), RegExp.$1, n), t = null;
		else {
			if(n !== k) return T(n).find(t);
			i = J.qsa(A, t)
		}
		return J.Z(i, t)
	}, T = function(t, e) {
		return J.init(t, e)
	}, T.extend = function(t) {
		var e, n = j.call(arguments, 1);
		return "boolean" == typeof t && (e = t, t = n.shift()), n.forEach(function(n) {
			m(t, n, e)
		}), t
	}, J.qsa = function(t, e) {
		var n;
		return i(t) && Y.test(e) ? (n = t.getElementById(RegExp.$1)) ? [n] : [] : 1 !== t.nodeType && 9 !== t.nodeType ? [] : j.call(z.test(e) ? t.getElementsByClassName(RegExp.$1) : V.test(e) ? t.getElementsByTagName(e) : t.querySelectorAll(e))
	}, T.contains = function(t, e) {
		return t !== e && t.contains(e)
	}, T.type = t, T.isFunction = e, T.isWindow = n, T.isArray = a, T.isPlainObject = r, T.isEmptyObject = function(t) {
		var e;
		for(e in t) return !1;
		return !0
	}, T.inArray = function(t, e, n) {
		return $.indexOf.call(e, t, n)
	}, T.camelCase = E, T.trim = function(t) {
		return t.trim()
	}, T.uuid = 0, T.support = {}, T.expr = {}, T.map = function(t, e) {
		var n, i, o, r = [];
		if(c(t))
			for(i = 0; i < t.length; i++) n = e(t[i], i), null != n && r.push(n);
		else
			for(o in t) n = e(t[o], o), null != n && r.push(n);
		return u(r)
	}, T.each = function(t, e) {
		var n, i;
		if(c(t)) {
			for(n = 0; n < t.length; n++)
				if(e.call(t[n], n, t[n]) === !1) return t
		} else
			for(i in t)
				if(e.call(t[i], i, t[i]) === !1) return t;
		return t
	}, T.grep = function(t, e) {
		return M.call(t, e)
	}, window.JSON && (T.parseJSON = JSON.parse), T.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(t, e) {
		X["[object " + e + "]"] = e.toLowerCase()
	}), T.fn = {
		forEach: $.forEach,
		reduce: $.reduce,
		push: $.push,
		sort: $.sort,
		indexOf: $.indexOf,
		concat: $.concat,
		map: function(t) {
			return T(T.map(this, function(e, n) {
				return t.call(e, n, e)
			}))
		},
		slice: function() {
			return T(j.apply(this, arguments))
		},
		ready: function(t) {
			return U.test(A.readyState) ? t(T) : A.addEventListener("DOMContentLoaded", function() {
				t(T)
			}, !1), this
		},
		get: function(t) {
			return t === k ? j.call(this) : this[t >= 0 ? t : t + this.length]
		},
		toArray: function() {
			return this.get()
		},
		size: function() {
			return this.length
		},
		remove: function() {
			return this.each(function() {
				null != this.parentNode && this.parentNode.removeChild(this)
			})
		},
		each: function(t) {
			return $.every.call(this, function(e, n) {
				return t.call(e, n, e) !== !1
			}), this
		},
		filter: function(t) {
			return e(t) ? this.not(this.not(t)) : T(M.call(this, function(e) {
				return J.matches(e, t)
			}))
		},
		add: function(t, e) {
			return T(S(this.concat(T(t, e))))
		},
		is: function(t) {
			return this.length > 0 && J.matches(this[0], t)
		},
		not: function(t) {
			var n = [];
			if(e(t) && t.call !== k) this.each(function(e) {
				t.call(this, e) || n.push(this)
			});
			else {
				var i = "string" == typeof t ? this.filter(t) : c(t) && e(t.item) ? j.call(t) : T(t);
				this.forEach(function(t) {
					i.indexOf(t) < 0 && n.push(t)
				})
			}
			return T(n)
		},
		has: function(t) {
			return this.filter(function() {
				return o(t) ? T.contains(this, t) : T(this).find(t).size()
			})
		},
		eq: function(t) {
			return -1 === t ? this.slice(t) : this.slice(t, +t + 1)
		},
		first: function() {
			var t = this[0];
			return t && !o(t) ? t : T(t)
		},
		last: function() {
			var t = this[this.length - 1];
			return t && !o(t) ? t : T(t)
		},
		find: function(t) {
			var e, n = this;
			return e = "object" == typeof t ? T(t).filter(function() {
				var t = this;
				return $.some.call(n, function(e) {
					return T.contains(e, t)
				})
			}) : 1 == this.length ? T(J.qsa(this[0], t)) : this.map(function() {
				return J.qsa(this, t)
			})
		},
		closest: function(t, e) {
			var n = this[0],
				o = !1;
			for("object" == typeof t && (o = T(t)); n && !(o ? o.indexOf(n) >= 0 : J.matches(n, t));) n = n !== e && !i(n) && n.parentNode;
			return T(n)
		},
		parents: function(t) {
			for(var e = [], n = this; n.length > 0;) n = T.map(n, function(t) {
				return(t = t.parentNode) && !i(t) && e.indexOf(t) < 0 ? (e.push(t), t) : void 0
			});
			return v(e, t)
		},
		parent: function(t) {
			return v(S(this.pluck("parentNode")), t)
		},
		children: function(t) {
			return v(this.map(function() {
				return p(this)
			}), t)
		},
		contents: function() {
			return this.map(function() {
				return j.call(this.childNodes)
			})
		},
		siblings: function(t) {
			return v(this.map(function(t, e) {
				return M.call(p(e.parentNode), function(t) {
					return t !== e
				})
			}), t)
		},
		empty: function() {
			return this.each(function() {
				this.innerHTML = ""
			})
		},
		pluck: function(t) {
			return T.map(this, function(e) {
				return e[t]
			})
		},
		show: function() {
			return this.each(function() {
				"none" == this.style.display && (this.style.display = null), "none" == D(this, "").getPropertyValue("display") && (this.style.display = h(this.nodeName))
			})
		},
		replaceWith: function(t) {
			return this.before(t).remove()
		},
		wrap: function(t) {
			var n = e(t);
			if(this[0] && !n) var i = T(t).get(0),
				o = i.parentNode || this.length > 1;
			return this.each(function(e) {
				T(this).wrapAll(n ? t.call(this, e) : o ? i.cloneNode(!0) : i)
			})
		},
		wrapAll: function(t) {
			if(this[0]) {
				T(this[0]).before(t = T(t));
				for(var e;
					(e = t.children()).length;) t = e.first();
				T(t).append(this)
			}
			return this
		},
		wrapInner: function(t) {
			var n = e(t);
			return this.each(function(e) {
				var i = T(this),
					o = i.contents(),
					r = n ? t.call(this, e) : t;
				o.length ? o.wrapAll(r) : i.append(r)
			})
		},
		unwrap: function() {
			return this.parent().each(function() {
				T(this).replaceWith(T(this).children())
			}), this
		},
		clone: function() {
			return this.map(function() {
				return this.cloneNode(!0)
			})
		},
		hide: function() {
			return this.css("display", "none")
		},
		toggle: function(t) {
			return this.each(function() {
				var e = T(this);
				(t === k ? "none" == e.css("display") : t) ? e.show(): e.hide()
			})
		},
		prev: function(t) {
			return T(this.pluck("previousElementSibling")).filter(t || "*")
		},
		next: function(t) {
			return T(this.pluck("nextElementSibling")).filter(t || "*")
		},
		html: function(t) {
			return t === k ? this.length > 0 ? this[0].innerHTML : null : this.each(function(e) {
				var n = this.innerHTML;
				T(this).empty().append(g(this, t, e, n))
			})
		},
		text: function(t) {
			return t === k ? this.length > 0 ? this[0].textContent : null : this.each(function() {
				this.textContent = t
			})
		},
		attr: function(t, e) {
			var n;
			return "string" == typeof t && e === k ? 0 == this.length || 1 !== this[0].nodeType ? k : "value" == t && "INPUT" == this[0].nodeName ? this.val() : !(n = this[0].getAttribute(t)) && t in this[0] ? this[0][t] : n : this.each(function(n) {
				if(1 === this.nodeType)
					if(o(t))
						for(C in t) b(this, C, t[C]);
					else b(this, t, g(this, e, n, this.getAttribute(t)))
			})
		},
		removeAttr: function(t) {
			return this.each(function() {
				1 === this.nodeType && b(this, t)
			})
		},
		prop: function(t, e) {
			return e === k ? this[0] && this[0][t] : this.each(function(n) {
				this[t] = g(this, e, n, this[t])
			})
		},
		data: function(t, e) {
			var n = this.attr("data-" + l(t), e);
			return null !== n ? y(n) : k
		},
		val: function(t) {
			return t === k ? this[0] && (this[0].multiple ? T(this[0]).find("option").filter(function(t) {
				return this.selected
			}).pluck("value") : this[0].value) : this.each(function(e) {
				this.value = g(this, t, e, this.value)
			})
		},
		offset: function(t) {
			if(t) return this.each(function(e) {
				var n = T(this),
					i = g(this, t, e, n.offset()),
					o = n.offsetParent().offset(),
					r = {
						top: i.top - o.top,
						left: i.left - o.left
					};
				"static" == n.css("position") && (r.position = "relative"), n.css(r)
			});
			if(0 == this.length) return null;
			var e = this[0].getBoundingClientRect();
			return {
				left: e.left + window.pageXOffset,
				top: e.top + window.pageYOffset,
				width: Math.round(e.width),
				height: Math.round(e.height)
			}
		},
		css: function(e, n) {
			if(arguments.length < 2 && "string" == typeof e) return this[0] && (this[0].style[E(e)] || D(this[0], "").getPropertyValue(e));
			var i = "";
			if("string" == t(e)) n || 0 === n ? i = l(e) + ":" + d(e, n) : this.each(function() {
				this.style.removeProperty(l(e))
			});
			else
				for(C in e) e[C] || 0 === e[C] ? i += l(C) + ":" + d(C, e[C]) + ";" : this.each(function() {
					this.style.removeProperty(l(C))
				});
			return this.each(function() {
				this.style.cssText += ";" + i
			})
		},
		index: function(t) {
			return t ? this.indexOf(T(t)[0]) : this.parent().children().indexOf(this[0])
		},
		hasClass: function(t) {
			return $.some.call(this, function(t) {
				return this.test(w(t))
			}, f(t))
		},
		addClass: function(t) {
			return this.each(function(e) {
				_ = [];
				var n = w(this),
					i = g(this, t, e, n);
				i.split(/\s+/g).forEach(function(t) {
					T(this).hasClass(t) || _.push(t)
				}, this), _.length && w(this, n + (n ? " " : "") + _.join(" "))
			})
		},
		removeClass: function(t) {
			return this.each(function(e) {
				return t === k ? w(this, "") : (_ = w(this), g(this, t, e, _).split(/\s+/g).forEach(function(t) {
					_ = _.replace(f(t), " ")
				}), w(this, _.trim()), void 0)
			})
		},
		toggleClass: function(t, e) {
			return this.each(function(n) {
				var i = T(this),
					o = g(this, t, n, w(this));
				o.split(/\s+/g).forEach(function(t) {
					(e === k ? !i.hasClass(t) : e) ? i.addClass(t): i.removeClass(t)
				})
			})
		},
		scrollTop: function() {
			return this.length ? "scrollTop" in this[0] ? this[0].scrollTop : this[0].scrollY : void 0
		},
		position: function() {
			if(this.length) {
				var t = this[0],
					e = this.offsetParent(),
					n = this.offset(),
					i = Z.test(e[0].nodeName) ? {
						top: 0,
						left: 0
					} : e.offset();
				return n.top -= parseFloat(T(t).css("margin-top")) || 0, n.left -= parseFloat(T(t).css("margin-left")) || 0, i.top += parseFloat(T(e[0]).css("border-top-width")) || 0, i.left += parseFloat(T(e[0]).css("border-left-width")) || 0, {
					top: n.top - i.top,
					left: n.left - i.left
				}
			}
		},
		offsetParent: function() {
			return this.map(function() {
				for(var t = this.offsetParent || A.body; t && !Z.test(t.nodeName) && "static" == T(t).css("position");) t = t.offsetParent;
				return t
			})
		}
	}, T.fn.detach = T.fn.remove, ["width", "height"].forEach(function(t) {
		T.fn[t] = function(e) {
			var o, r = this[0],
				a = t.replace(/./, function(t) {
					return t[0].toUpperCase()
				});
			return e === k ? n(r) ? r["inner" + a] : i(r) ? r.documentElement["offset" + a] : (o = this.offset()) && o[t] : this.each(function(n) {
				r = T(this), r.css(t, g(this, e, n, r[t]()))
			})
		}
	}), H.forEach(function(e, n) {
		var i = n % 2;
		T.fn[e] = function() {
			var e, o, r = T.map(arguments, function(n) {
					return e = t(n), "object" == e || "array" == e || null == n ? n : J.fragment(n)
				}),
				a = this.length > 1;
			return r.length < 1 ? this : this.each(function(t, e) {
				o = i ? e : e.parentNode, e = 0 == n ? e.nextSibling : 1 == n ? e.firstChild : 2 == n ? e : null, r.forEach(function(t) {
					if(a) t = t.cloneNode(!0);
					else if(!o) return T(t).remove();
					x(o.insertBefore(t, e), function(t) {
						null != t.nodeName && "SCRIPT" === t.nodeName.toUpperCase() && (!t.type || "text/javascript" === t.type) && !t.src && window.eval.call(window, t.innerHTML)
					})
				})
			})
		}, T.fn[i ? e + "To" : "insert" + (n ? "Before" : "After")] = function(t) {
			return T(t)[e](this), this
		}
	}), J.Z.prototype = T.fn, J.uniq = S, J.deserializeValue = y, T.zepto = J, T
}();
window.Zepto = Zepto, "$" in window || (window.$ = Zepto),
	function(t) {
		function e(t) {
			var e = this.os = {},
				n = this.browser = {},
				i = t.match(/WebKit\/([\d.]+)/),
				o = t.match(/(Android)\s+([\d.]+)/),
				r = t.match(/(iPad).*OS\s([\d_]+)/),
				a = !r && t.match(/(iPhone\sOS)\s([\d_]+)/),
				c = t.match(/(webOS|hpwOS)[\s\/]([\d.]+)/),
				s = c && t.match(/TouchPad/),
				u = t.match(/Kindle\/([\d.]+)/),
				l = t.match(/Silk\/([\d._]+)/),
				f = t.match(/(BlackBerry).*Version\/([\d.]+)/),
				d = t.match(/(BB10).*Version\/([\d.]+)/),
				h = t.match(/(RIM\sTablet\sOS)\s([\d.]+)/),
				p = t.match(/PlayBook/),
				m = t.match(/Chrome\/([\d.]+)/) || t.match(/CriOS\/([\d.]+)/),
				v = t.match(/Firefox\/([\d.]+)/);
			(n.webkit = !!i) && (n.version = i[1]), o && (e.android = !0, e.version = o[2]), a && (e.ios = e.iphone = !0, e.version = a[2].replace(/_/g, ".")), r && (e.ios = e.ipad = !0, e.version = r[2].replace(/_/g, ".")), c && (e.webos = !0, e.version = c[2]), s && (e.touchpad = !0), f && (e.blackberry = !0, e.version = f[2]), d && (e.bb10 = !0, e.version = d[2]), h && (e.rimtabletos = !0, e.version = h[2]), p && (n.playbook = !0), u && (e.kindle = !0, e.version = u[1]), l && (n.silk = !0, n.version = l[1]), !l && e.android && t.match(/Kindle Fire/) && (n.silk = !0), m && (n.chrome = !0, n.version = m[1]), v && (n.firefox = !0, n.version = v[1]), e.tablet = !!(r || p || o && !t.match(/Mobile/) || v && t.match(/Tablet/)), e.phone = !e.tablet && !!(o || a || c || f || d || m && t.match(/Android/) || m && t.match(/CriOS\/([\d.]+)/) || v && t.match(/Mobile/))
		}
		e.call(t, navigator.userAgent), t.__detect = e
	}(Zepto),
	function(t) {
		function e(t) {
			return t._zid || (t._zid = h++)
		}

		function n(t, n, r, a) {
			if(n = i(n), n.ns) var c = o(n.ns);
			return(d[e(t)] || []).filter(function(t) {
				return t && (!n.e || t.e == n.e) && (!n.ns || c.test(t.ns)) && (!r || e(t.fn) === e(r)) && (!a || t.sel == a)
			})
		}

		function i(t) {
			var e = ("" + t).split(".");
			return {
				e: e[0],
				ns: e.slice(1).sort().join(" ")
			}
		}

		function o(t) {
			return new RegExp("(?:^| )" + t.replace(" ", " .* ?") + "(?: |$)")
		}

		function r(e, n, i) {
			"string" != t.type(e) ? t.each(e, i) : e.split(/\s/).forEach(function(t) {
				i(t, n)
			})
		}

		function a(t, e) {
			return t.del && ("focus" == t.e || "blur" == t.e) || !!e
		}

		function c(t) {
			return m[t] || t
		}

		function s(n, o, s, u, l, f) {
			var h = e(n),
				p = d[h] || (d[h] = []);
			r(o, s, function(e, o) {
				var r = i(e);
				r.fn = o, r.sel = u, r.e in m && (o = function(e) {
					var n = e.relatedTarget;
					return !n || n !== this && !t.contains(this, n) ? r.fn.apply(this, arguments) : void 0
				}), r.del = l && l(o, e);
				var s = r.del || o;
				r.proxy = function(t) {
					var e = s.apply(n, [t].concat(t.data));
					return e === !1 && (t.preventDefault(), t.stopPropagation()), e
				}, r.i = p.length, p.push(r), n.addEventListener(c(r.e), r.proxy, a(r, f))
			})
		}

		function u(t, i, o, s, u) {
			var l = e(t);
			r(i || "", o, function(e, i) {
				n(t, e, i, s).forEach(function(e) {
					delete d[l][e.i], t.removeEventListener(c(e.e), e.proxy, a(e, u))
				})
			})
		}

		function l(e) {
			var n, i = {
				originalEvent: e
			};
			for(n in e) !b.test(n) && void 0 !== e[n] && (i[n] = e[n]);
			return t.each(w, function(t, n) {
				i[t] = function() {
					return this[n] = v, e[t].apply(e, arguments)
				}, i[n] = g
			}), i
		}

		function f(t) {
			if(!("defaultPrevented" in t)) {
				t.defaultPrevented = !1;
				var e = t.preventDefault;
				t.preventDefault = function() {
					this.defaultPrevented = !0, e.call(this)
				}
			}
		}
		var d = (t.zepto.qsa, {}),
			h = 1,
			p = {},
			m = {
				mouseenter: "mouseover",
				mouseleave: "mouseout"
			};
		p.click = p.mousedown = p.mouseup = p.mousemove = "MouseEvents", t.event = {
			add: s,
			remove: u
		}, t.proxy = function(n, i) {
			if(t.isFunction(n)) {
				var o = function() {
					return n.apply(i, arguments)
				};
				return o._zid = e(n), o
			}
			if("string" == typeof i) return t.proxy(n[i], n);
			throw new TypeError("expected function")
		}, t.fn.bind = function(t, e) {
			return this.each(function() {
				s(this, t, e)
			})
		}, t.fn.unbind = function(t, e) {
			return this.each(function() {
				u(this, t, e)
			})
		}, t.fn.one = function(t, e) {
			return this.each(function(n, i) {
				s(this, t, e, null, function(t, e) {
					return function() {
						var n = t.apply(i, arguments);
						return u(i, e, t), n
					}
				})
			})
		};
		var v = function() {
				return !0
			},
			g = function() {
				return !1
			},
			b = /^([A-Z]|layer[XY]$)/,
			w = {
				preventDefault: "isDefaultPrevented",
				stopImmediatePropagation: "isImmediatePropagationStopped",
				stopPropagation: "isPropagationStopped"
			};
		t.fn.delegate = function(e, n, i) {
			return this.each(function(o, r) {
				s(r, n, i, e, function(n) {
					return function(i) {
						var o, a = t(i.target).closest(e, r).get(0);
						return a ? (o = t.extend(l(i), {
							currentTarget: a,
							liveFired: r
						}), n.apply(a, [o].concat([].slice.call(arguments, 1)))) : void 0
					}
				})
			})
		}, t.fn.undelegate = function(t, e, n) {
			return this.each(function() {
				u(this, e, n, t)
			})
		}, t.fn.live = function(e, n) {
			return t(document.body).delegate(this.selector, e, n), this
		}, t.fn.die = function(e, n) {
			return t(document.body).undelegate(this.selector, e, n), this
		}, t.fn.on = function(e, n, i) {
			return !n || t.isFunction(n) ? this.bind(e, n || i) : this.delegate(n, e, i)
		}, t.fn.off = function(e, n, i) {
			return !n || t.isFunction(n) ? this.unbind(e, n || i) : this.undelegate(n, e, i)
		}, t.fn.trigger = function(e, n) {
			return("string" == typeof e || t.isPlainObject(e)) && (e = t.Event(e)), f(e), e.data = n, this.each(function() {
				"dispatchEvent" in this && this.dispatchEvent(e)
			})
		}, t.fn.triggerHandler = function(e, i) {
			var o, r;
			return this.each(function(a, c) {
				o = l("string" == typeof e ? t.Event(e) : e), o.data = i, o.target = c, t.each(n(c, e.type || e), function(t, e) {
					return r = e.proxy(o), o.isImmediatePropagationStopped() ? !1 : void 0
				})
			}), r
		}, "focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select keydown keypress keyup error".split(" ").forEach(function(e) {
			t.fn[e] = function(t) {
				return t ? this.bind(e, t) : this.trigger(e)
			}
		}), ["focus", "blur"].forEach(function(e) {
			t.fn[e] = function(t) {
				return t ? this.bind(e, t) : this.each(function() {
					try {
						this[e]()
					} catch(t) {}
				}), this
			}
		}), t.Event = function(t, e) {
			"string" != typeof t && (e = t, t = e.type);
			var n = document.createEvent(p[t] || "Events"),
				i = !0;
			if(e)
				for(var o in e) "bubbles" == o ? i = !!e[o] : n[o] = e[o];
			return n.initEvent(t, i, !0, null, null, null, null, null, null, null, null, null, null, null, null), n.isDefaultPrevented = function() {
				return this.defaultPrevented
			}, n
		}
	}(Zepto),
	function(t) {
		function e(e, n, i) {
			var o = t.Event(n);
			return t(e).trigger(o, i), !o.defaultPrevented
		}

		function n(t, n, i, o) {
			return t.global ? e(n || b, i, o) : void 0
		}

		function i(e) {
			e.global && 0 === t.active++ && n(e, null, "ajaxStart")
		}

		function o(e) {
			e.global && !--t.active && n(e, null, "ajaxStop")
		}

		function r(t, e) {
			var i = e.context;
			return e.beforeSend.call(i, t, e) === !1 || n(e, i, "ajaxBeforeSend", [t, e]) === !1 ? !1 : void n(e, i, "ajaxSend", [t, e])
		}

		function a(t, e, i) {
			var o = i.context,
				r = "success";
			i.success.call(o, t, r, e), n(i, o, "ajaxSuccess", [e, i, t]), s(r, e, i)
		}

		function c(t, e, i, o) {
			var r = o.context;
			o.error.call(r, i, e, t), n(o, r, "ajaxError", [i, o, t]), s(e, i, o)
		}

		function s(t, e, i) {
			var r = i.context;
			i.complete.call(r, e, t), n(i, r, "ajaxComplete", [e, i]), o(i)
		}

		function u() {}

		function l(t) {
			return t && (t = t.split(";", 2)[0]), t && (t == C ? "html" : t == k ? "json" : y.test(t) ? "script" : x.test(t) && "xml") || "text"
		}

		function f(t, e) {
			return(t + "&" + e).replace(/[&?]{1,2}/, "?")
		}

		function d(e) {
			e.processData && e.data && "string" != t.type(e.data) && (e.data = t.param(e.data, e.traditional)), e.data && (!e.type || "GET" == e.type.toUpperCase()) && (e.url = f(e.url, e.data))
		}

		function h(e, n, i, o) {
			var r = !t.isFunction(n);
			return {
				url: e,
				data: r ? n : void 0,
				success: r ? t.isFunction(i) ? i : void 0 : n,
				dataType: r ? o || i : i
			}
		}

		function p(e, n, i, o) {
			var r, a = t.isArray(n);
			t.each(n, function(n, c) {
				r = t.type(c), o && (n = i ? o : o + "[" + (a ? "" : n) + "]"), !o && a ? e.add(c.name, c.value) : "array" == r || !i && "object" == r ? p(e, c, i, n) : e.add(n, c)
			})
		}
		var m, v, g = 0,
			b = window.document,
			w = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
			y = /^(?:text|application)\/javascript/i,
			x = /^(?:text|application)\/xml/i,
			k = "application/json",
			C = "text/html",
			T = /^\s*$/;
		t.active = 0, t.ajaxJSONP = function(e) {
			if("type" in e) {
				var n, i = "jsonp" + ++g,
					o = b.createElement("script"),
					s = function() {
						clearTimeout(n), t(o).remove(), delete window[i]
					},
					l = function(t) {
						s(), t && "timeout" != t || (window[i] = u), c(null, t || "abort", f, e)
					},
					f = {
						abort: l
					};
				return r(f, e) === !1 ? (l("abort"), !1) : (window[i] = function(t) {
					s(), a(t, f, e)
				}, o.onerror = function() {
					l("error")
				}, o.src = e.url.replace(/=\?/, "=" + i), t("head").append(o), e.timeout > 0 && (n = setTimeout(function() {
					l("timeout")
				}, e.timeout)), f)
			}
			return t.ajax(e)
		}, t.ajaxSettings = {
			type: "GET",
			beforeSend: u,
			success: u,
			error: u,
			complete: u,
			context: null,
			global: !0,
			xhr: function() {
				return new window.XMLHttpRequest
			},
			accepts: {
				script: "text/javascript, application/javascript",
				json: k,
				xml: "application/xml, text/xml",
				html: C,
				text: "text/plain"
			},
			crossDomain: !1,
			timeout: 0,
			processData: !0,
			cache: !0
		}, t.ajax = function(e) {
			var n = t.extend({}, e || {});
			for(m in t.ajaxSettings) void 0 === n[m] && (n[m] = t.ajaxSettings[m]);
			i(n), n.crossDomain || (n.crossDomain = /^([\w-]+:)?\/\/([^\/]+)/.test(n.url) && RegExp.$2 != window.location.host), n.url || (n.url = window.location.toString()), d(n), n.cache === !1 && (n.url = f(n.url, "_=" + Date.now()));
			var o = n.dataType,
				s = /=\?/.test(n.url);
			if("jsonp" == o || s) return s || (n.url = f(n.url, "callback=?")), t.ajaxJSONP(n);
			var h, p = n.accepts[o],
				g = {},
				b = /^([\w-]+:)\/\//.test(n.url) ? RegExp.$1 : window.location.protocol,
				w = n.xhr();
			n.crossDomain || (g["X-Requested-With"] = "XMLHttpRequest"), p && (g.Accept = p, p.indexOf(",") > -1 && (p = p.split(",", 2)[0]), w.overrideMimeType && w.overrideMimeType(p)), (n.contentType || n.contentType !== !1 && n.data && "GET" != n.type.toUpperCase()) && (g["Content-Type"] = n.contentType || "application/x-www-form-urlencoded"), n.headers = t.extend(g, n.headers || {}), w.onreadystatechange = function() {
				if(4 == w.readyState) {
					w.onreadystatechange = u, clearTimeout(h);
					var e, i = !1;
					if(w.status >= 200 && w.status < 300 || 304 == w.status || 0 == w.status && "file:" == b) {
						o = o || l(w.getResponseHeader("content-type")), e = w.responseText;
						try {
							"script" == o ? (0, eval)(e) : "xml" == o ? e = w.responseXML : "json" == o && (e = T.test(e) ? null : t.parseJSON(e))
						} catch(r) {
							i = r
						}
						i ? c(i, "parsererror", w, n) : a(e, w, n)
					} else c(null, w.status ? "error" : "abort", w, n)
				}
			};
			var y = "async" in n ? n.async : !0;
			w.open(n.type, n.url, y);
			for(v in n.headers) w.setRequestHeader(v, n.headers[v]);
			return r(w, n) === !1 ? (w.abort(), !1) : (n.timeout > 0 && (h = setTimeout(function() {
				w.onreadystatechange = u, w.abort(), c(null, "timeout", w, n)
			}, n.timeout)), w.send(n.data ? n.data : null), w)
		}, t.get = function(e, n, i, o) {
			return t.ajax(h.apply(null, arguments))
		}, t.post = function(e, n, i, o) {
			var r = h.apply(null, arguments);
			return r.type = "POST", t.ajax(r)
		}, t.getJSON = function(e, n, i) {
			var o = h.apply(null, arguments);
			return o.dataType = "json", t.ajax(o)
		}, t.fn.load = function(e, n, i) {
			if(!this.length) return this;
			var o, r = this,
				a = e.split(/\s/),
				c = h(e, n, i),
				s = c.success;
			return a.length > 1 && (c.url = a[0], o = a[1]), c.success = function(e) {
				r.html(o ? t("<div>").html(e.replace(w, "")).find(o) : e), s && s.apply(r, arguments)
			}, t.ajax(c), this
		};
		var _ = encodeURIComponent;
		t.param = function(t, e) {
			var n = [];
			return n.add = function(t, e) {
				this.push(_(t) + "=" + _(e))
			}, p(n, t, e), n.join("&").replace(/%20/g, "+")
		}
	}(Zepto),
	function(t) {
		t.fn.serializeArray = function() {
			var e, n = [];
			return t(Array.prototype.slice.call(this.get(0).elements)).each(function() {
				e = t(this);
				var i = e.attr("type");
				"fieldset" != this.nodeName.toLowerCase() && !this.disabled && "submit" != i && "reset" != i && "button" != i && ("radio" != i && "checkbox" != i || this.checked) && n.push({
					name: e.attr("name"),
					value: e.val()
				})
			}), n
		}, t.fn.serialize = function() {
			var t = [];
			return this.serializeArray().forEach(function(e) {
				t.push(encodeURIComponent(e.name) + "=" + encodeURIComponent(e.value))
			}), t.join("&")
		}, t.fn.submit = function(e) {
			if(e) this.bind("submit", e);
			else if(this.length) {
				var n = t.Event("submit");
				this.eq(0).trigger(n), n.defaultPrevented || this.get(0).submit()
			}
			return this
		}
	}(Zepto),
	function(t, e) {
		function n(t) {
			return i(t.replace(/([a-z])([A-Z])/, "$1-$2"))
		}

		function i(t) {
			return t.toLowerCase()
		}

		function o(t) {
			return r ? r + t : i(t)
		}
		var r, a, c, s, u, l, f, d, h = "",
			p = {
				Webkit: "webkit",
				Moz: "",
				O: "o",
				ms: "MS"
			},
			m = window.document,
			v = m.createElement("div"),
			g = /^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i,
			b = {};
		t.each(p, function(t, n) {
			return v.style[t + "TransitionProperty"] !== e ? (h = "-" + i(t) + "-", r = n, !1) : void 0
		}), a = h + "transform", b[c = h + "transition-property"] = b[s = h + "transition-duration"] = b[u = h + "transition-timing-function"] = b[l = h + "animation-name"] = b[f = h + "animation-duration"] = b[d = h + "animation-timing-function"] = "", t.fx = {
			off: r === e && v.style.transitionProperty === e,
			speeds: {
				_default: 400,
				fast: 200,
				slow: 600
			},
			cssPrefix: h,
			transitionEnd: o("TransitionEnd"),
			animationEnd: o("AnimationEnd")
		}, t.fn.animate = function(e, n, i, o) {
			return t.isPlainObject(n) && (i = n.easing, o = n.complete, n = n.duration), n && (n = ("number" == typeof n ? n : t.fx.speeds[n] || t.fx.speeds._default) / 1e3), this.anim(e, n, i, o)
		}, t.fn.anim = function(i, o, r, h) {
			var p, m, v, w = {},
				y = "",
				x = this,
				k = t.fx.transitionEnd;
			if(o === e && (o = .4), t.fx.off && (o = 0), "string" == typeof i) w[l] = i, w[f] = o + "s", w[d] = r || "linear", k = t.fx.animationEnd;
			else {
				m = [];
				for(p in i) g.test(p) ? y += p + "(" + i[p] + ") " : (w[p] = i[p], m.push(n(p)));
				y && (w[a] = y, m.push(a)), o > 0 && "object" == typeof i && (w[c] = m.join(", "), w[s] = o + "s", w[u] = r || "linear")
			}
			return v = function(e) {
				if("undefined" != typeof e) {
					if(e.target !== e.currentTarget) return;
					t(e.target).unbind(k, v)
				}
				t(this).css(b), h && h.call(this)
			}, o > 0 && this.bind(k, v), this.size() && this.get(0).clientLeft, this.css(w), 0 >= o && setTimeout(function() {
				x.each(function() {
					v.call(this)
				})
			}, 0), this
		}, v = null
	}(Zepto), (window.jQuery || window.Zepto) && ! function(t) {
		t.fn.Swipe = function(e) {
			return this.each(function() {
				t(this).data("Swipe", new Swipe(t(this), e))
			})
		}
	}(window.jQuery || window.Zepto),
	function(t) {
		t.extend(t, {
			setCookie: function(t, e) {
				try {
					var n = 30,
						i = new Date;
					i.setTime(i.getTime() + 24 * n * 60 * 60 * 1e3), document.cookie = t + "=" + escape(e) + ";expires=" + i.toGMTString()
				} catch(o) {}
			},
			removeCookie: function(e) {
				try {
					var n = new Date;
					n.setTime(n.getTime() - 1);
					var i = t.getCookie(e);
					null != i && (document.cookie = e + "=" + i + ";expires=" + n.toGMTString())
				} catch(o) {}
			},
			getCookie: function(t) {
				try {
					var e = document.cookie.match(new RegExp("(^| )" + t + "=([^;]*)(;|$)"));
					return null != e ? unescape(e[2]) : null
				} catch(n) {}
			},
			stopPropagation: function(t) {
				window.event ? window.event.cancelBubble = !0 : t.stopPropagation()
			},
			bodyStop: function() {
				t("body").bind("touchmove", function(t) {
					t.preventDefault()
				})
			},
			masking: function(e) {
				e || (e = 3);
				var n;
				if(n = document.documentElement.offsetHeight < t(window).height() ? t(window).height() : document.documentElement.offsetHeight, t("#Zeptomasking").length) t("#Zeptomasking").css("height", n).show();
				else {
					var i = e / 10,
						o = 10 * e;
					t("body").prepend('<div id="Zeptomasking" style="height:' + n + "px; width:100%; background:#000; position:fixed; top:0; left:0;opacity: " + i + ";filter:alpha(opacity= " + o + "); -moz-opacity: " + i + ";-khtml-opacity: " + i + '; z-index:450;"></div>'), t(window).bind("resize", function() {
						t("#Zeptomasking").css("height", n = document.documentElement.offsetHeight < t(window).height() ? t(window).height() : document.documentElement.offsetHeight)
					})
				}
			},
			objName: function(t, e) {
				var n = function(t) {
					var e = [];
					for(var n in t) e.push(n);
					return e
				};
				return n(e)[t]
			},
			request: function(t) {
				var e = decodeURIComponent(location.href),
					n = {};
				e.replace(/([^?&]+)=([^?&]*)/g, function(t, e, i) {
					n[e.toLowerCase()] = i.toString()
				});
				var i = n[t.toLowerCase()];
				return i ? i : ""
			},
			scrollBottom: function() {
				var e = parseFloat(t(window).height()) + parseFloat(t(window).scrollTop());
				return window.screen.height < document.documentElement.offsetHeight && t(document).height() - 100 <= e ? !0 : void 0
			},
			isScrollBottom: function() {
				return parseFloat(t(window).scrollTop()) >= t(document).height() - t(window).height() ? !0 : void 0
			},
			removeMasking: function(e) {
				e ? t("#Zeptomasking").remove() : t("#Zeptomasking").hide(), t("body").unbind("touchmove")
			},
			city: function(e) {
				try {
					var n = "",
						i = "",
						o = "",
						r = t("#" + e.province),
						a = t("#" + e.city),
						c = t("#" + e.area),
						s = "",
						u = "",
						l = "",
						f = 1,
						d = {};
					e = t.extend(e, d);
					for(var h = function(t, n, i) {
							if(o = "", "undefined" != typeof citylist[t].c[n].a && i) {
								c.parent().show();
								for(var r = citylist[t].c[n], a = 0; a < r.a.length; a++) e.provinceArea && (l = r.a[a].s == e.provinceArea ? "selected" : ""), o += "<option value='" + r.a[a].s + "' " + l + ">" + r.a[a].s + "</option>"
							}
							c.html(o)
						}, p = function(t) {
							i = "";
							var n = 0;
							if("undefined" != typeof citylist[t].c) {
								a.parent().show();
								for(var o = citylist[t], r = 0; r < o.c.length; r++) e.provinceInitial && (o.c[r].n == e.provinceCity ? (u = "selected", n = r) : u = ""), i += "<option value='" + o.c[r].n + "' " + u + " data-index=" + t + ">" + o.c[r].n + "</option>";
								e.provinceInitial ? h(t, n, 1) : h(t, 1)
							}
							a.html(i)
						}, m = 0; m < citylist.length; m++) e.provinceInitial && (citylist[m].p == e.provinceInitial ? (s = "selected", f && (p(m), f = 0)) : s = ""), n += "<option value='" + citylist[m].p + "' data-index=" + m + " " + s + ">" + citylist[m].p + "</option>";
					r.html(n), r.bind("change", function() {
						p(r.prop("selectedIndex"), 1)
					}), a.bind("change", function() {
						h(a.find("option").eq(a.prop("selectedIndex")).attr("data-index"), a.prop("selectedIndex"), 1)
					})
				} catch(v) {}
			},
			trim: function(t) {
				return t ? t.replace(/(^\s*)|(\s*$)/g, "") : ""
			},
			ages: function(t, e) {
				var n = function() {
					var e = t.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
					if(null == e) return !1;
					var n = new Date(e[1], e[3] - 1, e[4]);
					if(n.getFullYear() == e[1] && n.getMonth() + 1 == e[3] && n.getDate() == e[4]) {
						var i = new Date,
							o = i.getFullYear() - e[1];
						if(i.getMonth() > n.getMonth()) return o;
						if(i.getMonth() == n.getMonth()) return i.getDate() >= n.getDate() ? o : o - 1;
						if(i.getMonth() < n.getMonth()) return o - 1
					}
				};
				if(e) {
					if(n() > 0) return n();
					var i = new Date,
						o = i.getFullYear() + "" + (i.getMonth() + 1) + i.getDate();
					return t = t.replace(/-/g, ""), o - t + "天"
				}
				return n()
			},
			isWeixin: function() {
				var t = navigator.userAgent.toLowerCase();
				return "micromessenger" == t.match(/MicroMessenger/i)
			},
			bigImg: function(e) {
				var n = t(e),
					i = n.data("bigImg");
				i && t("body").append("<div onclick='$.closeBigImg(this)' class='module_bigImg'><table><tr><td><img alt='' src='" + i + "'/></td></tr></table></div>")
			},
			closeBigImg: function(e) {
				t(e).remove()
			},
			validateIdCard: function(t) {
				var e = {
						11: "北京",
						12: "天津",
						13: "河北",
						14: "山西",
						15: "内蒙古",
						21: "辽宁",
						22: "吉林",
						23: "黑龙 江",
						31: "上海",
						32: "江苏",
						33: "浙江",
						34: "安徽",
						35: "福建",
						36: "江西",
						37: "山东",
						41: "河南",
						42: "湖 北",
						43: "湖南",
						44: "广东",
						45: "广西",
						46: "海南",
						50: "重庆",
						51: "四川",
						52: "贵州",
						53: "云南",
						54: "西 藏",
						61: "陕西",
						62: "甘肃",
						63: "青海",
						64: "宁夏",
						65: "新疆",
						71: "台湾",
						81: "香港",
						82: "澳门",
						91: "国 外"
					},
					n = 0,
					i = t,
					o = i.length;
				if(!/^\d{17}(\d|x)$/i.test(i) && !/^\d{15}$/i.test(i)) return 1;
				if(null == e[parseInt(i.substr(0, 2))]) return 2;
				if(15 == o) {
					for(var r = [2, 4, 8, 5, 10, 9, 7, 3, 6, 1, 2, 4, 8, 5, 10, 9, 7], a = i.substring(0, 6) + "19" + i.substring(6), c = "10X98765432", s = 0, u = -1, l = "0", f = 0, d = "", h = 16; h >= 0; h--) s += parseInt(a.substring(h, h + 1)) * r[f], f++;
					u = s % 11, l = c.charAt(u), d = a + l, i = d
				}
				var p = i.substring(6, 10);
				if(1900 > p || p > 2078) return 3;
				i = i.replace(/x$/i, "a");
				for(var m = i.substr(6, 4) + "-" + Number(i.substr(10, 2)) + "-" + Number(i.substr(12, 2)), h = (new Date(m.replace(/-/g, "/")), 17); h >= 0; h--) n += Math.pow(2, h) % 11 * parseInt(i.charAt(17 - h), 11);
				if(n % 11 != 1) return 1;
				var v = new Array;
				v = new Array("11111119111111111", "12121219121212121");
				for(var g = 0; g < v.length; g++)
					if(-1 != i.indexOf(v[g])) return 1;
				return 0
			},
			identityAnalysis: function(t) {
				var e, n, i, n = t;
				return 15 == n.length && (e = n.substr(14, 1), i = e % 2 == 0 ? "F" : "M", i += "/" + n.substr(6, 2) + "-" + n.substr(8, 2) + "-" + n.substr(10, 2)), 18 == n.length && (e = n.substr(16, 1), i = e % 2 == 0 ? "F" : "M", i += "/" + n.substr(6, 4) + "-" + n.substr(10, 2) + "-" + n.substr(12, 2)), i
			},
			jsGetAge: function(t) {
				var e, n = t.split("-"),
					i = n[0],
					o = n[1],
					r = n[2],
					a = new Date,
					c = a.getFullYear(),
					s = a.getMonth() + 1,
					u = a.getDate();
				if(c == i) e = s > o ? 0 : o == s && u >= r ? 0 : -1;
				else {
					var l = c - i;
					if(l > 0)
						if(s == o) {
							var f = u - r;
							e = 0 > f ? l - 1 : l
						} else {
							var d = s - o;
							e = 0 > d ? l - 1 : l
						}
					else e = -1
				}
				return e
			},
			boxTips: function(e, n) {
				var i = '<dl onclick="$.stopPropagation(this)" id="jwx_box_tips" class="jwx_box_tips"><dt>' + e + '<b onclick="$.boxClose()" ></b></dt><dd>' + n + "</dd></dl>";
				i = t(i), t("body").bind("touchmove", function(t) {
					t.preventDefault()
				}), t.masking(8), t("body").append(i), i.middle()
			},
			boxClose: function() {
				t("#jwx_box_tips").remove(), t.removeMasking(), t("body").unbind("touchmove")
			},
			tips: function(e) {
				var n = {
					time: 2500,
					html: ""
				};
				if(e && "object" != typeof e && (e = {
						html: e
					}), e = t.extend(n, e), t("#mudule_tips").length > 0) t("#mudule_tips").show().find(".content").html(e.html);
				else {
					var i = "<div class='mudule_tips' id='mudule_tips'><div class='content'>" + e.html + "</div></div>";
					t("body").append(i)
				}
				var o = t("#mudule_tips");
				o.find("p").length < 2 ? o.addClass("mudule_tipsconter") : o.removeClass("mudule_tipsconter"), setTimeout(function() {
					o.hide().find(".content").html("")
				}, e.time)
			},
			imageLoad: function(e) {
				function n(t, n) {
					switch(l.currentIndex = n, t) {
						case "load":
							this.onload = null, this.loaded = !0, l.load++, o(e.onload) && e.onload.call(this, l);
							break;
						case "error":
							l.error++, o(e.onerror) && e.onerror.call(this, l);
							break;
						case "abort":
							l.abort++
					}
					l.complete++, o(e.oncomplete) && e.oncomplete.call(this, l), l.complete === u.length && i()
				}

				function i() {
					clearTimeout(s), o(e.complete) && e.complete.call({}, u, l)
				}

				function o(t) {
					return "[object Function]" === c.apply(t)
				}
				var r, a = [],
					c = Object.prototype.toString;
				switch(c.apply(e.url)) {
					case "[object String]":
						a[a.length] = e.url;
						break;
					case "[object Array]":
						if(!e.url.length) return !1;
						a = e.url;
						break;
					case "[object Function]":
						return e.url = e.url(), t.imageLoad(e);
					default:
						return !1
				}
				var s, u = [],
					l = {
						total: a.length,
						load: 0,
						error: 0,
						abort: 0,
						complete: 0,
						currentIndex: 0
					},
					f = {
						url: "",
						onload: "function",
						onerror: "function",
						oncomplete: "function",
						ready: "function",
						complete: "function",
						timeout: 15
					};
				for(var d in f) e[d] = e[d] === r ? f[d] : e[d];
				e.timeout = parseInt(e.timeout) || f.timeout, s = setTimeout(i, 1e3 * e.timeout);
				for(var h, p = 0, m = a.length; m > p; p++) h = new Image, h.loaded = !1, u[u.length] = h;
				for(p = 0, m = u.length; m > p; p++) u[p].onload = function() {
					n.call(this, "load", p)
				}, u[p].onerror = function() {
					n.call(this, "error", p)
				}, u[p].onabort = function() {
					n.call(this, "abort", p)
				}, u[p].src = "" + a[p];
				return o(e.ready) && e.ready.call({}, u, l), !0
			},
			loadMasking: function(e, n) {
				var i = t("#mudule_masking"),
					o = Math.round(e / n * 100);
				if(!i.length) {
					var r = '<div id="mudule_masking" class="mudule_masking"><div class="loading"><div class="jindu"><span>0%</span><div></div></div>资源正在疯狂加载中...</div></div>';
					i = t(r), t("body").append(i)
				}
				i.find(".jindu span").html(o + "%"), i.find(".jindu div").width(o + "%"), e >= n && i.remove()
			},
			visible: function(e) {
				return t(e).offset().top < window.innerHeight + t("body").scrollTop() && window.innerHeight + t("body").scrollTop() - t(e).offset().top < window.innerHeight
			},
			newBox: function(e) {
				var n = {
					html: "",
					id: "",
					closeCallback: function() {},
					closeClass: "close",
					cbg: "#F5F6F7"
				};
				if(e = t.extend(n, e), e.id) var i = t(e.id);
				else {
					var i = "<div class='mudule_select' id='mudule_select'><div style='background: " + e.cbg + "' onclick='$.stopPropagation(this)' class='content'><div class='neirong'><span class='spanClose close'></span>" + e.html + "</div></div></div>";
					i = t(i), t("body").append(i)
				}
				i.show().animate({
					opacity: 1
				}, 200, "", function() {
					i.find(".content").animate({
						bottom: 0
					}, 300)
				});
				var o = function() {
					e.id ? t.newBoxColse(e.id) : t.newBoxColse(), e.closeCallback()
				};
				i.bind("click", function() {
					o(), i.unbind()
				}), i.find("." + e.closeClass).bind("click", function() {
					o(), i.find("." + e.closeClass).unbind()
				})
			},
			newBoxColse: function(e) {
				if(e) var n = t(e);
				else var n = t("#mudule_select");
				n.find(".content").animate({
					bottom: NaN
				}, 200), setTimeout(function() {
					n.animate({
						opacity: 0
					}, 200)
				}, 200), setTimeout(function() {
					e ? n.hide() : n.remove()
				}, 420)
			},
			selectPopup: function(e) {
				var n = {
					clickCallback: function(t, e) {}
				};
				e = t.extend(n, e), t(e.id).bind("click", function() {
					var n = t(this);
					"UL" != n.attr("tagName") && (n = n.find("ul").eq(0)), t.newBox({
						html: n.get(0).outerHTML
					}), t("#mudule_select li").bind("click", function(i) {
						n.find("li").eq(t(this).index()).remove(), n.prepend(t(this).get(0).outerHTML), t("#" + n.data("hid")).val(t(this).data("value")), t.newBoxColse(), e.clickCallback(t(this), n), i.stopPropagation()
					})
				})
			},
			formatDate: function(t) {
				var e = t.getFullYear(),
					n = t.getMonth() + 1;
				n = 10 > n ? "0" + n : n;
				var i = t.getDate();
				return i = 10 > i ? "0" + i : i, e + "-" + n + "-" + i
			},
			loading: function(e) {
				var n = t("#mudule_tips_loading");
				if("close" == e) n.hide();
				else if(n.length > 0) n.find("p").html(e), n.show();
				else {
					var i = '<div class="mudule_tips_loading" id="mudule_tips_loading"><div><b></b><p>' + e + "</p></div></div>";
					t("body").append(i)
				}
			},
			boxPopup: function(e) {
				if("close" == e) return t("#module_popup").remove(), !1;
				var n = {
					html: "",
					title: "",
					close: 0,
					closeCallback: function() {}
				};
				e = t.extend(n, e);
				var i = '<div class="module_popup" id="module_popup"><div class="content" onclick="$.stopPropagation(this)"><span class="close leftTop_close ' + (e.close ? "block" : "none") + '"></span><div class="title ' + (e.title ? "block" : "none") + '">' + e.title + '</div><div class="neirong">' + e.html + "</div></div></div>";
				t("body").prepend(i);
				var o = t("#module_popup");
				o.find(".content").css("marginTop", -(t("#module_popup .content").height() / 2));
				var r = function() {
					o.remove(), e.closeCallback()
				};
				o.bind("click", function() {
					r(), o.unbind()
				}), o.find(".close").bind("click", function() {
					r(), o.find(".close").unbind()
				})
			},
			toHalfCorner: function(t) {
				for(var e = "", n = 0; n < t.length; n++) e += t.charCodeAt(n) > 65248 && t.charCodeAt(n) < 65375 ? String.fromCharCode(t.charCodeAt(n) - 65248) : String.fromCharCode(t.charCodeAt(n));
				return e
			},
			imgVerification: {
				show: function(e, n) {
					var i = '<div class="imgVerification" id="imgVerification"><img  onclick="$.imgVerification.refresh(this)" data-type="' + e + '" class="fl" alt="点击图片刷新验证码" src="/captcha/show?flag=' + e + '" /><input type="button" value="刷新" onclick="$.imgVerification.refresh(this)" data-type="' + e + '" class="btn_quxiao ri"/><b class="liclear"></b><input type="text" class="tx1 fl" placeholder="请输入图上的验证码"/><input type="button" class="btn_queren" value="确认"></div>';
					t.boxPopup({
						title: "为了您的帐号安全，请输入验证码",
						close: !0,
						html: i
					});
					var o = t("#imgVerification");
					o.find(".btn_queren").bind("click", function() {
						var i = o.find(".tx1"),
							r = t(this);
						"" == i.val() ? t.tips("验证码不能为空") : "确认" == r.val() && (r.val("正在提交中..."), t.post("/captcha/validate/", {
							flag: e,
							code: t.trim(i.val())
						}, function(e) {
							0 == e.code ? (o.find(".btn_queren").unbind("click"), t.boxPopup("close"), n()) : (r.val("确认"), t.imgVerification.refresh(t("#imgVerification .btn_quxiao")), t.tips(e.message))
						}, "json"))
					})
				},
				refresh: function(e) {
					var n = t(e).data("type");
					t("#imgVerification img").attr("src", "/captcha/show?flag=" + n)
				}
			},
			cssLoading: function(e) {
				var n = "undefined" == typeof e ? "加载中..." : e,
					i = t("#spinner-box");
				if("close" == e) i.remove();
				else {
					if(i.length > 0) return i.show(), !1;
					var o = '<div class="spinner-box" id="spinner-box"><div class="container container1"><div class="circle1"></div><div class="circle2"></div><div class="circle3"></div><div class="circle4"></div></div><div class="container container2"><div class="circle1"></div><div class="circle2"></div><div class="circle3"></div><div class="circle4"></div></div><div class="container container3"><div class="circle1"></div><div class="circle2"></div><div class="circle3"></div><div class="circle4"></div></div><p>' + n + "</p></div>";
					t("body").append(o)
				}
			},
			updateUrl: function(t, e) {
				var e = (e || "t") + "=",
					n = new RegExp(e + "\\d+"),
					i = +new Date;
				if(t.indexOf(e) > -1) return t.replace(n, e + i);
				if(t.indexOf("?") > -1) {
					var o = t.split("?");
					return o[1] ? o[0] + "?" + e + i + "&" + o[1] : o[0] + "?" + e + i
				}
				return t.indexOf("#") > -1 ? t.split("#")[0] + "?" + e + i + location.hash : t + "?" + e + i
			},
			ajaxAges: function(e, n, i) {
				var o = "",
					r = arguments.length,
					a = n,
					c = i;
				return 2 == r && isNaN(arguments[1]) && (a = "", c = arguments[1]), t.ajax({
					url: "/product/ajaxGetDefaultAge",
					type: "GET",
					async: !1,
					data: {
						product_id: a ? a : "",
						birthday: e
					},
					success: function(e) {
						var e = t.parseJSON(e);
						0 == e.code && (o = c && "M" == c.toUpperCase() ? e.data.months : c && "D" == c.toUpperCase() ? e.data.days : e.data.years)
					}
				}), o
			}
		}), t.extend(t.fn, {
			middle: function() {
				return this.each(function(e) {
					var n = document.body.clientHeight;
					n == t("body").height() && (n = t(window).height()), t(this).css({
						top: document.body.scrollTop + (n / 2 - t(this).height() / 2),
						left: "50%",
						"margin-left": -(t(this).width() / 2)
					})
				}), this
			},
			data: function(e, n) {
				return "undefined" != typeof e && "undefined" != typeof n ? (this.each(function(i) {
					t(this).attr("data-" + e, n)
				}), this) : t(this).attr("data-" + e)
			}
		})
	}(Zepto);
var throttle = function(t, e, n, i) {
		var o, r, a, c = +new Date,
			s = 0,
			u = 0,
			l = null,
			f = function() {
				u = c, t.apply(r, a)
			};
		return function() {
			c = +new Date, r = this, a = arguments, o = c - (i ? s : u) - e, clearTimeout(l), i ? n ? l = setTimeout(f, e) : o >= 0 && f() : o >= 0 ? f() : n && (l = setTimeout(f, -o)), s = c
		}
	},
	debounce = function(t, e, n) {
		return throttle(t, e, n, !0)
	},
	moduleUl = {
		weixinUl: {
			error: function(t) {
				alert("接口调用出错：" + t.errMsg)
			},
			ready: function(t) {
				var e = {
					url: location.href,
					title: document.title,
					desc: "",
					link: location.href,
					triggerCallback: function() {},
					successCallback: function() {
						location.href = t.link
					},
					cancelCallback: function() {},
					imgUrl: ""
				};
				$.extend(e, t), $.get("/wxservice/jsdata?url=" + encodeURIComponent(e.url), function(t) {
					moduleUl.weixinUl.config(t, e)
				})
			},
			config: function(t, e) {
				t = JSON.parse(t);
				try {
					t && 0 == t.code ? (t = t.data, wx.config({
						debug: !1,
						appId: t.appId,
						timestamp: t.timestamp,
						nonceStr: t.nonceStr,
						signature: t.signature,
						jsApiList: ["onMenuShareTimeline", "onMenuShareAppMessage", "onMenuShareQQ", "onMenuShareWeibo"]
					}), wx.ready(function() {
						var t = {
							title: e.title,
							desc: e.desc,
							link: e.link,
							imgUrl: e.imgUrl,
							type: "link",
							dataUrl: "",
							trigger: function(t) {
								e.triggerCallback()
							},
							success: function() {
								e.successCallback()
							},
							cancel: function() {
								e.cancelCallback()
							}
						};
						wx.onMenuShareTimeline(t), wx.onMenuShareQQ(t), wx.onMenuShareWeibo(t), wx.onMenuShareAppMessage(t)
					}), wx.error(function(t) {})) : alert("很抱歉，出现未知错误，请稍后访问！")
				} catch(n) {}
			}
		},
		check: {
			mobile: function(t) {
				var e = /^1[3-9][0-9]\d{8}$/;
				return e.test(t)
			},
			email: function(t) {
				var e = /^(\w-*\.*)+(@|＠)(\w-?)+((\.|\。)\w{2,})+$/;
				return e.test(t)
			}
		}
	},
	APPCommon = {
		schema: "datebao://openpage/home",
		downUrl: "https://m.datebao.com/app/download3?flag=",
		iphoneDown: "https://m.datebao.com/app/download2?flag=",
		openApp: function() {
			var t = this,
				e = "";
			if("undefind" != typeof app_url_flag && (e = app_url_flag), t.isWeixin()) location.href = t.downUrl + e;
			else if(navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
				var n = new Date;
				window.setTimeout(function() {
					var i = new Date;
					5e3 > i - n ? window.location = t.iphoneDown + e : window.close()
				}, 50), window.location = this.schema
			} else if(navigator.userAgent.match(/android/i)) try {
				window.location = t.schema, setTimeout(function() {
					window.location = t.downUrl + e
				}, 500)
			} catch(i) {}
		},
		isWeixin: function() {
			var t = navigator.userAgent.toLowerCase();
			return "micromessenger" == t.match(/MicroMessenger/i)
		}
	};
$(function() {
	$("#module_new_header .a2").click(function() {
		var t = $(this);
		t.hasClass("on") ? (t.parent().find(".list").removeClass("on"), t.removeClass("on")) : (t.parent().find(".list").addClass("on"), t.addClass("on"))
	}), $("#body_mian").bind("click", function() {
		$("#module_new_header .a2").removeClass("on"), $("#module_new_header .list").removeClass("on")
	});
	var t = $("#fanhuidingbu"),
		e = $("#backHomeIcon"),
		n = $("#backBefore"),
		i = parseInt(n.css("top")),
		o = $(window).height();
	$(".module_newhome_header").length > 0 ? i = $(".module_newhome_header").height() : $("#jwx_product_list .title").length > 0 && (i = $("#jwx_product_list .title").height()), t.bind("click", function() {
		var t = setInterval(function() {
			document.body.scrollTop > 40 ? document.body.scrollTop = document.body.scrollTop - 45 : (document.body.scrollTop = 0, clearInterval(t))
		}, 10)
	}), $(document).scroll(function() {
		document.body.scrollTop > o ? (e.addClass("on"), t.show()) : (e.removeClass("on"), t.hide()), document.body.scrollTop > i ? n.addClass("on") : n.removeClass("on")
	}), history.length > 1 ? n.addClass("on") : n.removeClass("on");
	var r = "input"; - 1 != navigator.userAgent.indexOf("MSIE") && (r = "propertychange"), $("input.check-figures").bind(r, function() {
		$(this).val($(this).val().replace(/[^\d.]/g, ""))
	}), $("input.check-characters").bind(r, function() {
		$(this).val($(this).val().replace(/[^\u4E00-\u9FA5]/g, ""))
	});
	var a = $("#invest");
	a.length > 0 && "1" == $.request("invest") && a.show();
	var c = $("#productInfo");
	c.length > 0 && $.request("promote_code") && (c.find(".promote_hide").hide(), $("#backHomeIcon").remove());
	var s = $("#app-download"),
		u = $("#showTopAppDownload");
	s[0] && !u[0] && 1 != $.getCookie("no_appdownload") && ($.getCookie("howLongShowThis") ? s.hide() : (s.show().find(".close-this").on("click", function() {
		try {
			var t = new Date,
				e = 24 - t.getHours();
			t.setTime(t.getTime() + 60 * e * 60 * 1e3), document.cookie = "howLongShowThis=" + escape("in") + ";expires=" + t.toGMTString() + ";path=/"
		} catch(n) {}
		$(this).closest(".app-download").remove(), $("#module_new_header .a1").click(function() {
			location.reload()
		})
	}), s.find(".open-app").on("click", function() {
		APPCommon.openApp()
	})))
}), String.prototype.inArray = function(t) {
	if(!t || "object" != typeof t || t.length < 0) throw new Error("数组为空，或者不存在");
	for(var e = 0; e < t.length; e++)
		if(t[e] == this) return !0;
	return !1
};