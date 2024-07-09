import { inspect } from "util";

export function inspectObj(obj: unknown) {
    return inspect(obj, { depth: null, colors: true, compact: true });
}
