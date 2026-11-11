import { commitLegacySnapshot } from "./symrella-legacy-transaction.mjs";
import { clearV2Store, recalculateV2Cycle, readV2Store, updateV2Observation } from "./symrella-v2-operations.mjs";

window.symrellaPersistSnapshot = (snapshot, cervicalObservation = null) =>
  commitLegacySnapshot(window.localStorage, {
    ...snapshot,
    cervicalObservations: cervicalObservation
      ? [cervicalObservation]
      : (snapshot.cervicalObservations || [])
  });
window.symrellaClearAllStores = () =>
  clearV2Store(window.localStorage);
window.symrellaRecalculateCycle = (cycleId = null, language = "fr") =>
  recalculateV2Cycle(window.localStorage, cycleId, language);
window.symrellaReadV2Store = () => readV2Store(window.localStorage);

window.symrellaSaveCervicalObservation = (date, payload) => {
  const store = readV2Store(window.localStorage);
  const cycle = [store.currentCycle, ...store.history].find(item =>
    item.observations.some(observation => observation.date === date)
  );
  if (!cycle) throw new Error("Observation introuvable pour cette date.");
  const observation = cycle.observations.find(item => item.date === date);
  const cervicalMucus = {
    ...observation.cervicalMucus,
    sensation: payload.sensation || null,
    appearance: Array.isArray(payload.appearance) ? payload.appearance : [],
  };
  return updateV2Observation(window.localStorage, observation.id, { cervicalMucus }, cycle.id);
};
