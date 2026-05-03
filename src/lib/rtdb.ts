import { ref, set, push, remove, update, onValue, off, get, type Unsubscribe } from "firebase/database";
import { db } from "@/lib/firebase";

export function rtdbRef(path: string) {
  return ref(db, path);
}

export { set, push, remove, update, onValue, off, get };
export type { Unsubscribe };

export function subscribeRecord<T>(
  path: string,
  cb: (rows: Array<{ id: string; data: T }>) => void,
): Unsubscribe {
  const r = ref(db, path);
  return onValue(r, (snap) => {
    const val = snap.val() as Record<string, T> | null;
    if (!val) {
      cb([]);
      return;
    }
    cb(
      Object.entries(val).map(([id, data]) => ({
        id,
        data,
      })),
    );
  });
}
