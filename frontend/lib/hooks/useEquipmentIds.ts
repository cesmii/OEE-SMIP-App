import { useQuery } from "@vue/apollo-composable";
import { isNonNullish, unique } from "remeda";

import type { GetOeeEquipmentTypesWithEquipmentIdsQuery } from "~/generated/graphql/operations";
import { GetOeeEquipmentTypesWithEquipmentIdsDocument  } from "~/generated/graphql/operations";



/*
 * There are two possible structures for OEE equipment to descend from an "actual" piece of equipment:
 *
 * 1)
 *    - Physical Equipment
 *      - OEE Summary (type OEE Summary)
 *      - OEE Availability (type OEE Availability)
 *      - OEE Performance (type OEE Performance)
 *      - OEE Quality (type OEE Quality)
 *
 * 2)
 *    - Physical Equipment (type OEE Summary)
 *      - OEE Availability (type OEE Availability)
 *      - OEE Performance (type OEE Performance)
 *      - OEE Quality (type OEE Quality)
 *
 * We can differentiate based on `type` and presence of children.
 */





function deriveOeeEquipmentIds(
  res: GetOeeEquipmentTypesWithEquipmentIdsQuery,
): string[] {
  /** All equipment with OEE `equipmentType`. */
  const oeeEquipment = unique(
    res.equipmentTypes?.flatMap((et) => et.equipments) || [],
  );

  /** Set of equipment IDs with an OEE `equipmentType`. */
  const oeeEquipmentIds = new Set(oeeEquipment.map((e) => e.id));

  /** Equipment IDs that are the parent of at least one OEE Equipment. */
  const oeeParentIds = unique(
    oeeEquipment.map((eq) => eq.partOfId).filter(isNonNullish),
  );

  /**
   * The OEE equipment IDs that have a child OEE equipment.
   * This represents a root equipment following structure #2 (see above).
   */
  const oeeEquipmentIdsWithOEEChildren = oeeParentIds
    .filter(
      (partOfId) => oeeEquipmentIds.has(partOfId),
    );

  const oeeParentIdsWithoutOEEChildren = unique(
    oeeEquipment
      .filter(
        (eq) =>
          // Exclude the parent of equipment who are counted under structure #2.
          !oeeEquipmentIdsWithOEEChildren.includes(eq.id)
          // Exclude the equipment who are counted under structure #2.
          && (!eq.partOfId || !oeeEquipmentIdsWithOEEChildren.includes(eq.partOfId)),
      )
      .map((eq) => eq.partOfId)
      .filter(isNonNullish),
  );

  const equipmentIds = unique([
    ...oeeEquipmentIdsWithOEEChildren,
    ...oeeParentIdsWithoutOEEChildren,
  ]);

  return equipmentIds;
}


/**
 * A hook to retrieve all equipment with OEE metrics.
 * Makes a couple GraphQL calls then transforms the returned equipment into a standard shape.
 */
export function useEquipmentIds() {
  const query = useQuery(
    GetOeeEquipmentTypesWithEquipmentIdsDocument,
    {},
    { errorPolicy: "ignore" },
  );

  return {
    query,
    data: computed(() => query.result.value && deriveOeeEquipmentIds(query.result.value)),
  };
}

