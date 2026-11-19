/* SymRella — validation and safe persistence for cervical observations in backups.
 * Personal images are never stored; only the descriptive answers are included.
 */
(function (root) {
  'use strict';

  const MAX_OBSERVATIONS = 1000;
  const DEFAULT_RECOVERY_KEY = 'symrella_restore_recovery_v1';
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
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value) &&
      !Number.isNaN(Date.parse(value)) && new Date(value).toISOString() === value;
  }

  function isValidCervicalObservation(item) {
    if (!isPlainObject(item) || item.source !== 'rps02') return false;
    if ('photo' in item || 'photoDataUrl' in item || 'image' in item) return false;
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
    if (!Array.isArray(value) || value.length > MAX_OBSERVATIONS) return false;
    const ids = new Set();
    return value.every(item => {
      if (!isValidCervicalObservation(item) || ids.has(item.id)) return false;
      ids.add(item.id);
      return true;
    });
  }

  function stable(value) {
    if (Array.isArray(value)) return value.map(stable);
    if (!isPlainObject(value)) return value;
    return Object.keys(value).sort().reduce((result, key) => {
      result[key] = stable(value[key]);
      return result;
    }, {});
  }

  function sameObservation(left, right) {
    return JSON.stringify(stable(left)) === JSON.stringify(stable(right));
  }

  function resolveCervicalObservations(backup, current) {
    if (!isPlainObject(backup) || !isValidCervicalObservations(current)) return null;
    if (!Object.prototype.hasOwnProperty.call(backup, 'cervicalObservations')) return current;
    const incoming = backup.cervicalObservations;
    if (!isValidCervicalObservations(incoming)) return null;

    const merged = [...current];
    const byId = new Map(current.map(item => [item.id, item]));
    for (const item of incoming) {
      const existing = byId.get(item.id);
      if (existing) {
        if (!sameObservation(existing, item)) return null;
        continue;
      }
      byId.set(item.id, item);
      merged.push(item);
    }
    return isValidCervicalObservations(merged) ? merged : null;
  }

  function appendCervicalObservation(current, observation) {
    if (!isValidCervicalObservations(current) || !isValidCervicalObservation(observation) ||
        current.length >= MAX_OBSERVATIONS || current.some(item => item.id === observation.id)) return null;
    return [...current, observation];
  }

  function readRecoveryJournal(storage, journalKey) {
    const raw = storage.getItem(journalKey);
    if (raw === null) return null;
    let journal;
    try { journal = JSON.parse(raw); } catch (cause) {
      const failure = new Error('The recovery journal is invalid.', { cause });
      failure.recoveryRequired = true;
      throw failure;
    }
    if (!isPlainObject(journal) || journal.version !== 1 ||
        !['pending', 'committed'].includes(journal.state) || !isPlainObject(journal.previous) ||
        Object.keys(journal.previous).some(key => key === journalKey ||
          (journal.previous[key] !== null && typeof journal.previous[key] !== 'string'))) {
      const failure = new Error('The recovery journal is invalid.');
      failure.recoveryRequired = true;
      throw failure;
    }
    return { raw, journal };
  }

  function recoverStorageTransaction(storage, journalKey = DEFAULT_RECOVERY_KEY) {
    const entry = readRecoveryJournal(storage, journalKey);
    if (!entry) return { recovered: false, journalRemoved: true };
    const { journal } = entry;
    if (journal.state === 'pending') {
      const errors = [];
      for (const [key, value] of Object.entries(journal.previous)) {
        try {
          if (value === null) storage.removeItem(key);
          else storage.setItem(key, value);
        } catch (error) { errors.push(error); }
      }
      for (const [key, value] of Object.entries(journal.previous)) {
        try {
          if (storage.getItem(key) !== value) errors.push(new Error('A previous value could not be verified.'));
        } catch (error) { errors.push(error); }
      }
      if (errors.length) {
        const failure = new Error('The previous storage values could not be fully restored.');
        failure.recoveryRequired = true;
        failure.recoveryErrors = errors;
        throw failure;
      }
    }
    try {
      storage.removeItem(journalKey);
      if (storage.getItem(journalKey) !== null) throw new Error('The recovery journal could not be removed.');
    } catch (cause) {
      const failure = new Error('The recovery journal remains pending.', { cause });
      failure.recoveryRequired = true;
      failure.dataRestored = journal.state === 'pending';
      throw failure;
    }
    return { recovered: journal.state === 'pending', journalRemoved: true };
  }

  function writeStorageTransaction(storage, updates, journalKey = DEFAULT_RECOVERY_KEY) {
    try { recoverStorageTransaction(storage, journalKey); }
    catch (error) { error.rollbackFailed = true; error.recoveryRequired = true; throw error; }
    const keys = Object.keys(updates);
    if (keys.includes(journalKey)) throw new Error('The recovery journal cannot be part of a transaction.');
    const previous = Object.create(null);
    for (const key of keys) previous[key] = storage.getItem(key);

    const journal = JSON.stringify({ version: 1, state: 'pending', previous });
    try {
      storage.setItem(journalKey, journal);
      if (storage.getItem(journalKey) !== journal) throw new Error('The recovery journal could not be verified.');
    } catch (cause) {
      const failure = new Error('The recovery journal could not be saved; no application data were changed.', { cause });
      failure.rollbackFailed = false;
      try { failure.recoveryRequired = storage.getItem(journalKey) !== null; }
      catch (readError) { failure.recoveryRequired = true; failure.readError = readError; }
      throw failure;
    }

    try {
      for (const key of keys) {
        if (updates[key] === null) storage.removeItem(key);
        else storage.setItem(key, String(updates[key]));
      }
      for (const key of keys) {
        const expected = updates[key] === null ? null : String(updates[key]);
        if (storage.getItem(key) !== expected) throw new Error('A transaction value could not be verified.');
      }
    } catch (storageError) {
      let rollbackFailed = false;
      try { recoverStorageTransaction(storage, journalKey); }
      catch (recoveryError) { rollbackFailed = true; storageError.recoveryError = recoveryError; }
      const failure = new Error('The storage transaction failed.', { cause: storageError });
      failure.rollbackFailed = rollbackFailed;
      failure.rollbackErrors = storageError.recoveryError?.recoveryErrors || [];
      failure.recoveryRequired = rollbackFailed;
      throw failure;
    }

    const committedJournal = JSON.stringify({ version: 1, state: 'committed', previous });
    try {
      storage.setItem(journalKey, committedJournal);
      const committed = readRecoveryJournal(storage, journalKey);
      if (!committed || committed.raw !== committedJournal || committed.journal.state !== 'committed') {
        throw new Error('The transaction commit could not be verified.');
      }
    } catch (commitError) {
      let rollbackFailed = false;
      try { recoverStorageTransaction(storage, journalKey); }
      catch (recoveryError) { rollbackFailed = true; commitError.recoveryError = recoveryError; }
      const failure = new Error('The storage transaction commit failed.', { cause: commitError });
      failure.rollbackFailed = rollbackFailed;
      failure.rollbackErrors = commitError.recoveryError?.recoveryErrors || [];
      failure.recoveryRequired = rollbackFailed;
      throw failure;
    }

    // The new values have all been verified and the committed marker is durable.
    // If cleanup is refused, startup can safely retry removing this resolved marker.
    try { storage.removeItem(journalKey); } catch (error) { return { journalPendingCleanup: true }; }
    if (storage.getItem(journalKey) !== null) return { journalPendingCleanup: true };
    return { journalPendingCleanup: false };
  }

  root.SymRellaCervicalBackup = Object.freeze({
    MAX_OBSERVATIONS,
    isValidCervicalObservation,
    isValidCervicalObservations,
    resolveCervicalObservations,
    appendCervicalObservation,
    recoverStorageTransaction,
    writeStorageTransaction
  });
})(globalThis);