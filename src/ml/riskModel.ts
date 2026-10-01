import type { Medicine } from "../types";

/**
 * Adherence Risk Predictor
 * ------------------------
 * Motivated directly by the Adhera paper's declared future work:
 * "Predictive algorithms will be incorporated to identify early signs
 * of non-adherence or caregiver burnout."
 *
 * The fixed weights below are a reproducible snapshot of the original
 * Brain.js network trained on the project's synthetic dataset. Keeping the
 * learned network while evaluating its small sigmoid layers directly makes
 * the result deterministic and avoids shipping the vulnerable GPU/native
 * dependency chain to the browser.
 *
 * It intentionally does NOT need to be real-time/streaming — recomputing
 * on dashboard load is sufficient, since the goal is to surface a rising
 * risk pattern proactively, not to react to a single missed dose.
 */

export interface RiskFeatures {
  missedRatio: number; // 0-1, share of recent doses missed
  avgDelayNorm: number; // 0-1, normalized average delay from schedule
  stockRatioInv: number; // 0-1, higher = closer to running out
  streakNorm: number; // 0-1, higher = longer current "taken" streak (protective)
}

export interface RiskResult {
  score: number; // 0-1 probability of missing the next dose
  band: "low" | "medium" | "high";
}

/** Extract normalized features for a single medicine from its dose history. */
export function extractFeatures(med: Medicine): RiskFeatures {
  const doses = med.doses;
  const total = doses.length || 1;
  const missed = doses.filter((d) => d.status === "missed").length;
  const missedRatio = missed / total;

  // Reward streaks of consecutive "taken" doses (protective factor).
  let streak = 0;
  for (let i = doses.length - 1; i >= 0; i--) {
    if (doses[i].status === "taken") streak++;
    else break;
  }
  const streakNorm = Math.min(streak / 4, 1);

  const stockRatioInv = Math.min(
    Math.max(1 - med.stock / (med.lowStockThreshold * 3), 0),
    1,
  );

  // Mock data doesn't carry precise delay timestamps, so we approximate:
  // a "pending" dose past its window contributes to perceived delay risk.
  const pendingCount = doses.filter((d) => d.status === "pending").length;
  const avgDelayNorm = Math.min(pendingCount / total, 1);

  return { missedRatio, avgDelayNorm, stockRatioInv, streakNorm };
}

type Layer = { weights: readonly (readonly number[])[]; biases: readonly number[] };

const layers: readonly Layer[] = [
  {
    weights: [
      [4.624309539794922, 2.0912723541259766, 1.8298866748809814, -3.4749467372894287],
      [-6.642880916595459, -6.208171367645264, 2.898085117340088, 2.543596029281616],
      [-1.2047761678695679, -0.7011560797691345, -0.8009164333343506, 0.017738070338964462],
      [6.671669960021973, 1.6309982538223267, 6.417860984802246, -4.663784980773926],
      [3.816925048828125, 1.9357653856277466, 1.5345327854156494, -3.0518577098846436],
      [-2.8420498371124268, -2.0242536067962646, -1.2921333312988281, 0.9843064546585083],
    ],
    biases: [-3.7529871463775635, 2.054891586303711, -0.1677621304988861, -5.730328559875488, -3.317809581756592, 1.716646671295166],
  },
  {
    weights: [
      [-0.35646599531173706, -0.09485351294279099, -0.3556329309940338, -0.5477638244628906, -0.5050988793373108, -0.1932508796453476],
      [-2.22222900390625, 5.195028305053711, 1.4143671989440918, -4.641025066375732, -1.7800430059432983, 2.704697847366333],
      [-1.875889539718628, 2.751209259033203, 0.3842000961303711, -2.32816481590271, -1.6825422048568726, 1.5416136980056763],
      [-1.8376349210739136, 1.7574758529663086, 0.1313711702823639, -2.172478675842285, -1.6087287664413452, 0.9847108721733093],
    ],
    biases: [-0.8271939158439636, 3.0757908821105957, 0.7801794409751892, -0.04739789292216301],
  },
  {
    weights: [[0.0031332222279161215, -5.312410354614258, -2.8521013259887695, -2.489077091217041]],
    biases: [5.014326095581055],
  },
];

function runLayer(input: readonly number[], layer: Layer): number[] {
  return layer.weights.map((weights, outputIndex) => {
    const sum = weights.reduce(
      (value, weight, inputIndex) => value + weight * input[inputIndex],
      layer.biases[outputIndex],
    );
    return Math.fround(1 / (1 + Math.exp(-sum)));
  });
}

function bandFor(score: number): RiskResult["band"] {
  if (score >= 0.66) return "high";
  if (score >= 0.35) return "medium";
  return "low";
}

export function predictRisk(features: RiskFeatures): RiskResult {
  const input = [
    features.missedRatio,
    features.avgDelayNorm,
    features.stockRatioInv,
    features.streakNorm,
  ];
  const [score] = layers.reduce(runLayer, input);
  return { score, band: bandFor(score) };
}

/** Convenience: highest-risk medicine + score for a full medicine list. */
export function assessPatientRisk(medicines: Medicine[]): {
  overall: RiskResult;
  perMedicine: { medicine: Medicine; risk: RiskResult }[];
} {
  const perMedicine = medicines.map((medicine) => ({
    medicine,
    risk: predictRisk(extractFeatures(medicine)),
  }));

  const overallScore = perMedicine.length
    ? Math.max(...perMedicine.map((m) => m.risk.score))
    : 0;

  return {
    overall: { score: overallScore, band: bandFor(overallScore) },
    perMedicine,
  };
}
