import { Store } from "./base";
import { Updater } from "../typings";

export class ServerSideStore<S> extends Store<S> {
  host?: Updater;

  isHost(updater: Updater) {
    return this.host === updater;
  }
}
