/**
 * SymRella daily fertility classification layer.
 *
 * This module does not invent method rules: it translates explicit engine
 * signals into conservative day states and carries traceable explanations.
 * The same physiological classification is returned for either user goal.
 */
export const FERTILITY_CLASSIFIER_VERSION = "0.1.0";

const STATUS = Object.freeze({
  POTENTIALLY_FERTILE: "potentially_fertile",
  FERTILE: "fertile",
  END_PENDING: "end_pending",
  POSTOVULATORY_INFERTILE: "postovulatory_infertile",
  INDETERMINATE: "indeterminate"
});

const COPY = Object.freeze({
  fr: {
    potentially_fertile: "La fertilité ne peut pas encore être écartée. Poursuivez les observations.",
    fertile: "Les indicateurs disponibles situent cette journée dans la phase fertile.",
    end_pending: "Un critère de fin est atteint, mais le double contrôle n'est pas terminé.",
    postovulatory_infertile: "Les deux critères de fin sont achevés avant cette journée.",
    indeterminate: "Les données sont insuffisantes ou contradictoires pour établir un statut."
  },
  en: {
    potentially_fertile: "Fertility cannot yet be ruled out. Continue observations.",
    fertile: "The available indicators place this day in the fertile phase.",
    end_pending: "One end criterion is complete, but the double check is not.",
    postovulatory_infertile: "Both end criteria were completed before this day.",
    indeterminate: "The data are insufficient or conflicting to establish a status."
  },
  es: {
    potentially_fertile: "Aún no se puede descartar la fertilidad. Continúa las observaciones.",
    fertile: "Los indicadores disponibles sitúan este día en la fase fértil.",
    end_pending: "Un criterio de cierre se ha completado, pero falta el doble control.",
    postovulatory_infertile: "Ambos criterios de cierre se completaron antes de este día.",
    indeterminate: "Los datos son insuficientes o contradictorios para establecer un estado."
  },
  ar: {
    potentially_fertile: "لا يمكن استبعاد الخصوبة بعد. واصلي الملاحظات.",
    fertile: "تضع المؤشرات المتاحة هذا اليوم ضمن المرحلة الخصبة.",
    end_pending: "اكتمل أحد معياري النهاية، لكن التحقق المزدوج لم يكتمل.",
    postovulatory_infertile: "اكتمل معيارا النهاية قبل هذا اليوم.",
    indeterminate: "البيانات غير كافية أو متعارضة لتحديد الحالة."
  }
});

function validDate(value) {
  if (typeof value !== "string" || !/^\\d{4}-\\d{2}-\\d{2}$/.test(value)) return false;
  const date = new Date(value + "T00:00:00Z");
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function reasonFor(status, engine) {
  if (status === STATUS.POSTOVULATORY_INFERTILE) return "DOUBLE_CHECK_COMPLETED_BEFORE_DAY";
  if (status === STATUS.END_PENDING) return "ONE_END_CRITERION_COMPLETE";
  if (status === STATUS.FERTILE) return "EXPLICIT_FERTILE_SIGNAL";
  if (engine?.state === "UNRESOLVED" || engine?.state === "DISTURBED") return "CONFLICTING_OR_DISTURBED_DATA";
  if (engine?.thermal?.status === "THERMAL_RISE_CANDIDATE") return "THERMAL_RISE_NOT_CONFIRMED";
  if (engine?.cervical?.interpretationBlocked) return "CERVICAL_RULES_NOT_AVAILABLE";
  return "DOUBLE_CHECK_NOT_COMPLETE";
}

/**
 * @param {object} input
 * @param {Array<object>} input.observations Date-stamped observations.
 * @param {object} input.engineResult Result from evaluateCycle().
 * @param {"conception"|"evitement"|"observe"} [input.goal]
 * @param {"fr"|"en"|"es"|"ar"} [input.language]
 */
export function classifyFertilityDays({
  observations = [],
  engineResult = null,
  goal = "observe",
  language = "fr"
} = {}) {
  if (!Array.isArray(observations)) throw new TypeError("observations doit être un tableau.");
  if (!["conception", "evitement", "observe"].includes(goal)) throw new TypeError("Objectif inconnu.");
  const sorted = [...observations].filter(Boolean).sort((a, b) => String(a.date).localeCompare(String(b.date)));
  const seen = new Set();
  for (const item of sorted) {
    if (!validDate(item.date) || seen.has(item.date)) throw new TypeError("Dates d'observation invalides ou dupliquées.");
    seen.add(item.date);
  }

  const thermalComplete = engineResult?.thermal?.status === "SHIFT_CONFIRMED";
  const cervicalComplete = engineResult?.cervical?.status === "PEAK_PLUS_3_COMPLETED";
  const doubleComplete = engineResult?.doubleCheck?.status === "DOUBLE_CHECK_COMPLETE" &&
    thermalComplete && cervicalComplete &&
    validDate(engineResult.doubleCheck.completionDate);
  const completionDate = doubleComplete ? engineResult.doubleCheck.completionDate : null;
  const oneEndCriterion = thermalComplete !== cervicalComplete;
  const explicitFertileDates = new Set(
    Array.isArray(engineResult?.cervical?.fertileDates)
      ? engineResult.cervical.fertileDates.filter(validDate)
      : []
  );
  const blocked = engineResult?.state === "UNRESOLVED" ||
    engineResult?.cervical?.interpretationBlocked === true;

  const days = sorted.map(observation => {
    let status;
    if (doubleComplete && observation.date > completionDate) {
      status = STATUS.POSTOVULATORY_INFERTILE;
    } else if (doubleComplete && observation.date === completionDate) {
      status = STATUS.END_PENDING;
    } else if (explicitFertileDates.has(observation.date)) {
      status = STATUS.FERTILE;
    } else if (oneEndCriterion) {
      status = STATUS.END_PENDING;
    } else if (blocked && !observation.temperature?.valueC && !observation.cervicalMucus) {
      status = STATUS.INDETERMINATE;
    } else {
      status = STATUS.POTENTIALLY_FERTILE;
    }
    const reasonId = reasonFor(status, engineResult);
    return {
      date: observation.date,
      observationId: observation.id ?? null,
      status,
      reasonId,
      explanation: (COPY[language] || COPY.fr)[status],
      trace: {
        classifierVersion: FERTILITY_CLASSIFIER_VERSION,
        thermalStatus: engineResult?.thermal?.status ?? "UNAVAILABLE",
        cervicalStatus: engineResult?.cervical?.status ?? "UNAVAILABLE",
        doubleCheckStatus: engineResult?.doubleCheck?.status ?? "UNAVAILABLE",
        completionDate
      }
    };
  });

  return {
    version: FERTILITY_CLASSIFIER_VERSION,
    goal,
    physiologicalClassificationSharedAcrossGoals: true,
    status: days.length ? (doubleComplete ? "DOUBLE_CHECK_COMPLETE" : "OBSERVING") : "NO_DATA",
    days
  };
}

export { STATUS as FERTILITY_DAY_STATUS };
