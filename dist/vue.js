/* empty css               */
import { PianoSynth as V, TOOL_NAME as j, SAMPLES as B, pluginCore as O } from "./core.js";
import { SYSTEM_PROMPT as Se, TOOL_DEFINITION as De, chordToNotes as Ee, executePiano as Ae, noteToFrequency as Fe } from "./core.js";
import { defineComponent as E, ref as f, onMounted as I, onUnmounted as z, watch as R, computed as m, createElementBlock as a, openBlock as s, createElementVNode as l, toDisplayString as u, createCommentVNode as p, Fragment as k, renderList as _, normalizeClass as w, normalizeStyle as U } from "vue";
const q = { class: "size-full min-h-[600px] overflow-x-auto overflow-y-auto p-8 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900" }, H = {
  key: 0,
  class: "text-white text-center mt-10"
}, J = { class: "mt-4 text-xs text-left max-w-2xl mx-auto bg-gray-800 p-4 rounded" }, Y = { class: "mt-2 text-xs overflow-auto" }, Q = {
  key: 1,
  class: "w-full mx-auto min-h-[500px] flex flex-col justify-center"
}, X = {
  key: 0,
  class: "text-white text-3xl font-bold mb-8 text-center"
}, Z = {
  key: 1,
  class: "text-center mb-6 text-2xl font-semibold text-purple-300"
}, ee = { class: "flex justify-center mb-8" }, te = { class: "relative inline-block" }, oe = { class: "flex" }, le = ["onMousedown", "onMouseup", "onMouseleave"], ne = { class: "text-xs text-gray-500 font-semibold select-none" }, ae = ["onMousedown", "onMouseup", "onMouseleave"], se = {
  key: 0,
  class: "absolute bottom-1 left-1/2 -translate-x-1/2 text-xs text-gray-100 font-semibold select-none"
}, ie = {
  key: 2,
  class: "flex justify-center gap-4 mb-6"
}, re = ["disabled"], de = { class: "mb-6" }, ue = { class: "flex flex-wrap justify-center gap-2" }, ce = ["onClick", "disabled"], ye = /* @__PURE__ */ E({
  __name: "View",
  props: {
    selectedResult: {},
    sendTextMessage: { type: Function }
  },
  setup(b) {
    const h = b, n = f(null), y = f(/* @__PURE__ */ new Set()), i = f(!1), r = f(null), A = (e) => new Promise((t) => setTimeout(t, e));
    I(() => {
      n.value = new V(), window.addEventListener("keydown", K), window.addEventListener("keyup", P);
    }), z(() => {
      window.removeEventListener("keydown", K), window.removeEventListener("keyup", P);
    }), R(
      () => h.selectedResult,
      (e) => {
        console.log("Piano View - selectedResult changed:", e), console.log("Piano View - toolName:", e?.toolName), console.log("Piano View - data:", e?.data), e?.toolName === j && e.data ? (r.value = e.data, console.log("Piano View - pianoData set:", r.value), r.value.state.lastPlayed.length > 0 && r.value.state.lastPlayed.forEach((t) => {
          x(t), setTimeout(() => g(t), 500);
        }), r.value.state.isPlaying && r.value.melody && N()) : (console.log("Piano View - No valid data, clearing pianoData"), r.value = null);
      },
      { immediate: !0, deep: !0 }
    );
    const c = {
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
    }, F = m(() => [
      { note: "C3", label: "" },
      { note: "D3", label: "" },
      { note: "E3", label: "" },
      { note: "F3", label: "" },
      { note: "G3", label: "" },
      { note: "A3", label: "" },
      { note: "B3", label: "" },
      { note: "C4", label: c.C4 },
      { note: "D4", label: c.D4 },
      { note: "E4", label: c.E4 },
      { note: "F4", label: c.F4 },
      { note: "G4", label: c.G4 },
      { note: "A4", label: c.A4 },
      { note: "B4", label: c.B4 },
      { note: "C5", label: c.C5 },
      { note: "D5", label: "" },
      { note: "E5", label: "" },
      { note: "F5", label: "" },
      { note: "G5", label: "" },
      { note: "A5", label: "" },
      { note: "B5", label: "" }
    ]), $ = m(() => [
      // Octave 3: C3=0, D3=1, E3=2, F3=3, G3=4, A3=5, B3=6
      { note: "C#3", position: 34, label: "" },
      { note: "D#3", position: 82, label: "" },
      { note: "F#3", position: 178, label: "" },
      { note: "G#3", position: 226, label: "" },
      { note: "A#3", position: 274, label: "" },
      // Octave 4: C4=7, D4=8, E4=9, F4=10, G4=11, A4=12, B4=13
      { note: "C#4", position: 370, label: c["C#4"] },
      { note: "D#4", position: 418, label: c["D#4"] },
      { note: "F#4", position: 514, label: c["F#4"] },
      { note: "G#4", position: 562, label: c["G#4"] },
      { note: "A#4", position: 610, label: c["A#4"] },
      // Octave 5: C5=14, D5=15, E5=16, F5=17, G5=18, A5=19, B5=20
      { note: "C#5", position: 706, label: "" },
      { note: "D#5", position: 754, label: "" },
      { note: "F#5", position: 850, label: "" },
      { note: "G#5", position: 898, label: "" },
      { note: "A#5", position: 946, label: "" }
    ]), W = {
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
    }, L = m(() => r.value?.melody && r.value.melody.notes.length > 0), G = m(
      () => B.filter(
        (e) => e.args.action === "play_melody" && e.args.melody && e.args.melody.notes && e.name !== "Play C Major Scale"
      )
    );
    function C(e) {
      return y.value.has(e);
    }
    async function x(e) {
      const t = new Set(y.value);
      t.add(e), y.value = t, n.value && (await n.value.resume(), n.value.startSustainedNote(e));
    }
    function g(e) {
      n.value && n.value.stopSustainedNote(e);
      const t = new Set(y.value);
      t.delete(e), y.value = t;
    }
    async function N() {
      if (!r.value?.melody || i.value) return;
      i.value = !0;
      const e = r.value.melody, t = e.durations || e.notes.map(() => 500);
      try {
        await M(e.notes, t);
      } finally {
        i.value = !1;
      }
    }
    async function T(e) {
      if (i.value || e.args.action !== "play_melody" || !e.args.melody) return;
      const t = e.args.melody;
      if (!t.notes || t.notes.length === 0) return;
      i.value = !0;
      const o = t.durations || t.notes.map(() => 500);
      try {
        await M(t.notes, o);
      } finally {
        i.value = !1;
      }
    }
    async function M(e, t) {
      if (n.value) {
        await n.value.resume();
        for (let o = 0; o < e.length; o += 1) {
          const d = e[o], v = t[o] || 500;
          n.value.playNote(d, v);
          const S = new Set(y.value);
          S.add(d), y.value = S, setTimeout(() => {
            const D = new Set(y.value);
            D.delete(d), y.value = D;
          }, v), await A(v);
        }
      }
    }
    function K(e) {
      const t = e.target, o = t?.tagName?.toLowerCase();
      if (o === "input" || o === "textarea" || t?.isContentEditable || e.repeat) return;
      const d = e.key.toLowerCase(), v = W[d];
      v && x(v);
    }
    function P(e) {
      const t = e.target, o = t?.tagName?.toLowerCase();
      if (o === "input" || o === "textarea" || t?.isContentEditable)
        return;
      const d = e.key.toLowerCase(), v = W[d];
      v && g(v);
    }
    return (e, t) => (s(), a("div", q, [
      r.value ? (s(), a("div", Q, [
        r.value.state.title ? (s(), a("h2", X, u(r.value.state.title), 1)) : p("", !0),
        r.value.state.chord ? (s(), a("div", Z, u(r.value.state.chord), 1)) : p("", !0),
        l("div", ee, [
          l("div", te, [
            l("div", oe, [
              (s(!0), a(k, null, _(F.value, (o) => (s(), a("div", {
                key: o.note,
                class: w([
                  "relative w-12 h-40 bg-white border-2 border-gray-300 rounded-b-lg cursor-pointer",
                  "hover:bg-gray-100 active:bg-gray-200 transition-colors duration-75",
                  "flex items-end justify-center pb-3",
                  { "!bg-blue-200 !border-blue-400": C(o.note) }
                ]),
                onMousedown: (d) => x(o.note),
                onMouseup: (d) => g(o.note),
                onMouseleave: (d) => g(o.note)
              }, [
                l("span", ne, u(o.label), 1)
              ], 42, le))), 128))
            ]),
            (s(!0), a(k, null, _($.value, (o) => (s(), a("div", {
              key: o.note,
              class: w([
                "absolute top-0 w-7 h-24 bg-gray-900 border-2 border-gray-700 rounded-b-md cursor-pointer z-10",
                "hover:bg-gray-800 active:bg-gray-700 transition-colors duration-75",
                { "!bg-blue-600 !border-blue-500": C(o.note) }
              ]),
              style: U({ left: o.position + "px" }),
              onMousedown: (d) => x(o.note),
              onMouseup: (d) => g(o.note),
              onMouseleave: (d) => g(o.note)
            }, [
              o.label ? (s(), a("span", se, u(o.label), 1)) : p("", !0)
            ], 46, ae))), 128))
          ])
        ]),
        L.value ? (s(), a("div", ie, [
          l("button", {
            onClick: N,
            disabled: i.value,
            class: w([
              "py-3 px-6 rounded-lg font-semibold text-lg transition-colors",
              i.value ? "bg-gray-600 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700 text-white"
            ])
          }, u(i.value ? "Playing..." : "Play Melody"), 11, re)
        ])) : p("", !0),
        l("div", de, [
          t[3] || (t[3] = l("h3", { class: "text-white text-lg font-semibold mb-3 text-center" }, " Select a Song ", -1)),
          l("div", ue, [
            (s(!0), a(k, null, _(G.value, (o) => (s(), a("button", {
              key: o.name,
              onClick: (d) => T(o),
              disabled: i.value,
              class: w([
                "py-2 px-4 rounded-lg font-medium text-sm transition-colors",
                i.value ? "bg-gray-600 cursor-not-allowed text-gray-400" : "bg-indigo-600 hover:bg-indigo-700 text-white"
              ])
            }, u(o.args.title || o.name), 11, ce))), 128))
          ])
        ]),
        t[4] || (t[4] = l("div", { class: "text-center text-gray-300 text-sm" }, [
          l("p", null, "Click keys to play notes"),
          l("p", { class: "mt-1 text-gray-400" }, " Keyboard: A-K keys play C4-C5 ")
        ], -1))
      ])) : (s(), a("div", H, [
        t[1] || (t[1] = l("p", null, "Loading piano...", -1)),
        t[2] || (t[2] = l("p", { class: "text-sm text-gray-400 mt-2" }, "Waiting for data", -1)),
        l("div", J, [
          t[0] || (t[0] = l("p", { class: "mb-2" }, "Debug Info:", -1)),
          l("p", null, "selectedResult: " + u(b.selectedResult ? "exists" : "null"), 1),
          l("p", null, "toolName: " + u(b.selectedResult?.toolName), 1),
          l("p", null, "has data: " + u(b.selectedResult?.data ? "yes" : "no"), 1),
          l("pre", Y, u(JSON.stringify(b.selectedResult, null, 2)), 1)
        ])
      ]))
    ]));
  }
}), be = (b, h) => {
  const n = b.__vccOpts || b;
  for (const [y, i] of h)
    n[y] = i;
  return n;
}, ve = /* @__PURE__ */ be(ye, [["__scopeId", "data-v-2197af45"]]), pe = { class: "p-3 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg" }, ge = {
  key: 0,
  class: "flex flex-col gap-2"
}, he = { class: "text-sm font-semibold text-gray-800 text-center truncate" }, me = {
  key: 0,
  class: "text-center"
}, xe = { class: "inline-block bg-purple-600 text-white text-xs font-bold py-1 px-3 rounded-full" }, fe = {
  key: 1,
  class: "text-xs text-center text-gray-600"
}, we = {
  key: 2,
  class: "text-xs text-center text-gray-600"
}, ke = /* @__PURE__ */ E({
  __name: "Preview",
  props: {
    result: {}
  },
  setup(b) {
    const h = b, n = m(() => h.result.data);
    return (y, i) => (s(), a("div", pe, [
      n.value ? (s(), a("div", ge, [
        i[0] || (i[0] = l("div", { class: "text-3xl text-center" }, "🎹", -1)),
        l("div", he, u(n.value.state.title || "Piano"), 1),
        n.value.state.chord ? (s(), a("div", me, [
          l("span", xe, u(n.value.state.chord), 1)
        ])) : p("", !0),
        n.value.melody ? (s(), a("div", fe, u(n.value.melody.notes.length) + " notes ", 1)) : n.value.state.lastPlayed.length > 0 ? (s(), a("div", we, u(n.value.state.lastPlayed.join(", ")), 1)) : p("", !0)
      ])) : p("", !0)
    ]));
  }
}), _e = {
  ...O,
  viewComponent: ve,
  previewComponent: ke
}, Me = { plugin: _e };
export {
  V as PianoSynth,
  ke as Preview,
  B as SAMPLES,
  Se as SYSTEM_PROMPT,
  De as TOOL_DEFINITION,
  j as TOOL_NAME,
  ve as View,
  Ee as chordToNotes,
  Me as default,
  Ae as executePiano,
  Fe as noteToFrequency,
  _e as plugin,
  O as pluginCore
};
