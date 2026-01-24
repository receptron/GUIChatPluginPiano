/* empty css               */
import { PianoSynth as le, TOOL_NAME as ie, SAMPLES as ce, pluginCore as ue } from "./core.js";
import { SYSTEM_PROMPT as Se, TOOL_DEFINITION as Pe, chordToNotes as Ae, executePiano as ke, noteToFrequency as Ce } from "./core.js";
import de, { useState as U, useRef as fe, useEffect as q, useCallback as A } from "react";
var F = { exports: {} }, k = {};
var H;
function me() {
  if (H) return k;
  H = 1;
  var d = /* @__PURE__ */ Symbol.for("react.transitional.element"), o = /* @__PURE__ */ Symbol.for("react.fragment");
  function N(j, f, i) {
    var v = null;
    if (i !== void 0 && (v = "" + i), f.key !== void 0 && (v = "" + f.key), "key" in f) {
      i = {};
      for (var m in f)
        m !== "key" && (i[m] = f[m]);
    } else i = f;
    return f = i.ref, {
      $$typeof: d,
      type: j,
      key: v,
      ref: f !== void 0 ? f : null,
      props: i
    };
  }
  return k.Fragment = o, k.jsx = N, k.jsxs = N, k;
}
var C = {};
var Z;
function be() {
  return Z || (Z = 1, process.env.NODE_ENV !== "production" && (function() {
    function d(e) {
      if (e == null) return null;
      if (typeof e == "function")
        return e.$$typeof === oe ? null : e.displayName || e.name || null;
      if (typeof e == "string") return e;
      switch (e) {
        case t:
          return "Fragment";
        case s:
          return "Profiler";
        case a:
          return "StrictMode";
        case x:
          return "Suspense";
        case te:
          return "SuspenseList";
        case ne:
          return "Activity";
      }
      if (typeof e == "object")
        switch (typeof e.tag == "number" && console.error(
          "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."
        ), e.$$typeof) {
          case L:
            return "Portal";
          case g:
            return e.displayName || "Context";
          case y:
            return (e._context.displayName || "Context") + ".Consumer";
          case w:
            var r = e.render;
            return e = e.displayName, e || (e = r.displayName || r.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
          case re:
            return r = e.displayName || null, r !== null ? r : d(e.type) || "Memo";
          case Y:
            r = e._payload, e = e._init;
            try {
              return d(e(r));
            } catch {
            }
        }
      return null;
    }
    function o(e) {
      return "" + e;
    }
    function N(e) {
      try {
        o(e);
        var r = !1;
      } catch {
        r = !0;
      }
      if (r) {
        r = console;
        var l = r.error, c = typeof Symbol == "function" && Symbol.toStringTag && e[Symbol.toStringTag] || e.constructor.name || "Object";
        return l.call(
          r,
          "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
          c
        ), o(e);
      }
    }
    function j(e) {
      if (e === t) return "<>";
      if (typeof e == "object" && e !== null && e.$$typeof === Y)
        return "<...>";
      try {
        var r = d(e);
        return r ? "<" + r + ">" : "<...>";
      } catch {
        return "<...>";
      }
    }
    function f() {
      var e = $.A;
      return e === null ? null : e.getOwner();
    }
    function i() {
      return Error("react-stack-top-frame");
    }
    function v(e) {
      if (V.call(e, "key")) {
        var r = Object.getOwnPropertyDescriptor(e, "key").get;
        if (r && r.isReactWarning) return !1;
      }
      return e.key !== void 0;
    }
    function m(e, r) {
      function l() {
        J || (J = !0, console.error(
          "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)",
          r
        ));
      }
      l.isReactWarning = !0, Object.defineProperty(e, "key", {
        get: l,
        configurable: !0
      });
    }
    function _() {
      var e = d(this.type);
      return z[e] || (z[e] = !0, console.error(
        "Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."
      )), e = this.props.ref, e !== void 0 ? e : null;
    }
    function h(e, r, l, c, M, G) {
      var u = l.ref;
      return e = {
        $$typeof: D,
        type: e,
        key: r,
        props: l,
        _owner: c
      }, (u !== void 0 ? u : null) !== null ? Object.defineProperty(e, "ref", {
        enumerable: !1,
        get: _
      }) : Object.defineProperty(e, "ref", { enumerable: !1, value: null }), e._store = {}, Object.defineProperty(e._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: 0
      }), Object.defineProperty(e, "_debugInfo", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: null
      }), Object.defineProperty(e, "_debugStack", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: M
      }), Object.defineProperty(e, "_debugTask", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: G
      }), Object.freeze && (Object.freeze(e.props), Object.freeze(e)), e;
    }
    function T(e, r, l, c, M, G) {
      var u = r.children;
      if (u !== void 0)
        if (c)
          if (ae(u)) {
            for (c = 0; c < u.length; c++)
              S(u[c]);
            Object.freeze && Object.freeze(u);
          } else
            console.error(
              "React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead."
            );
        else S(u);
      if (V.call(r, "key")) {
        u = d(e);
        var P = Object.keys(r).filter(function(se) {
          return se !== "key";
        });
        c = 0 < P.length ? "{key: someKey, " + P.join(": ..., ") + ": ...}" : "{key: someKey}", X[u + c] || (P = 0 < P.length ? "{" + P.join(": ..., ") + ": ...}" : "{}", console.error(
          `A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`,
          c,
          u,
          P,
          u
        ), X[u + c] = !0);
      }
      if (u = null, l !== void 0 && (N(l), u = "" + l), v(r) && (N(r.key), u = "" + r.key), "key" in r) {
        l = {};
        for (var W in r)
          W !== "key" && (l[W] = r[W]);
      } else l = r;
      return u && m(
        l,
        typeof e == "function" ? e.displayName || e.name || "Unknown" : e
      ), h(
        e,
        u,
        l,
        f(),
        M,
        G
      );
    }
    function S(e) {
      O(e) ? e._store && (e._store.validated = 1) : typeof e == "object" && e !== null && e.$$typeof === Y && (e._payload.status === "fulfilled" ? O(e._payload.value) && e._payload.value._store && (e._payload.value._store.validated = 1) : e._store && (e._store.validated = 1));
    }
    function O(e) {
      return typeof e == "object" && e !== null && e.$$typeof === D;
    }
    var R = de, D = /* @__PURE__ */ Symbol.for("react.transitional.element"), L = /* @__PURE__ */ Symbol.for("react.portal"), t = /* @__PURE__ */ Symbol.for("react.fragment"), a = /* @__PURE__ */ Symbol.for("react.strict_mode"), s = /* @__PURE__ */ Symbol.for("react.profiler"), y = /* @__PURE__ */ Symbol.for("react.consumer"), g = /* @__PURE__ */ Symbol.for("react.context"), w = /* @__PURE__ */ Symbol.for("react.forward_ref"), x = /* @__PURE__ */ Symbol.for("react.suspense"), te = /* @__PURE__ */ Symbol.for("react.suspense_list"), re = /* @__PURE__ */ Symbol.for("react.memo"), Y = /* @__PURE__ */ Symbol.for("react.lazy"), ne = /* @__PURE__ */ Symbol.for("react.activity"), oe = /* @__PURE__ */ Symbol.for("react.client.reference"), $ = R.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, V = Object.prototype.hasOwnProperty, ae = Array.isArray, I = console.createTask ? console.createTask : function() {
      return null;
    };
    R = {
      react_stack_bottom_frame: function(e) {
        return e();
      }
    };
    var J, z = {}, B = R.react_stack_bottom_frame.bind(
      R,
      i
    )(), K = I(j(i)), X = {};
    C.Fragment = t, C.jsx = function(e, r, l) {
      var c = 1e4 > $.recentlyCreatedOwnerStacks++;
      return T(
        e,
        r,
        l,
        !1,
        c ? Error("react-stack-top-frame") : B,
        c ? I(j(e)) : K
      );
    }, C.jsxs = function(e, r, l) {
      var c = 1e4 > $.recentlyCreatedOwnerStacks++;
      return T(
        e,
        r,
        l,
        !0,
        c ? Error("react-stack-top-frame") : B,
        c ? I(j(e)) : K
      );
    };
  })()), C;
}
var Q;
function pe() {
  return Q || (Q = 1, process.env.NODE_ENV === "production" ? F.exports = me() : F.exports = be()), F.exports;
}
var n = pe();
const xe = (d) => new Promise((o) => setTimeout(o, d));
function ye({ selectedResult: d }) {
  const [o, N] = U(null), [j, f] = U(/* @__PURE__ */ new Set()), [i, v] = U(!1), m = fe(null);
  q(() => (m.current = new le(), () => {
    m.current = null;
  }), []);
  const _ = A(async (t) => {
    f((a) => {
      const s = new Set(a);
      return s.add(t), s;
    }), m.current && (await m.current.resume(), m.current.startSustainedNote(t));
  }, []), h = A((t) => {
    m.current && m.current.stopSustainedNote(t), f((a) => {
      const s = new Set(a);
      return s.delete(t), s;
    });
  }, []), T = A(async (t, a) => {
    if (m.current) {
      await m.current.resume();
      for (let s = 0; s < t.length; s += 1) {
        const y = t[s], g = a[s] || 500;
        m.current.playNote(y, g), f((w) => {
          const x = new Set(w);
          return x.add(y), x;
        }), setTimeout(() => {
          f((w) => {
            const x = new Set(w);
            return x.delete(y), x;
          });
        }, g), await xe(g);
      }
    }
  }, []), S = A(async (t) => {
    if (!t.melody || i) return;
    v(!0);
    const a = t.melody, s = a.durations || a.notes.map(() => 500);
    try {
      await T(a.notes, s);
    } finally {
      v(!1);
    }
  }, [i, T]), O = A(async (t) => {
    if (i || t.args.action !== "play_melody" || !t.args.melody) return;
    const a = t.args.melody;
    if (!a.notes || a.notes.length === 0) return;
    v(!0);
    const s = a.durations || a.notes.map(() => 500);
    try {
      await T(a.notes, s);
    } finally {
      v(!1);
    }
  }, [i, T]);
  q(() => {
    if (d?.toolName === ie && d.data) {
      const t = d.data;
      N(t), t.state.lastPlayed.length > 0 && t.state.lastPlayed.forEach((a) => {
        _(a), setTimeout(() => h(a), 500);
      }), t.state.isPlaying && t.melody && S(t);
    }
  }, [d, _, h, S]), q(() => {
    const t = (s) => {
      const y = s.target, g = y?.tagName?.toLowerCase();
      if (g === "input" || g === "textarea" || y?.isContentEditable || s.repeat) return;
      const w = s.key.toLowerCase(), x = ee[w];
      x && _(x);
    }, a = (s) => {
      const y = s.target, g = y?.tagName?.toLowerCase();
      if (g === "input" || g === "textarea" || y?.isContentEditable)
        return;
      const w = s.key.toLowerCase(), x = ee[w];
      x && h(x);
    };
    return window.addEventListener("keydown", t), window.addEventListener("keyup", a), () => {
      window.removeEventListener("keydown", t), window.removeEventListener("keyup", a);
    };
  }, [_, h]);
  const R = (t) => j.has(t), D = o?.melody && o.melody.notes.length > 0, L = ce.filter(
    (t) => t.args.action === "play_melody" && t.args.melody && t.args.melody.notes && t.name !== "Play C Major Scale"
  );
  return o ? /* @__PURE__ */ n.jsx("div", { className: "w-full min-h-[600px] overflow-x-auto overflow-y-auto p-8 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 rounded-lg", children: /* @__PURE__ */ n.jsxs("div", { className: "w-full mx-auto min-h-[500px] flex flex-col justify-center", children: [
    o.state.title && /* @__PURE__ */ n.jsx("h2", { className: "text-white text-3xl font-bold mb-8 text-center", children: o.state.title }),
    o.state.chord && /* @__PURE__ */ n.jsx("div", { className: "text-center mb-6 text-2xl font-semibold text-purple-300", children: o.state.chord }),
    /* @__PURE__ */ n.jsx("div", { className: "flex justify-center mb-8", children: /* @__PURE__ */ n.jsxs("div", { className: "relative inline-block", children: [
      /* @__PURE__ */ n.jsx("div", { className: "flex", children: ge.map((t) => /* @__PURE__ */ n.jsx(
        "div",
        {
          className: `relative w-12 h-40 bg-white border-2 border-gray-300 rounded-b-lg cursor-pointer hover:bg-gray-100 active:bg-gray-200 transition-colors duration-75 flex items-end justify-center pb-3 ${R(t.note) ? "!bg-blue-200 !border-blue-400" : ""}`,
          onMouseDown: () => _(t.note),
          onMouseUp: () => h(t.note),
          onMouseLeave: () => h(t.note),
          children: /* @__PURE__ */ n.jsx("span", { className: "text-xs text-gray-500 font-semibold select-none", children: t.label })
        },
        t.note
      )) }),
      ve.map((t) => /* @__PURE__ */ n.jsx(
        "div",
        {
          className: `absolute top-0 w-7 h-24 bg-gray-900 border-2 border-gray-700 rounded-b-md cursor-pointer z-10 hover:bg-gray-800 active:bg-gray-700 transition-colors duration-75 ${R(t.note) ? "!bg-blue-600 !border-blue-500" : ""}`,
          style: { left: `${t.position}px` },
          onMouseDown: () => _(t.note),
          onMouseUp: () => h(t.note),
          onMouseLeave: () => h(t.note),
          children: E[t.note] && /* @__PURE__ */ n.jsx("span", { className: "absolute bottom-1 left-1/2 -translate-x-1/2 text-xs text-gray-100 font-semibold select-none", children: E[t.note] })
        },
        t.note
      ))
    ] }) }),
    D && /* @__PURE__ */ n.jsx("div", { className: "flex justify-center gap-4 mb-6", children: /* @__PURE__ */ n.jsx(
      "button",
      {
        onClick: () => S(o),
        disabled: i,
        className: `py-3 px-6 rounded-lg font-semibold text-lg transition-colors ${i ? "bg-gray-600 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700 text-white"}`,
        children: i ? "Playing..." : "Play Melody"
      }
    ) }),
    /* @__PURE__ */ n.jsxs("div", { className: "mb-6", children: [
      /* @__PURE__ */ n.jsx("h3", { className: "text-white text-lg font-semibold mb-3 text-center", children: "Select a Song" }),
      /* @__PURE__ */ n.jsx("div", { className: "flex flex-wrap justify-center gap-2", children: L.map((t) => /* @__PURE__ */ n.jsx(
        "button",
        {
          onClick: () => O(t),
          disabled: i,
          className: `py-2 px-4 rounded-lg font-medium text-sm transition-colors ${i ? "bg-gray-600 cursor-not-allowed text-gray-400" : "bg-indigo-600 hover:bg-indigo-700 text-white"}`,
          children: t.args.title || t.name
        },
        t.name
      )) })
    ] }),
    /* @__PURE__ */ n.jsxs("div", { className: "text-center text-gray-300 text-sm", children: [
      /* @__PURE__ */ n.jsx("p", { children: "Click keys to play notes" }),
      /* @__PURE__ */ n.jsx("p", { className: "mt-1 text-gray-400", children: "Keyboard: A-K keys play C4-C5" })
    ] })
  ] }) }) : null;
}
const E = {
  C4: "A",
  "C#4": "W",
  D4: "S",
  "D#4": "E",
  E4: "D",
  F4: "F",
  "F#4": "T",
  G4: "G",
  "G#4": "Y",
  A4: "H",
  "A#4": "U",
  B4: "J",
  C5: "K"
}, ge = [
  { note: "C3", label: "" },
  { note: "D3", label: "" },
  { note: "E3", label: "" },
  { note: "F3", label: "" },
  { note: "G3", label: "" },
  { note: "A3", label: "" },
  { note: "B3", label: "" },
  { note: "C4", label: E.C4 },
  { note: "D4", label: E.D4 },
  { note: "E4", label: E.E4 },
  { note: "F4", label: E.F4 },
  { note: "G4", label: E.G4 },
  { note: "A4", label: E.A4 },
  { note: "B4", label: E.B4 },
  { note: "C5", label: E.C5 },
  { note: "D5", label: "" },
  { note: "E5", label: "" },
  { note: "F5", label: "" },
  { note: "G5", label: "" },
  { note: "A5", label: "" },
  { note: "B5", label: "" }
], b = 48, p = 28, ve = [
  // Octave 3: C3=0, D3=1, E3=2, F3=3, G3=4, A3=5, B3=6
  { note: "C#3", position: b * 1 - p / 2 },
  { note: "D#3", position: b * 2 - p / 2 },
  { note: "F#3", position: b * 4 - p / 2 },
  { note: "G#3", position: b * 5 - p / 2 },
  { note: "A#3", position: b * 6 - p / 2 },
  // Octave 4: C4=7, D4=8, E4=9, F4=10, G4=11, A4=12, B4=13
  { note: "C#4", position: b * 8 - p / 2 },
  { note: "D#4", position: b * 9 - p / 2 },
  { note: "F#4", position: b * 11 - p / 2 },
  { note: "G#4", position: b * 12 - p / 2 },
  { note: "A#4", position: b * 13 - p / 2 },
  // Octave 5: C5=14, D5=15, E5=16, F5=17, G5=18, A5=19, B5=20
  { note: "C#5", position: b * 15 - p / 2 },
  { note: "D#5", position: b * 16 - p / 2 },
  { note: "F#5", position: b * 18 - p / 2 },
  { note: "G#5", position: b * 19 - p / 2 },
  { note: "A#5", position: b * 20 - p / 2 }
], ee = {
  a: "C4",
  w: "C#4",
  s: "D4",
  e: "D#4",
  d: "E4",
  f: "F4",
  t: "F#4",
  g: "G4",
  y: "G#4",
  h: "A4",
  u: "A#4",
  j: "B4",
  k: "C5"
};
function he({ result: d }) {
  const o = d.data;
  return o ? /* @__PURE__ */ n.jsx("div", { className: "p-3 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg", children: /* @__PURE__ */ n.jsxs("div", { className: "flex flex-col gap-2", children: [
    /* @__PURE__ */ n.jsx("div", { className: "text-3xl text-center", children: "🎹" }),
    /* @__PURE__ */ n.jsx("div", { className: "text-sm font-semibold text-gray-800 text-center truncate", children: o.state.title || "Piano" }),
    o.state.chord && /* @__PURE__ */ n.jsx("div", { className: "text-center", children: /* @__PURE__ */ n.jsx("span", { className: "inline-block bg-purple-600 text-white text-xs font-bold py-1 px-3 rounded-full", children: o.state.chord }) }),
    o.melody && /* @__PURE__ */ n.jsxs("div", { className: "text-xs text-center text-gray-600", children: [
      o.melody.notes.length,
      " notes"
    ] }),
    !o.melody && o.state.lastPlayed.length > 0 && /* @__PURE__ */ n.jsx("div", { className: "text-xs text-center text-gray-600", children: o.state.lastPlayed.join(", ") })
  ] }) }) : null;
}
const Ee = {
  ...ue,
  ViewComponent: ye,
  PreviewComponent: he
}, je = { plugin: Ee };
export {
  le as PianoSynth,
  he as Preview,
  ce as SAMPLES,
  Se as SYSTEM_PROMPT,
  Pe as TOOL_DEFINITION,
  ie as TOOL_NAME,
  ye as View,
  Ae as chordToNotes,
  je as default,
  ke as executePiano,
  Ce as noteToFrequency,
  Ee as plugin,
  ue as pluginCore
};
