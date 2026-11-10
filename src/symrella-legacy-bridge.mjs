import { commitLegacySnapshot } from "./symrella-legacy-transaction.mjs";
import { clearV2Store, recalculateV2Cycle } from "./symrella-v2-operations.mjs";

window.symrellaPersistSnapshot = snapshot =>
  commitLegacySnapshot(window.localStorage, snapshot);
window.symrellaClearAllStores = () =>
  clearV2Store(window.localStorage);
window.symrellaRecalculateCycle = (cycleId = null, language = "fr") =>
  recalculateV2Cycle(window.localStorage, cycleId, language);
