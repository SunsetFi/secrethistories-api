import { Opaque } from "type-fest";

export type LegacyId = Opaque<string, "LegacyId">;
export interface Legacy {
  legacyId: LegacyId;
  legacyLabel: string;
}
