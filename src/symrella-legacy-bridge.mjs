import { commitLegacySnapshot } from "./symrella-legacy-transaction.mjs";
import { clearV2Store } from "./symrella-v2-operations.mjs";

window.symrellaPersistSnapshot = snapshot =>
  commitLegacySnapshot(window.localStorage, snapshot);
window.symrellaClearAllStores = () =>
  clearV2Store(window.localStorage);
