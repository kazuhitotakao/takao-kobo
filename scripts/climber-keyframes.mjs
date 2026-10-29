// トップの階段を登る人物（src/components/home/step-by-step.tsx）の、登る動きの keyframes を作る。
// 使い方: node scripts/climber-keyframes.mjs
//   標準出力の @keyframes を、src/components/home/home-page.css の「登る動き」の行と差し替える。
//   標準エラーには、脚が届かない・足や膝が段にめり込む・接地した足が滑る、の検査結果を出す。
//
// 2段分の動き（踏み出す・1段登る・足をそろえる）を作り、CSS で2回くり返して4段登らせる。
// 座標は step-by-step.tsx の SVG と同じ単位で、原点は登り始めに立っている腰、y は下向き。
// 段は1段で前へ 32・上へ 19。腰から足首までの脚の長さは 25 なので、段の高さは脚の 3/4 ほどある。

const THIGH = 12.5;
const SHIN = 12.5;
const FOOT = 6.5;
const RUN = 32;
const RISE = 19;
// 段の奥側の縁（蹴上げ）から立ち位置までの距離。頭が「step by step」の文字の下を通らないよう、段の手前寄りに立つ
const STANCE = 20;
// 体の中での脚の付け根（腰の左右）
const HIP_X = { a: -1.5, b: 1.5 };
// .climber__body の transform-origin（足もと）
const ORIGIN = [0, 25];
// 踏み出す・1段登る・足をそろえる、の長さ（秒）
const DURATIONS = [0.7, 0.75, 0.55];
const TOTAL = DURATIONS.reduce((sum, d) => sum + d, 0);
// 登っているあいだの前傾（度）
const LEAN = 15;

const rad = (d) => (d * Math.PI) / 180;
const deg = (r) => (r * 180) / Math.PI;
const lerp = (a, b, t) => a + (b - a) * t;
const clamp01 = (t) => Math.min(1, Math.max(0, t));
const ease = (t) => (1 - Math.cos(Math.PI * clamp01(t))) / 2;
const add = (p, q) => [p[0] + q[0], p[1] + q[1]];
const sub = (p, q) => [p[0] - q[0], p[1] - q[1]];
// CSS の rotate と同じ向き（正で時計回り）
const rotate = ([x, y], angle) => [x * Math.cos(rad(angle)) - y * Math.sin(rad(angle)), x * Math.sin(rad(angle)) + y * Math.cos(rad(angle))];

