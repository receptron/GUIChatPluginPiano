function ve(n) {
  return n && n.__esModule && Object.prototype.hasOwnProperty.call(n, "default") ? n.default : n;
}
function he(n) {
  if (Object.prototype.hasOwnProperty.call(n, "__esModule")) return n;
  var a = n.default;
  if (typeof a == "function") {
    var c = function u() {
      var e = !1;
      try {
        e = this instanceof u;
      } catch {
      }
      return e ? Reflect.construct(a, arguments, this.constructor) : a.apply(this, arguments);
    };
    c.prototype = a.prototype;
  } else c = {};
  return Object.defineProperty(c, "__esModule", { value: !0 }), Object.keys(n).forEach(function(u) {
    var e = Object.getOwnPropertyDescriptor(n, u);
    Object.defineProperty(c, u, e.get ? e : {
      enumerable: !0,
      get: function() {
        return n[u];
      }
    });
  }), c;
}
var E = { exports: {} }, k = { exports: {} }, j, z;
function pe() {
  if (z) return j;
  z = 1;
  function n(c) {
    return c > 64 && c < 91 ? c - 65 : c > 96 && c < 123 ? c - 71 : c > 47 && c < 58 ? c + 4 : c === 43 ? 62 : c === 47 ? 63 : 0;
  }
  function a(c, u) {
    for (var e = c.replace(/[^A-Za-z0-9\+\/]/g, ""), o = e.length, d = u ? Math.ceil((o * 3 + 1 >> 2) / u) * u : o * 3 + 1 >> 2, r = new Uint8Array(d), t, i, l = 0, s = 0, h = 0; h < o; h++)
      if (i = h & 3, l |= n(e.charCodeAt(h)) << 18 - 6 * i, i === 3 || o - h === 1) {
        for (t = 0; t < 3 && s < d; t++, s++)
          r[s] = l >>> (16 >>> t & 24) & 255;
        l = 0;
      }
    return r;
  }
  return j = { decode: a }, j;
}
var N, H;
function me() {
  return H || (H = 1, N = function(n, a) {
    return new Promise(function(c, u) {
      var e = new XMLHttpRequest();
      a && (e.responseType = a), e.open("GET", n), e.onload = function() {
        e.status === 200 ? c(e.response) : u(Error(e.statusText));
      }, e.onerror = function() {
        u(Error("Network Error"));
      }, e.send();
    });
  }), N;
}
var K;
function ge() {
  return K || (K = 1, (function(n) {
    var a = pe(), c = me();
    function u(v) {
      return function(f) {
        return typeof f == "string" && v.test(f);
      };
    }
    function e(v, f) {
      return typeof v == "string" ? v + f : typeof v == "function" ? v(f) : f;
    }
    function o(v, f, T, w) {
      var x = (
        // Basic audio loading
        d(f) ? r : t(f) ? i : l(f) ? s : h(f) ? g : A(f) ? b : p(f) ? R : O(f) ? S : m(f) ? _ : null
      ), M = T || {};
      return x ? x(v, f, M) : w ? Promise.resolve(w) : Promise.reject("Source not valid (" + f + ")");
    }
    o.fetch = c;
    function d(v) {
      return v instanceof ArrayBuffer;
    }
    function r(v, f, T) {
      return new Promise(function(w, x) {
        v.decodeAudioData(
          f,
          function(M) {
            w(M);
          },
          function() {
            x("Can't decode audio data (" + f.slice(0, 30) + "...)");
          }
        );
      });
    }
    var t = u(/\.(mp3|wav|ogg)(\?.*)?$/i);
    function i(v, f, T) {
      var w = e(T.from, f);
      return o(v, o.fetch(w, "arraybuffer"), T);
    }
    function l(v) {
      return v && typeof v.then == "function";
    }
    function s(v, f, T) {
      return f.then(function(w) {
        return o(v, w, T);
      });
    }
    var h = Array.isArray;
    function g(v, f, T) {
      return Promise.all(f.map(function(w) {
        return o(v, w, T, w);
      }));
    }
    function A(v) {
      return v && typeof v == "object";
    }
    function b(v, f, T) {
      var w = {}, x = Object.keys(f).map(function(M) {
        if (T.only && T.only.indexOf(M) === -1) return null;
        var X = f[M];
        return o(v, X, T, X).then(function(de) {
          w[M] = de;
        });
      });
      return Promise.all(x).then(function() {
        return w;
      });
    }
    var p = u(/\.json(\?.*)?$/i);
    function R(v, f, T) {
      var w = e(T.from, f);
      return o(v, o.fetch(w, "text").then(JSON.parse), T);
    }
    var O = u(/^data:audio/);
    function S(v, f, T) {
      var w = f.indexOf(",");
      return o(v, a.decode(f.slice(w + 1)).buffer, T);
    }
    var m = u(/\.js(\?.*)?$/i);
    function _(v, f, T) {
      var w = e(T.from, f);
      return o(v, o.fetch(w, "text").then(y), T);
    }
    function y(v) {
      var f = v.indexOf("MIDI.Soundfont.");
      if (f < 0) throw Error("Invalid MIDI.js Soundfont format");
      f = v.indexOf("=", f) + 2;
      var T = v.lastIndexOf(",");
      return JSON.parse(v.slice(f, T) + "}");
    }
    n.exports && (n.exports = o), typeof window < "u" && (window.loadAudio = o);
  })(k)), k.exports;
}
var V = { exports: {} }, F, Y;
function ye() {
  if (Y) return F;
  Y = 1, F = n;
  function n(r) {
    var t = r.createGain(), i = t._voltage = u(r), l = e(i), s = e(i), h = e(i);
    return t._startAmount = e(s), t._endAmount = e(h), t._multiplier = e(l), t._multiplier.connect(t), t._startAmount.connect(t), t._endAmount.connect(t), t.value = l.gain, t.startValue = s.gain, t.endValue = h.gain, t.startValue.value = 0, t.endValue.value = 0, Object.defineProperties(t, a), t;
  }
  var a = {
    attack: { value: 0, writable: !0 },
    decay: { value: 0, writable: !0 },
    sustain: { value: 1, writable: !0 },
    release: { value: 0, writable: !0 },
    getReleaseDuration: {
      value: function() {
        return this.release;
      }
    },
    start: {
      value: function(r) {
        var t = this._multiplier.gain, i = this._startAmount.gain, l = this._endAmount.gain;
        this._voltage.start(r), this._decayFrom = this._decayFrom = r + this.attack, this._startedAt = r;
        var s = this.sustain;
        t.cancelScheduledValues(r), i.cancelScheduledValues(r), l.cancelScheduledValues(r), l.setValueAtTime(0, r), this.attack ? (t.setValueAtTime(0, r), t.linearRampToValueAtTime(1, r + this.attack), i.setValueAtTime(1, r), i.linearRampToValueAtTime(0, r + this.attack)) : (t.setValueAtTime(1, r), i.setValueAtTime(0, r)), this.decay && t.setTargetAtTime(s, this._decayFrom, o(this.decay));
      }
    },
    stop: {
      value: function(r, t) {
        t && (r = r - this.release);
        var i = r + this.release;
        if (this.release) {
          var l = this._multiplier.gain, s = this._startAmount.gain, h = this._endAmount.gain;
          l.cancelScheduledValues(r), s.cancelScheduledValues(r), h.cancelScheduledValues(r);
          var g = o(this.release);
          if (this.attack && r < this._decayFrom) {
            var A = d(0, 1, this._startedAt, this._decayFrom, r);
            l.linearRampToValueAtTime(A, r), s.linearRampToValueAtTime(1 - A, r), s.setTargetAtTime(0, r, g);
          }
          h.setTargetAtTime(1, r, g), l.setTargetAtTime(0, r, g);
        }
        return this._voltage.stop(i), i;
      }
    },
    onended: {
      get: function() {
        return this._voltage.onended;
      },
      set: function(r) {
        this._voltage.onended = r;
      }
    }
  }, c = new Float32Array([1, 1]);
  function u(r) {
    var t = r.createBufferSource(), i = r.createBuffer(1, 2, r.sampleRate);
    return i.getChannelData(0).set(c), t.buffer = i, t.loop = !0, t;
  }
  function e(r) {
    var t = r.context.createGain();
    return r.connect(t), t;
  }
  function o(r) {
    return Math.log(r + 1) / Math.log(100);
  }
  function d(r, t, i, l, s) {
    var h = t - r, g = l - i, A = s - i, b = A / g, p = r + b * h;
    return p <= r && (p = r), p >= t && (p = t), p;
  }
  return F;
}
var B, Z;
function be() {
  if (Z) return B;
  Z = 1;
  var n = ye(), a = {}, c = {
    gain: 1,
    attack: 0.01,
    decay: 0.1,
    sustain: 0.9,
    release: 0.3,
    loop: !1,
    cents: 0,
    loopStart: 0,
    loopEnd: 0
  };
  function u(t, i, l) {
    var s = !1, h = 0, g = {}, A = t.createGain();
    A.gain.value = 1;
    var b = Object.assign({}, c, l), p = { context: t, out: A, opts: b };
    return i instanceof AudioBuffer ? p.buffer = i : p.buffers = i, p.start = function(S, m, _) {
      if (p.buffer && S !== null) return p.start(null, S, m);
      var y = S ? p.buffers[S] : p.buffer;
      if (y) {
        if (!s) {
          console.warn("SamplePlayer not connected to any node.");
          return;
        }
      } else {
        console.warn("Buffer " + S + " not found.");
        return;
      }
      var v = _ || a;
      m = Math.max(t.currentTime, m || 0), p.emit("start", m, S, v);
      var f = O(S, y, v);
      return f.id = R(S, f), f.env.start(m), f.source.start(m), p.emit("started", m, f.id, f), v.duration && f.stop(m + v.duration), f;
    }, p.play = function(S, m, _) {
      return p.start(S, m, _);
    }, p.stop = function(S, m) {
      var _;
      return m = m || Object.keys(g), m.map(function(y) {
        return _ = g[y], _ ? (_.stop(S), _.id) : null;
      });
    }, p.connect = function(S) {
      return s = !0, A.connect(S), p;
    }, p.emit = function(S, m, _, y) {
      p.onevent && p.onevent(S, m, _, y);
      var v = p["on" + S];
      v && v(m, _, y);
    }, p;
    function R(S, m) {
      return m.id = h++, g[m.id] = m, m.source.onended = function() {
        var _ = t.currentTime;
        m.source.disconnect(), m.env.disconnect(), m.disconnect(), p.emit("ended", _, m.id, m);
      }, m.id;
    }
    function O(S, m, _) {
      var y = t.createGain();
      return y.gain.value = 0, y.connect(A), y.env = d(t, _, b), y.env.connect(y.gain), y.source = t.createBufferSource(), y.source.buffer = m, y.source.connect(y), y.source.loop = _.loop || b.loop, y.source.playbackRate.value = r(_.cents || b.cents), y.source.loopStart = _.loopStart || b.loopStart, y.source.loopEnd = _.loopEnd || b.loopEnd, y.stop = function(v) {
        var f = v || t.currentTime;
        p.emit("stop", f, S);
        var T = y.env.stop(f);
        y.source.stop(T);
      }, y;
    }
  }
  function e(t) {
    return typeof t == "number";
  }
  var o = ["attack", "decay", "sustain", "release"];
  function d(t, i, l) {
    var s = n(t), h = i.adsr || l.adsr;
    return o.forEach(function(g, A) {
      h ? s[g] = h[A] : s[g] = i[g] || l[g];
    }), s.value.value = e(i.gain) ? i.gain : e(l.gain) ? l.gain : 1, s;
  }
  function r(t) {
    return t ? Math.pow(2, t / 1200) : 1;
  }
  return B = u, B;
}
var D, Q;
function Te() {
  if (Q) return D;
  Q = 1, D = function(a) {
    return a.on = function(c, u) {
      if (arguments.length === 1 && typeof c == "function") return a.on("event", c);
      var e = "on" + c, o = a[e];
      return a[e] = o ? n(o, u) : u, a;
    }, a;
  };
  function n(a, c) {
    return function(u, e, o, d) {
      a(u, e, o, d), c(u, e, o, d);
    };
  }
  return D;
}
var $, W;
function Ae() {
  if (W) return $;
  W = 1;
  var n = /^([a-gA-G])(#{1,}|b{1,}|x{1,}|)(-?\d*)\s*(.*)\s*$/;
  function a() {
    return n;
  }
  var c = [0, 2, 4, 5, 7, 9, 11];
  function u(r, t, i) {
    if (typeof r != "string") return null;
    var l = n.exec(r);
    if (!l || !t && l[4]) return null;
    var s = { letter: l[1].toUpperCase(), acc: l[2].replace(/x/g, "##") };
    return s.pc = s.letter + s.acc, s.step = (s.letter.charCodeAt(0) + 3) % 7, s.alt = s.acc[0] === "b" ? -s.acc.length : s.acc.length, s.chroma = c[s.step] + s.alt, l[3] && (s.oct = +l[3], s.midi = s.chroma + 12 * (s.oct + 1), s.freq = e(s.midi, i)), t && (s.tonicOf = l[4]), s;
  }
  function e(r, t) {
    return Math.pow(2, (r - 69) / 12) * (t || 440);
  }
  var o = { parse: u, regex: a, midiToFreq: e }, d = ["letter", "acc", "pc", "step", "alt", "chroma", "oct", "midi", "freq"];
  return d.forEach(function(r) {
    o[r] = function(t) {
      var i = u(t);
      return i && typeof i[r] < "u" ? i[r] : null;
    };
  }), $ = o, $;
}
var U, ee;
function Se() {
  if (ee) return U;
  ee = 1;
  var n = Ae(), a = function(e) {
    return e !== null && e !== [] && e >= 0 && e < 129;
  }, c = function(e) {
    return a(e) ? +e : n.midi(e);
  };
  U = function(e) {
    if (e.buffers) {
      var o = e.opts.map, d = typeof o == "function" ? o : c, r = function(i) {
        return i ? d(i) || i : null;
      };
      e.buffers = u(e.buffers, r);
      var t = e.start;
      e.start = function(i, l, s) {
        var h = r(i), g = h % 1;
        return g && (h = Math.floor(h), s = Object.assign(s || {}, { cents: Math.floor(g * 100) })), t(h, l, s);
      };
    }
    return e;
  };
  function u(e, o) {
    return Object.keys(e).reduce(function(d, r) {
      return d[o(r)] = e[r], d;
    }, {});
  }
  return U;
}
var L, re;
function _e() {
  if (re) return L;
  re = 1;
  var n = Array.isArray, a = function(u) {
    return u && typeof u == "object";
  }, c = {};
  return L = function(u) {
    return u.schedule = function(e, o) {
      var d = u.context.currentTime, r = e < d ? d : e;
      u.emit("schedule", r, o);
      var t, i, l, s;
      return o.map(function(h) {
        if (h) n(h) ? (t = h[0], i = h[1]) : (t = h.time, i = h);
        else return null;
        return a(i) ? (l = i.name || i.key || i.note || i.midi || null, s = i) : (l = i, s = c), u.start(l, r + (t || 0), s);
      });
    }, u;
  }, L;
}
function P(n) {
  throw new Error('Could not dynamically require "' + n + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}
var G = { exports: {} }, te;
function we() {
  return te || (te = 1, (function(n, a) {
    (function(c) {
      n.exports = c();
    })(function() {
      return (function c(u, e, o) {
        function d(i, l) {
          if (!e[i]) {
            if (!u[i]) {
              var s = typeof P == "function" && P;
              if (!l && s) return s(i, !0);
              if (r) return r(i, !0);
              var h = new Error("Cannot find module '" + i + "'");
              throw h.code = "MODULE_NOT_FOUND", h;
            }
            var g = e[i] = { exports: {} };
            u[i][0].call(g.exports, function(A) {
              var b = u[i][1][A];
              return d(b || A);
            }, g, g.exports, c, u, e, o);
          }
          return e[i].exports;
        }
        for (var r = typeof P == "function" && P, t = 0; t < o.length; t++) d(o[t]);
        return d;
      })({ 1: [function(c, u, e) {
        Object.defineProperty(e, "__esModule", { value: !0 }), e.default = function(o) {
          function d(r) {
            if (this._event = r, this._data = r.data, this.receivedTime = r.receivedTime, this._data && this._data.length < 2) {
              console.warn("Illegal MIDI message of length", this._data.length);
              return;
            }
            switch (this._messageCode = r.data[0] & 240, this.channel = r.data[0] & 15, this._messageCode) {
              case 128:
                this.messageType = "noteoff", this.key = r.data[1] & 127, this.velocity = r.data[2] & 127;
                break;
              case 144:
                this.messageType = "noteon", this.key = r.data[1] & 127, this.velocity = r.data[2] & 127;
                break;
              case 160:
                this.messageType = "keypressure", this.key = r.data[1] & 127, this.pressure = r.data[2] & 127;
                break;
              case 176:
                this.messageType = "controlchange", this.controllerNumber = r.data[1] & 127, this.controllerValue = r.data[2] & 127, this.controllerNumber === 120 && this.controllerValue === 0 ? this.channelModeMessage = "allsoundoff" : this.controllerNumber === 121 ? this.channelModeMessage = "resetallcontrollers" : this.controllerNumber === 122 ? this.controllerValue === 0 ? this.channelModeMessage = "localcontroloff" : this.channelModeMessage = "localcontrolon" : this.controllerNumber === 123 && this.controllerValue === 0 ? this.channelModeMessage = "allnotesoff" : this.controllerNumber === 124 && this.controllerValue === 0 ? this.channelModeMessage = "omnimodeoff" : this.controllerNumber === 125 && this.controllerValue === 0 ? this.channelModeMessage = "omnimodeon" : this.controllerNumber === 126 ? this.channelModeMessage = "monomodeon" : this.controllerNumber === 127 && (this.channelModeMessage = "polymodeon");
                break;
              case 192:
                this.messageType = "programchange", this.program = r.data[1];
                break;
              case 208:
                this.messageType = "channelpressure", this.pressure = r.data[1] & 127;
                break;
              case 224:
                this.messageType = "pitchbendchange";
                var t = r.data[2] & 127, i = r.data[1] & 127;
                this.pitchBend = (t << 8) + i;
                break;
            }
          }
          return new d(o);
        }, u.exports = e.default;
      }, {}] }, {}, [1])(1);
    });
  })(G)), G.exports;
}
var J, ne;
function qe() {
  if (ne) return J;
  ne = 1;
  var n = we();
  return J = function(a) {
    return a.listenToMidi = function(c, u) {
      var e = {}, o = u || {}, d = o.gain || function(r) {
        return r / 127;
      };
      return c.onmidimessage = function(r) {
        var t = r.messageType ? r : n(r);
        if (t.messageType === "noteon" && t.velocity === 0 && (t.messageType = "noteoff"), !(o.channel && t.channel !== o.channel))
          switch (t.messageType) {
            case "noteon":
              e[t.key] = a.play(t.key, 0, { gain: d(t.velocity) });
              break;
            case "noteoff":
              e[t.key] && (e[t.key].stop(), delete e[t.key]);
              break;
          }
      }, a;
    }, a;
  }, J;
}
var ie;
function Me() {
  return ie || (ie = 1, (function(n) {
    var a = be(), c = Te(), u = Se(), e = _e(), o = qe();
    function d(r, t, i) {
      return o(e(u(c(a(r, t, i)))));
    }
    n.exports && (n.exports = d), typeof window < "u" && (window.SamplePlayer = d);
  })(V)), V.exports;
}
function oe(n, a) {
  return Array(a + 1).join(n);
}
function C(n) {
  return typeof n == "number";
}
function xe(n) {
  return typeof n == "string";
}
function Pe(n) {
  return typeof n < "u";
}
function se(n, a) {
  return Math.pow(2, (n - 69) / 12) * (a || 440);
}
var ce = /^([a-gA-G])(#{1,}|b{1,}|x{1,}|)(-?\d*)\s*(.*)\s*$/;
function Re() {
  return ce;
}
var Oe = [0, 2, 4, 5, 7, 9, 11];
function q(n, a, c) {
  if (typeof n != "string") return null;
  var u = ce.exec(n);
  if (!u || !a && u[4]) return null;
  var e = { letter: u[1].toUpperCase(), acc: u[2].replace(/x/g, "##") };
  e.pc = e.letter + e.acc, e.step = (e.letter.charCodeAt(0) + 3) % 7, e.alt = e.acc[0] === "b" ? -e.acc.length : e.acc.length;
  var o = Oe[e.step] + e.alt;
  return e.chroma = o < 0 ? 12 + o : o % 12, u[3] && (e.oct = +u[3], e.midi = o + 12 * (e.oct + 1), e.freq = se(e.midi, c)), a && (e.tonicOf = u[4]), e;
}
var Ee = "CDEFGAB";
function ke(n) {
  return C(n) ? n < 0 ? oe("b", -n) : oe("#", n) : "";
}
function je(n) {
  return C(n) ? "" + n : "";
}
function le(n, a, c) {
  return n === null || typeof n > "u" ? null : n.step ? le(n.step, n.alt, n.oct) : n < 0 || n > 6 ? null : Ee.charAt(n) + ke(a) + je(c);
}
function fe(n) {
  if ((C(n) || xe(n)) && n >= 0 && n < 128) return +n;
  var a = q(n);
  return a && Pe(a.midi) ? a.midi : null;
}
function Ne(n, a) {
  var c = fe(n);
  return c === null ? null : se(c, a);
}
function Ve(n) {
  return (q(n) || {}).letter;
}
function Fe(n) {
  return (q(n) || {}).acc;
}
function Be(n) {
  return (q(n) || {}).pc;
}
function De(n) {
  return (q(n) || {}).step;
}
function $e(n) {
  return (q(n) || {}).alt;
}
function Ue(n) {
  return (q(n) || {}).chroma;
}
function Le(n) {
  return (q(n) || {}).oct;
}
const Ge = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  acc: Fe,
  alt: $e,
  build: le,
  chroma: Ue,
  freq: Ne,
  letter: Ve,
  midi: fe,
  oct: Le,
  parse: q,
  pc: Be,
  regex: Re,
  step: De
}, Symbol.toStringTag, { value: "Module" })), Je = /* @__PURE__ */ he(Ge);
var I, ae;
function Ie() {
  if (ae) return I;
  ae = 1;
  var n = Je;
  function a(e, o) {
    if (console.warn("new Soundfont() is deprected"), console.log("Please use Soundfont.instrument() instead of new Soundfont().instrument()"), !(this instanceof a)) return new a(e);
    this.nameToUrl = o || a.nameToUrl, this.ctx = e, this.instruments = {}, this.promises = [];
  }
  a.prototype.onready = function(e) {
    console.warn("deprecated API"), console.log("Please use Promise.all(Soundfont.instrument(), Soundfont.instrument()).then() instead of new Soundfont().onready()"), Promise.all(this.promises).then(e);
  }, a.prototype.instrument = function(e, o) {
    console.warn("new Soundfont().instrument() is deprecated."), console.log("Please use Soundfont.instrument() instead.");
    var d = this.ctx;
    if (e = e || "default", e in this.instruments) return this.instruments[e];
    var r = { name: e, play: u(d, o) };
    if (this.instruments[e] = r, e !== "default") {
      var t = a.instrument(d, e, o).then(function(i) {
        return r.play = i.play, r;
      });
      this.promises.push(t), r.onready = function(i) {
        console.warn("onready is deprecated. Use Soundfont.instrument().then()"), t.then(i);
      };
    } else
      r.onready = function(i) {
        console.warn("onready is deprecated. Use Soundfont.instrument().then()"), i();
      };
    return r;
  };
  function c(e, o, d) {
    return console.warn("Soundfont.loadBuffers is deprecate."), console.log("Use Soundfont.instrument(..) and get buffers properties from the result."), a.instrument(e, o, d).then(function(r) {
      return r.buffers;
    });
  }
  a.loadBuffers = c;
  function u(e, o) {
    return o = o || {}, function(d, r, t, i) {
      console.warn("The oscillator player is deprecated."), console.log("Starting with version 0.9.0 you will have to wait until the soundfont is loaded to play sounds.");
      var l = d > 0 && d < 129 ? +d : n.midi(d), s = l ? n.midiToFreq(l, 440) : null;
      if (s) {
        t = t || 0.2, i = i || {};
        var h = i.destination || o.destination || e.destination, g = i.vcoType || o.vcoType || "sine", A = i.gain || o.gain || 0.4, b = e.createOscillator();
        b.type = g, b.frequency.value = s;
        var p = e.createGain();
        return p.gain.value = A, b.connect(p), p.connect(h), b.start(r), t > 0 && b.stop(r + t), b;
      }
    };
  }
  return a.noteToMidi = n.midi, I = a, I;
}
var ue;
function Ce() {
  return ue || (ue = 1, (function(n) {
    var a = ge(), c = Me();
    function u(r, t, i) {
      if (arguments.length === 1) return function(A, b) {
        return u(r, A, b);
      };
      var l = i || {}, s = l.isSoundfontURL || e, h = l.nameToUrl || o, g = s(t) ? t : h(t, l.soundfont, l.format);
      return a(r, g, { only: l.only || l.notes }).then(function(A) {
        var b = c(r, A, l).connect(l.destination ? l.destination : r.destination);
        return b.url = g, b.name = t, b;
      });
    }
    function e(r) {
      return /\.js(\?.*)?$/i.test(r);
    }
    function o(r, t, i) {
      return i = i === "ogg" ? i : "mp3", t = t === "FluidR3_GM" ? t : "MusyngKite", "https://gleitz.github.io/midi-js-soundfonts/" + t + "/" + r + "-" + i + ".js";
    }
    var d = Ie();
    d.instrument = u, d.nameToUrl = o, n.exports && (n.exports = d), typeof window < "u" && (window.Soundfont = d);
  })(E)), E.exports;
}
var Xe = Ce();
const ze = /* @__PURE__ */ ve(Xe), He = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ze
}, Symbol.toStringTag, { value: "Module" }));
export {
  He as i
};
