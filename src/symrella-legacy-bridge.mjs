import { commitLegacySnapshot } from "./symrella-legacy-transaction.mjs";
import { clearV2Store, recalculateV2Cycle, readV2Store } from "./symrella-v2-operations.mjs";

window.symrellaPersistSnapshot = snapshot =>
  commitLegacySnapshot(window.localStorage, snapshot);
window.symrellaClearAllStores = () =>
  clearV2Store(window.localStorage);
window.symrellaRecalculateCycle = (cycleId = null, language = "fr") =>
  recalculateV2Cycle(window.localStorage, cycleId, language);
window.symrellaReadV2Store = () => readV2Store(window.localStorage);
