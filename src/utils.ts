import {
  AspectRequirements,
  Aspects,
  AspectsExpression,
  SphereSpec,
} from "./types";

export function aspectsMatch(value: Aspects, match: Aspects, exact = false) {
  for (const aspectName of Object.keys(match)) {
    const aspectAmount = value[aspectName] ?? 0;

    const matchAspectAmount = match[aspectName] ?? 0;

    if (exact || matchAspectAmount == 0) {
      if (matchAspectAmount !== aspectAmount) {
        return false;
      }
    } else if (matchAspectAmount > 0) {
      if (aspectAmount < matchAspectAmount) {
        return false;
      }
    } else if (matchAspectAmount < 0) {
      if (aspectAmount >= -matchAspectAmount) {
        return false;
      }
    }
  }

  return true;
}

export function aspectsMatchExpression(
  value: Aspects,
  match: AspectsExpression
) {
  for (const aspectName of Object.keys(match)) {
    const matchAspectExpression = match[aspectName] ?? 0;
    let matchAspectAmount = Number(matchAspectExpression);
    if (Number.isNaN(matchAspectAmount)) {
      matchAspectAmount = value[matchAspectExpression] ?? 0;
    }

    const valueAspectAmount = value[aspectName] ?? 0;

    if (matchAspectAmount == 0) {
      if (matchAspectAmount !== valueAspectAmount) {
        return false;
      }
    } else if (matchAspectAmount > 0) {
      if (valueAspectAmount < matchAspectAmount) {
        return false;
      }
    } else if (matchAspectAmount < 0) {
      if (valueAspectAmount >= -matchAspectAmount) {
        return false;
      }
    }
  }

  return true;
}

export function aspectsMatchRequirements(
  aspects: Aspects,
  requirements: AspectRequirements
) {
  const { essential, required, forbidden } = requirements;

  for (const aspectKey of Object.keys(essential)) {
    const expectedValue = essential[aspectKey];
    const compareValue = aspects[aspectKey];
    if (compareValue === undefined) {
      return false;
    } else if (compareValue < expectedValue) {
      return false;
    }
  }

  const requiredKeys = Object.keys(required);
  if (requiredKeys.length > 0) {
    let foundRequired = false;
    for (const aspectKey of requiredKeys) {
      const expectedValue = required[aspectKey];
      const compareValue = aspects[aspectKey];
      if (compareValue === undefined) {
        continue;
      } else if (compareValue >= expectedValue) {
        foundRequired = true;
        break;
      }
    }
    if (!foundRequired) {
      return false;
    }
  }

  for (const aspectKey of Object.keys(forbidden)) {
    const expectedValue = forbidden[aspectKey];
    const compareValue = aspects[aspectKey];
    if (compareValue === undefined) {
      continue;
    } else if (compareValue >= expectedValue) {
      return false;
    }
  }

  return true;
}

/**
 * @deprecated Use `aspectsMatchRequirements` instead.
 */
export function aspectsMatchSphereSpec(aspects: Aspects, t: SphereSpec) {
  return aspectsMatchRequirements(aspects, t);
}

export function combineAspects(a: Aspects, b: Aspects): Aspects {
  const result: Aspects = {};

  for (const aspectName of Object.keys(a)) {
    result[aspectName] = (result[aspectName] ?? 0) + a[aspectName];
  }

  for (const aspectName of Object.keys(b)) {
    result[aspectName] = (result[aspectName] ?? 0) + b[aspectName];
  }

  return result;
}

export function actionIdMatches(actionId: string, verbId: string) {
  if (!actionId || actionId === "") {
    return true;
  }

  const comparison = new RegExp(`^${actionId.replace("*", "(?:.*)")}$`);
  return comparison.test(verbId);
}

const pathSplit = /[\/\!]/;
export function tokenPathContainsChild(parent: string, child: string) {
  const parentParts = parent.split(pathSplit);
  const childParts = child.split(pathSplit);

  if (childParts.length < parentParts.length) {
    return false;
  }

  for (let i = 0; i < parentParts.length; i++) {
    if (parentParts[i] !== childParts[i]) {
      return false;
    }
  }

  return true;
}
