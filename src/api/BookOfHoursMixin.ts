import { ConstructorOf } from "./types-internal.js";

import { SHAPI } from "./SHAPI.js";

import { BHBrancrugMixin } from "./mixins/bh/brancrug.js";
import { BHFixedVerbsMixin } from "./mixins/bh/fixed-verbs.js";
import { BHHandMixin } from "./mixins/bh/hand.js";
import { BHSavesMixin } from "./mixins/bh/saves.js";
import { BHWorkstationsMixin } from "./mixins/bh/workstations.js";
import { BHCharacterSHMixin } from "./mixins/bh/character.js";
import { SharedCharacterSHMixin } from "./mixins/character.js";

export type BookOfHoursMixin = BHFixedVerbsMixin &
  BHHandMixin &
  BHSavesMixin &
  BHBrancrugMixin &
  BHWorkstationsMixin &
  BHCharacterSHMixin &
  SharedCharacterSHMixin;

export const BookOfHoursMixin = <T extends ConstructorOf<SHAPI>>(
  superclass: T
) =>
  BHCharacterSHMixin(
    SharedCharacterSHMixin(
      BHHandMixin(
        BHSavesMixin(
          BHFixedVerbsMixin(BHBrancrugMixin(BHWorkstationsMixin(superclass)))
        )
      )
    )
  );