// waypoint を順に通る曲線（Catmull-Rom）。u は 0..1
function spline(points, u) {
  const n = points.length - 1;
  const f = clamp01(u) * n;
  const i = Math.min(n - 1, Math.floor(f));
  const t = f - i;
  const p0 = points[Math.max(0, i - 1)], p1 = points[i], p2 = points[i + 1], p3 = points[Math.min(n, i + 2)];
  return [0, 1].map((k) => 0.5 * (2 * p1[k] + (-p0[k] + p2[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t * t + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t * t * t));
}

// 接地した足のまわりを、腰が弧を描いて越えていく
function arc(planted, from, to, t, bulge = 0) {
  const v0 = sub(from, planted), v1 = sub(to, planted);
  const a0 = Math.atan2(v0[0], -v0[1]), a1 = Math.atan2(v1[0], -v1[1]);
  const r = lerp(Math.hypot(...v0), Math.hypot(...v1), t) + bulge * Math.sin(Math.PI * t);
  const a = lerp(a0, a1, t);
  return [planted[0] + r * Math.sin(a), planted[1] - r * Math.cos(a)];
}

// j 段上の足首の位置（脚 a/b は付け根と同じだけ左右にずらす）
const ankle = (j, leg) => [RUN * j + HIP_X[leg], 25 - RISE * j];
// 前後に足を開いたとき、腰は後ろ足から前へ 10・上へ 22
const lungeHip = [10, 3];
const lungeHip2 = add(lungeHip, [RUN, -RISE]);
const endHip = [2 * RUN, -2 * RISE];
// 振り出す足のつま先を、途中だけ少し下げる
const toeDown = (u) => 18 * Math.sin(Math.PI * clamp01(u));

// 時刻 t（秒）の腰の位置・前傾・両足首の位置・足の傾き
function pose(t) {
  if (t < DURATIONS[0]) {
    // 踏み出す：足 a に体重を乗せたまま、足 b を高く上げて1段上へ置く。腰は少し遅れて前へ出る
    const s = t / DURATIONS[0];
    const u = ease((s - 0.05) / 0.9);
    return {
      hip: arc(ankle(0, 'a'), [0, 0], lungeHip, ease((s - 0.3) / 0.7)),
      lean: lerp(0, LEAN, ease((s - 0.1) / 0.8)),
      feet: { a: ankle(0, 'a'), b: spline([ankle(0, 'b'), [2, 16], [3.5, 7.5], [9, 2.5], [19, 1.5], [28, 3], ankle(1, 'b')], u) },
      pitch: { a: 0, b: toeDown(u) },
    };
  }
  if (t < DURATIONS[0] + DURATIONS[1]) {
    // 1段登る：足 b に乗って腰を持ち上げ、足 a を後ろから振り出して2段上へ置く。
    // 振り出す足は腰からの位置で動かし、かかとを後ろへ上げてから膝を前へ出す（膝が段の角に当たらないように）
    const s = (t - DURATIONS[0]) / DURATIONS[1];
    const u = ease(s / 0.95);
    const hip = arc(ankle(1, 'b'), lungeHip, lungeHip2, ease(s), 0.3);
    return {
      hip,
      lean: LEAN + 3 * Math.sin(Math.PI * s),
      feet: { a: add(hip, spline([sub(ankle(0, 'a'), lungeHip), [-14, 13], [-9, 5], [-1, 1], [11, 0], sub(ankle(2, 'a'), lungeHip2)], u)), b: ankle(1, 'b') },
      pitch: { a: toeDown(u), b: 0 },
    };
  }
  // 足をそろえる：足 a に乗って立ち上がり、足 b を引き上げて隣に置く
  const s = (t - DURATIONS[0] - DURATIONS[1]) / DURATIONS[2];
  const u = ease(s / 0.9);
  const hip = arc(ankle(2, 'a'), lungeHip2, endHip, ease(s));
  return {
    hip,
    lean: lerp(LEAN, 0, ease(s / 0.9)),
    feet: { a: ankle(2, 'a'), b: add(hip, spline([sub(ankle(1, 'b'), lungeHip2), [-14, 8], [-8, 1], [-2, 3], [2, 14], sub(ankle(2, 'b'), endHip)], u)) },
    pitch: { a: 0, b: toeDown(u) },
  };
}

// 足首の位置から、太もも・すね・足の回転を求める（膝は前へ曲げる）。腕は脚と逆に振る
function joints(t) {
  const { hip, lean, feet, pitch } = pose(t);
  const legs = {};
  for (const leg of ['a', 'b']) {
    const [x, y] = rotate(sub(feet[leg], hip), -lean);
    const dx = x - HIP_X[leg], dy = y;
    const distance = Math.hypot(dx, dy);
    const reach = Math.min(distance, THIGH + SHIN - 0.001);
    const toAnkle = Math.atan2(-dx, dy);
    const thigh = toAnkle - Math.acos(Math.min(1, (THIGH * THIGH + reach * reach - SHIN * SHIN) / (2 * THIGH * reach)));
    const knee = [-THIGH * Math.sin(thigh), THIGH * Math.cos(thigh)];
    const shinDir = Math.atan2(-(-reach * Math.sin(toAnkle) - knee[0]), reach * Math.cos(toAnkle) - knee[1]);
    legs[leg] = { thigh: deg(thigh), shin: deg(shinDir - thigh), foot: pitch[leg] - lean - deg(shinDir), overreach: distance - (THIGH + SHIN) };
  }
  const swing = (front, back) => Math.max(-75, Math.min(60, 0.55 * (front - back)));
  const arms = { a: swing(legs.b.thigh, legs.a.thigh), b: swing(legs.a.thigh, legs.b.thigh) };
  // transform-origin を足もとにしたときの translate
  const pivot = rotate(ORIGIN, lean);
  const translate = [hip[0] - ORIGIN[0] + pivot[0], hip[1] - ORIGIN[1] + pivot[1]];
  return { translate, lean, legs, arms, feet };
}

// keyframe の値から、膝・足首・つま先の位置を求める
function limb({ translate, lean }, leg, { thigh, shin, foot }) {
  const knee = [HIP_X[leg] - THIGH * Math.sin(rad(thigh)), THIGH * Math.cos(rad(thigh))];
  const ankleAt = [knee[0] - SHIN * Math.sin(rad(thigh + shin)), knee[1] + SHIN * Math.cos(rad(thigh + shin))];
  const toe = add(ankleAt, rotate([FOOT, 0], thigh + shin + foot));
  const place = (p) => add(add(translate, ORIGIN), rotate(sub(p, ORIGIN), lean));
  return { knee: place(knee), ankle: place(ankleAt), toe: place(toe) };
}

// 段の上面の高さ（線の中心）。足の線の中心がここから 1.4 より下に入ると、めり込んで見える
const surface = (x) => 26.6 - RISE * (x < RUN - STANCE ? 0 : Math.floor((x - (RUN - STANCE)) / RUN) + 1);
const sink = (p) => p[1] - (surface(p[0]) - 1.4);

// 誤差 tolerance 以内で直線補間できる点を間引く（Douglas-Peucker）
function simplify(samples, tolerance) {
  const keep = new Set([0, samples.length - 1]);
  const visit = (i, j) => {
    let worst = -1, index = -1;
    for (let k = i + 1; k < j; k++) {
      const t = (samples[k].t - samples[i].t) / (samples[j].t - samples[i].t);
      const error = Math.hypot(...samples[k].v.map((v, d) => v - lerp(samples[i].v[d], samples[j].v[d], t)));
      if (error > worst) { worst = error; index = k; }
    }
    if (worst > tolerance) { keep.add(index); visit(i, index); visit(index, j); }
  };
  visit(0, samples.length - 1);
  return [...keep].sort((x, y) => x - y).map((i) => samples[i]);
}

const STEPS = 400;
const frames = Array.from({ length: STEPS + 1 }, (_, i) => ({ t: (i / STEPS) * TOTAL, ...joints((i / STEPS) * TOTAL) }));

// 最初と最後は、何もしていないとき（立っている姿勢）と同じ値にそろえる
const channels = {
  'climber-climb': { tolerance: 0.4, get: (f) => [...f.translate, f.lean / 4], start: [0, 0, 0], end: [2 * RUN, -2 * RISE, 0] },
  'climber-thigh-a': { tolerance: 3, get: (f) => [f.legs.a.thigh] },
  'climber-shin-a': { tolerance: 3, get: (f) => [f.legs.a.shin] },
  'climber-foot-a': { tolerance: 6, get: (f) => [f.legs.a.foot] },
  'climber-thigh-b': { tolerance: 3, get: (f) => [f.legs.b.thigh] },
  'climber-shin-b': { tolerance: 3, get: (f) => [f.legs.b.shin] },
  'climber-foot-b': { tolerance: 6, get: (f) => [f.legs.b.foot] },
  'climber-arm-a': { tolerance: 5, get: (f) => [f.arms.a] },
  'climber-arm-b': { tolerance: 5, get: (f) => [f.arms.b] },
};
const keyframes = {};
for (const [name, { tolerance, get, start = [0], end = [0] }] of Object.entries(channels)) {
  const keys = simplify(frames.map((f) => ({ t: f.t, v: get(f) })), tolerance);
  keys[0] = { ...keys[0], v: start };
  keys[keys.length - 1] = { ...keys[keys.length - 1], v: end };
  keyframes[name] = keys;
}

// 検査：計算した姿勢と、間引いた keyframe を補間した姿勢の両方で
const valueAt = (keys, t) => {
  const i = keys.findIndex((k) => k.t >= t);
  if (i <= 0) return keys[Math.max(0, i)].v;
  const a = keys[i - 1], b = keys[i];
  return a.v.map((v, d) => lerp(v, b.v[d], (t - a.t) / (b.t - a.t)));
};
let overreach = 0, exactSink = 0, keyedSink = 0, slide = 0;
for (const f of frames) {
  const [tx, ty, quarterLean] = valueAt(keyframes['climber-climb'], f.t);
  const keyedBody = { translate: [tx, ty], lean: quarterLean * 4 };
  for (const leg of ['a', 'b']) {
    overreach = Math.max(overreach, f.legs[leg].overreach);
    const exact = limb(f, leg, f.legs[leg]);
    const keyed = limb(keyedBody, leg, {
      thigh: valueAt(keyframes[`climber-thigh-${leg}`], f.t)[0],
      shin: valueAt(keyframes[`climber-shin-${leg}`], f.t)[0],
      foot: valueAt(keyframes[`climber-foot-${leg}`], f.t)[0],
    });
    for (const part of ['knee', 'ankle', 'toe']) {
      exactSink = Math.max(exactSink, sink(exact[part]));
      keyedSink = Math.max(keyedSink, sink(keyed[part]));
    }
    slide = Math.max(slide, Math.hypot(...sub(keyed.ankle, exact.ankle)));
  }
}
const count = Object.values(keyframes).reduce((sum, keys) => sum + keys.length, 0);
console.error(`脚が届かない: ${overreach.toFixed(2)} / めり込み（計算・補間）: ${exactSink.toFixed(2)}・${keyedSink.toFixed(2)} / 足首のずれ: ${slide.toFixed(2)} / keyframe: ${count}`);

const percent = (t) => `${+((t / TOTAL) * 100).toFixed(1)}%`;
const number = (v) => `${+v.toFixed(1)}`.replace(/^-0$/, '0');
const declaration = (name, v) => (name === 'climber-climb' ? `translate: ${number(v[0])}px ${number(v[1])}px; rotate: ${number(v[2] * 4)}deg;` : `rotate: ${number(v[0])}deg;`);
for (const [name, keys] of Object.entries(keyframes)) {
  console.log(`@keyframes ${name} { ${keys.map((k) => `${percent(k.t)} { ${declaration(name, k.v)} }`).join(' ')} }`);
}
