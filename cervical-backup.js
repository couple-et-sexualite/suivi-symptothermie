/* SymRella — validation des observations cervicales incluses dans les sauvegardes.
 * Aucune image personnelle n'est enregistrée : seules les réponses descriptives le sont.
 */
(function (root) {
  'use strict';

  const MAX_OBSERVATIONS = 3700;
  const VALUES = Object.freeze({
    sensation: ['unknown', 'dry', 'smooth', 'lubricative', 'moist', 'wet'],
    appearance: ['unknown', 'sticky', 'creamy', 'watery', 'gel', 'stretchy', 'mixed'],
    transparency: ['unknown', 'opaque', 'translucent', 'transparent'],
    stretch: ['unknown', 'none', 'little', 'clear', 'uncertain']
  });

  function isPlainObject(value) {
    return !!value && typeof value === 'object' && !Array.isArray(value);
  }

  function isIsoDate(value) {
    return typeof value === 'string' &&
      /^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{3}Z$/.test(value) &&
      !Number.isNaN(Date.parse(value));
  }

  function isValidCervicalObservation(item) {
    if (!isPlainObject(item) || item.source !== 'rps02') return false;
    if (typeof item.id !== 'string' || item.id.length < 1 || item.id.length > 120) return false;
    if (!isIsoDate(item.observedAt)) return false;
    if (!isPlainObject(item.observations)) return false;
    for (const [key, allowed] of Object.entries(VALUES)) {
      if (!allowed.includes(item.observations[key])) return false;
    }
    if (item.visualChoice !== null &&
        (typeof item.visualChoice !== 'string' || !/^[a-z0-9_-]{1,64}$/i.test(item.visualChoice))) return false;
    const result = item.interpretation;
    if (!isPlainObject(result)) return false;
    return typeof result.title === 'string' && result.title.length <= 180 &&
      typeof result.body === 'string' && result.body.length <= 1200 &&
      typeof result.detail === 'string' && result.detail.length <= 1600;
  }

  function isValidCervicalObservations(value) {
    return Array.isArray(value) && value.length <= MAX_OBSERVATIONS &&
      value.every(isValidCervicalObservation);
  }

  root.SymRellaCervicalBackup = Object.freeze({
    MAX_OBSERVATIONS,
    isValidCervicalObservation,
    isValidCervicalObservations
  });
})(globalThis);
