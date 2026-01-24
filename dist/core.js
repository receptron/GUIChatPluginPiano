const p = "playPiano", N = {
  type: "function",
  name: p,
  description: "Display an interactive piano keyboard and play notes, chords, or melodies. Use this when the user wants to play music, learn piano, or hear musical examples.",
  parameters: {
    type: "object",
    properties: {
      action: {
        type: "string",
        enum: ["play_notes", "play_chord", "play_melody", "show_keyboard"],
        description: "Action to perform: play_notes (single/multiple notes), play_chord (named chord), play_melody (sequence), show_keyboard (display only)"
      },
      notes: {
        type: "array",
        items: { type: "string" },
        description: "Notes to play (e.g., ['C4', 'E4', 'G4']). Use scientific pitch notation."
      },
      chord: {
        type: "string",
        description: "Chord name (e.g., 'C', 'Am', 'G7', 'Cmaj7')"
      },
      melody: {
        type: "object",
        properties: {
          notes: {
            type: "array",
            items: { type: "string" },
            description: "Sequence of notes to play"
          },
          durations: {
            type: "array",
            items: { type: "number" },
            description: "Duration of each note in milliseconds"
          },
          tempo: {
            type: "number",
            description: "Tempo in BPM (default: 120)"
          }
        },
        required: ["notes"]
      },
      title: {
        type: "string",
        description: "Optional title for the piano display"
      }
    },
    required: ["action"]
  }
}, E = `You have access to an interactive piano (${p}). Use it when:
- The user asks to play music or hear notes
- The user wants to learn chords or scales
- The user asks for musical examples

Notes use scientific pitch notation: C4 is middle C, A4 is 440Hz.
Available octaves: 3, 4, 5 (C3 to B5)

Common chords: C, Cm, C7, Cmaj7, D, Dm, E, Em, F, Fm, G, Gm, G7, A, Am, Am7, B, Bm

Examples:
- C major scale: ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"]
- Twinkle Twinkle: ["C4", "C4", "G4", "G4", "A4", "A4", "G4"]
`, G = [
  {
    name: "Show Keyboard",
    args: {
      action: "show_keyboard",
      title: "Piano"
    }
  },
  {
    name: "Play C Major Chord",
    args: {
      action: "play_chord",
      chord: "C",
      title: "C Major"
    }
  },
  {
    name: "Play Am Chord",
    args: {
      action: "play_chord",
      chord: "Am",
      title: "A Minor"
    }
  },
  {
    name: "Play Single Note (C4)",
    args: {
      action: "play_notes",
      notes: ["C4"],
      title: "Middle C"
    }
  },
  {
    name: "Play C Major Scale",
    args: {
      action: "play_melody",
      melody: {
        notes: ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"],
        durations: [400, 400, 400, 400, 400, 400, 400, 800],
        tempo: 120
      },
      title: "C Major Scale"
    }
  },
  {
    name: "Twinkle Twinkle",
    args: {
      action: "play_melody",
      melody: {
        notes: [
          "C4",
          "C4",
          "G4",
          "G4",
          "A4",
          "A4",
          "G4",
          "F4",
          "F4",
          "E4",
          "E4",
          "D4",
          "D4",
          "C4"
        ],
        durations: [
          500,
          500,
          500,
          500,
          500,
          500,
          1e3,
          500,
          500,
          500,
          500,
          500,
          500,
          1e3
        ]
      },
      title: "Twinkle Twinkle Little Star"
    }
  },
  {
    name: "Mary Had a Little Lamb",
    args: {
      action: "play_melody",
      melody: {
        notes: [
          "E4",
          "D4",
          "C4",
          "D4",
          "E4",
          "E4",
          "E4",
          "D4",
          "D4",
          "D4",
          "E4",
          "G4",
          "G4",
          "E4",
          "D4",
          "C4",
          "D4",
          "E4",
          "E4",
          "E4",
          "E4",
          "D4",
          "D4",
          "E4",
          "D4",
          "C4"
        ],
        durations: [
          500,
          500,
          500,
          500,
          500,
          500,
          1e3,
          500,
          500,
          1e3,
          500,
          500,
          1e3,
          500,
          500,
          500,
          500,
          500,
          500,
          500,
          500,
          500,
          500,
          500,
          500,
          1e3
        ]
      },
      title: "Mary Had a Little Lamb"
    }
  },
  {
    name: "Happy Birthday",
    args: {
      action: "play_melody",
      melody: {
        notes: [
          "G4",
          "G4",
          "A4",
          "G4",
          "C5",
          "B4",
          "G4",
          "G4",
          "A4",
          "G4",
          "D5",
          "C5",
          "G4",
          "G4",
          "G5",
          "E5",
          "C5",
          "B4",
          "A4",
          "F5",
          "F5",
          "E5",
          "C5",
          "D5",
          "C5"
        ],
        durations: [
          500,
          500,
          1e3,
          1e3,
          1e3,
          1500,
          500,
          500,
          1e3,
          1e3,
          1e3,
          1500,
          500,
          500,
          1e3,
          1e3,
          1e3,
          1e3,
          1500,
          500,
          500,
          1e3,
          1e3,
          1e3,
          2e3
        ]
      },
      title: "Happy Birthday"
    }
  }
];
function g(d) {
  const e = {
    C: 0,
    "C#": 1,
    Db: 1,
    D: 2,
    "D#": 3,
    Eb: 3,
    E: 4,
    F: 5,
    "F#": 6,
    Gb: 6,
    G: 7,
    "G#": 8,
    Ab: 8,
    A: 9,
    "A#": 10,
    Bb: 10,
    B: 11
  }, t = d.match(/^([A-G]#?b?)(\d)$/);
  if (!t) throw new Error(`Invalid note: ${d}`);
  const [, n, o] = t, i = parseInt(o), r = e[n];
  if (r === void 0)
    throw new Error(`Invalid note name: ${n}`);
  const s = (i - 4) * 12 + r - 9;
  return 440 * Math.pow(2, s / 12);
}
function D(d) {
  const t = {
    C: ["C4", "E4", "G4"],
    Cm: ["C4", "Eb4", "G4"],
    C7: ["C4", "E4", "G4", "Bb4"],
    Cmaj7: ["C4", "E4", "G4", "B4"],
    D: ["D4", "F#4", "A4"],
    Dm: ["D4", "F4", "A4"],
    E: ["E4", "G#4", "B4"],
    Em: ["E4", "G4", "B4"],
    F: ["F4", "A4", "C5"],
    Fm: ["F4", "Ab4", "C5"],
    G: ["G4", "B4", "D5"],
    Gm: ["G4", "Bb4", "D5"],
    G7: ["G4", "B4", "D5", "F5"],
    A: ["A4", "C#5", "E5"],
    Am: ["A4", "C5", "E5"],
    Am7: ["A4", "C5", "E5", "G5"],
    B: ["B4", "D#5", "F#5"],
    Bm: ["B4", "D5", "F#5"]
  }[d];
  if (!t)
    throw new Error(`Unknown chord: ${d}`);
  return t;
}
function C(d) {
  return new Promise((e) => setTimeout(e, d));
}
const A = [
  "C3",
  "C#3",
  "D3",
  "D#3",
  "E3",
  "F3",
  "F#3",
  "G3",
  "G#3",
  "A3",
  "A#3",
  "B3",
  "C4",
  "C#4",
  "D4",
  "D#4",
  "E4",
  "F4",
  "F#4",
  "G4",
  "G#4",
  "A4",
  "A#4",
  "B4",
  "C5",
  "C#5",
  "D5",
  "D#5",
  "E5",
  "F5",
  "F#5",
  "G5",
  "G#5",
  "A5",
  "A#5",
  "B5"
];
class k {
  audioContext = null;
  instrument = null;
  instrumentPromise = null;
  instrumentFailed = !1;
  audioUnlocked = !1;
  warmupDone = !1;
  sustainedNotes = /* @__PURE__ */ new Map();
  soundfontTimeoutMs = 600;
  constructor() {
  }
  /**
   * Play a single note
   * @param note - Note in scientific pitch notation
   * @param duration - Duration in milliseconds (default: 500ms)
   */
  async playNote(e, t = 500) {
    try {
      const n = this.ensureAudioContext();
      if (!n) {
        this.debug("playNote: no AudioContext available");
        return;
      }
      n.state === "suspended" && await this.resume();
      const o = await this.waitForInstrumentReady(150);
      if (o && this.instrument) {
        this.debug("playNote: using soundfont", { note: e, duration: t, t: performance.now() }), this.instrument.play(e, 0, {
          gain: 0.8,
          duration: t / 1e3
        }), this.debug("playNote: soundfont dispatched", { note: e, t: performance.now() });
        return;
      }
      this.debug("playNote: using synth fallback", {
        note: e,
        duration: t,
        t: performance.now(),
        instrumentReady: o
      }), this.playSynthNote(e, t), this.debug("playNote: synth dispatched", { note: e, t: performance.now() });
    } catch (n) {
      console.error("Error playing note:", n);
    }
  }
  /**
   * Play multiple notes simultaneously (chord)
   * @param notes - Array of notes in scientific pitch notation
   * @param duration - Duration in milliseconds (default: 500ms)
   */
  playChord(e, t = 500) {
    e.forEach((n) => this.playNote(n, t));
  }
  /**
   * Play a melody (sequence of notes)
   * @param notes - Array of notes to play in sequence
   * @param durations - Duration of each note in milliseconds
   * @returns Promise that resolves when melody finishes
   */
  async playMelody(e, t) {
    for (let n = 0; n < e.length; n++) {
      const o = t[n] || 500;
      this.playNote(e[n], o), await C(o);
    }
  }
  /**
   * Start a sustained note that continues until stopSustainedNote is called
   * @param note - Note in scientific pitch notation
   */
  async startSustainedNote(e) {
    try {
      const t = this.ensureAudioContext();
      if (!t) {
        this.debug("startSustainedNote: no AudioContext available");
        return;
      }
      if (t.state !== "running" && await this.resume(), this.stopSustainedNote(e), await this.waitForInstrumentReady(this.soundfontTimeoutMs) && this.instrument) {
        const T = t.currentTime, y = 1e4, f = this.instrument.play(e, 0, {
          gain: 0.85,
          attack: 3e-3,
          decay: 0.35,
          sustain: 0.6,
          release: 0.2,
          duration: y / 1e3
        });
        if (f) {
          const x = setTimeout(() => {
            this.stopSustainedNote(e);
          }, y);
          this.sustainedNotes.set(e, {
            kind: "soundfont",
            soundfontNode: f,
            startTime: T,
            decayInterval: x
          }), this.debug("startSustainedNote: soundfont started", { note: e, t: performance.now() });
          return;
        }
      }
      const o = g(e), i = t.createOscillator(), r = t.createOscillator(), s = t.createBiquadFilter(), a = t.createGain();
      i.type = "sine", i.frequency.value = o, r.type = "triangle", r.frequency.value = o * 2, r.detune.value = -6, s.type = "lowpass", s.frequency.value = 1800, s.Q.value = 0.6;
      const u = t.currentTime, m = 3e-3, h = 0.7, c = 0.1, l = 3e3, w = 1e4;
      a.gain.setValueAtTime(0, u), a.gain.linearRampToValueAtTime(h, u + m), i.connect(s), r.connect(s), s.connect(a), a.connect(t.destination), i.start(u), r.start(u), a.gain.exponentialRampToValueAtTime(c, u + m + l / 1e3);
      const b = setTimeout(() => {
        this.stopSustainedNote(e);
      }, w);
      this.sustainedNotes.set(e, {
        kind: "synth",
        oscillator: i,
        overtone: r,
        gainNode: a,
        startTime: u,
        decayInterval: b
      }), this.debug("startSustainedNote: started", { note: e, t: performance.now() });
    } catch (t) {
      console.error("Error starting sustained note:", t);
    }
  }
  /**
   * Stop a sustained note with a quick fade out
   * @param note - Note in scientific pitch notation
   */
  stopSustainedNote(e) {
    const t = this.sustainedNotes.get(e);
    if (!t) return;
    const n = this.ensureAudioContext();
    if (!n) return;
    if (t.kind === "soundfont") {
      try {
        t.soundfontNode?.stop(n.currentTime);
      } catch (r) {
        this.debug("stopSustainedNote: soundfont stop failed", r);
      }
      clearTimeout(t.decayInterval), this.sustainedNotes.delete(e), this.debug("stopSustainedNote: soundfont stopped", { note: e, t: performance.now() });
      return;
    }
    const o = n.currentTime, i = 0.12;
    t.gainNode?.gain.cancelScheduledValues(o), t.gainNode?.gain.setValueAtTime(t.gainNode.gain.value, o), t.gainNode?.gain.exponentialRampToValueAtTime(1e-3, o + i), t.oscillator?.stop(o + i), t.overtone?.stop(o + i), clearTimeout(t.decayInterval), this.sustainedNotes.delete(e), this.debug("stopSustainedNote: stopped", { note: e, t: performance.now() });
  }
  /**
   * Stop all sustained notes
   */
  stopAllSustainedNotes() {
    Array.from(this.sustainedNotes.keys()).forEach((t) => this.stopSustainedNote(t)), this.debug("stopAllSustainedNotes: stopped all");
  }
  /**
   * Resume audio context (needed after user interaction)
   */
  async resume() {
    const e = this.ensureAudioContext();
    if (e && e.state !== "running") {
      this.debug("resume: resuming AudioContext", { state: e.state });
      try {
        await e.resume();
      } catch (t) {
        this.debug("resume: failed", t);
      }
    }
    e && this.unlockAudioContext(e), this.ensureInstrument();
  }
  async ensureInstrument() {
    const e = this.ensureAudioContext();
    if (!e) {
      this.debug("ensureInstrument: no AudioContext");
      return;
    }
    if (!this.shouldUseSoundfont()) {
      this.instrumentFailed || (this.instrumentFailed = !0, this.debug("ensureInstrument: soundfont disabled"));
      return;
    }
    if (!(this.instrument || this.instrumentFailed)) {
      this.instrumentPromise || (this.instrumentPromise = (async () => {
        try {
          this.debug("ensureInstrument: loading soundfont module");
          const t = (await import("./index-DDBoXSuF.js").then((n) => n.i)).default;
          return this.debug("ensureInstrument: loading instrument"), await t.instrument(
            e,
            "acoustic_grand_piano",
            { soundfont: "MusyngKite", format: "mp3" }
          );
        } catch (t) {
          throw this.instrumentFailed = !0, this.debug("ensureInstrument: failed", t), t;
        }
      })());
      try {
        this.instrument = await this.instrumentPromise, this.debug("ensureInstrument: loaded"), this.warmupInstrument();
      } catch (t) {
        console.warn("Soundfont load failed, using synth fallback.", t);
      }
    }
  }
  async waitForInstrumentReady(e) {
    if (!this.shouldUseSoundfont())
      return !1;
    if (this.ensureInstrument(), this.instrument)
      return !0;
    if (!this.instrumentPromise)
      return !1;
    try {
      await Promise.race([this.instrumentPromise, C(e)]);
    } catch (t) {
      return this.debug("waitForInstrumentReady: failed", t), !1;
    }
    return this.instrument !== null;
  }
  playSynthNote(e, t) {
    if (!this.audioContext) {
      this.debug("playSynthNote: no AudioContext");
      return;
    }
    const n = g(e), o = this.audioContext.createOscillator(), i = this.audioContext.createOscillator(), r = this.audioContext.createBiquadFilter(), s = this.audioContext.createGain();
    o.type = "sine", o.frequency.value = n, i.type = "triangle", i.frequency.value = n * 2, i.detune.value = -6, r.type = "lowpass", r.frequency.value = 1800, r.Q.value = 0.6;
    const a = this.audioContext.currentTime, u = 3e-3, m = 0.25, h = 0.08, c = 0.12;
    s.gain.setValueAtTime(0, a), s.gain.linearRampToValueAtTime(0.7, a + u), s.gain.exponentialRampToValueAtTime(h, a + u + m);
    const l = Math.max(a + u + m, a + t / 1e3 - c);
    s.gain.setValueAtTime(h, l), s.gain.exponentialRampToValueAtTime(1e-3, l + c), o.connect(r), i.connect(r), r.connect(s), s.connect(this.audioContext.destination), o.start(a), i.start(a), o.stop(l + c), i.stop(l + c);
  }
  ensureAudioContext() {
    if (!this.audioContext)
      try {
        const t = globalThis, n = t.AudioContext || t.webkitAudioContext;
        if (!n)
          return console.warn("AudioContext is not supported in this browser."), null;
        this.audioContext = new n(), t.__pianoAudioContext = this.audioContext;
        const o = this.audioContext;
        this.debug("ensureAudioContext: created", { state: o.state });
      } catch (t) {
        return console.warn("Failed to create AudioContext.", t), null;
      }
    const e = this.audioContext;
    return this.debug("ensureAudioContext: ready", { state: e.state }), e;
  }
  unlockAudioContext(e) {
    if (!this.audioUnlocked)
      try {
        const t = e.createBuffer(1, 1, e.sampleRate), n = e.createBufferSource();
        n.buffer = t, n.connect(e.destination);
        const o = e.currentTime;
        n.start(o), n.stop(o + 0.01), this.audioUnlocked = !0, this.debug("unlockAudioContext: ok");
      } catch (t) {
        this.debug("unlockAudioContext: failed", t);
      }
  }
  warmupInstrument() {
    this.warmupDone || !this.instrument || (A.forEach((e, t) => {
      this.instrument?.play(e, t * 0.01, { gain: 1e-4, duration: 0.05 });
    }), this.warmupDone = !0, this.debug("warmup: scheduled", { count: A.length }));
  }
  shouldUseSoundfont() {
    return !globalThis.__pianoDisableSoundfont;
  }
  debug(e, t) {
    if (globalThis.__pianoDebug) {
      if (t === void 0) {
        console.log(`[PianoSynth] ${e}`);
        return;
      }
      console.log(`[PianoSynth] ${e}`, t);
    }
  }
}
const S = async (d, e) => {
  const { action: t, notes: n, chord: o, melody: i, title: r } = e;
  try {
    let s = [], a = {
      activeNotes: [],
      lastPlayed: [],
      isPlaying: !1,
      currentMelodyIndex: 0,
      title: r
    };
    switch (t) {
      case "play_notes":
        s = n || [], a.lastPlayed = s, a.activeNotes = s;
        break;
      case "play_chord":
        o && (s = D(o), a.lastPlayed = s, a.activeNotes = s, a.chord = o);
        break;
      case "play_melody":
        i && (s = i.notes, a.isPlaying = !0);
        break;
      case "show_keyboard":
        break;
    }
    return {
      toolName: p,
      data: { state: a, melody: i },
      jsonData: { success: !0, playedNotes: s, chord: o },
      message: `Played: ${s.join(", ") || "keyboard shown"}`,
      title: r || o || "Piano",
      instructions: t === "play_melody" ? "The melody is now playing. Ask the user if they enjoyed it." : "The piano is ready. Ask the user what they would like to play next."
    };
  } catch (s) {
    return {
      message: `Error: ${s}`,
      jsonData: { success: !1, error: String(s) },
      instructions: "Acknowledge the error and suggest trying again with different notes or chords."
    };
  }
}, F = {
  toolDefinition: N,
  execute: S,
  generatingMessage: "Preparing piano...",
  isEnabled: () => !0,
  // 外部 API 不要
  systemPrompt: E,
  samples: G
};
export {
  k as PianoSynth,
  G as SAMPLES,
  E as SYSTEM_PROMPT,
  N as TOOL_DEFINITION,
  p as TOOL_NAME,
  D as chordToNotes,
  S as executePiano,
  g as noteToFrequency,
  F as pluginCore
};
