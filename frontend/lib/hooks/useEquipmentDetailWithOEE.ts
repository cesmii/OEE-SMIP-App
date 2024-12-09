import { useQuery } from "@vue/apollo-composable";

import { GetEquipmentDetailDocument } from "~/generated/graphql/operations";
import { parseEquipmentWithOEE } from "~/lib/equipment";



export function useEquipmentDetailWithOEE(id: string) {
  // TODO: Use equipment timezone instead of user timezone.
  const startTime = new Date();
  startTime.setHours(0, 0, 0, 0);
  const endTime = new Date(startTime);
  endTime.setDate(startTime.getDate() + 1);

  const query = useQuery(
    GetEquipmentDetailDocument,
    {
      id,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
    },
  );

  return {
    query,
    data: computed(() => query.result.value?.equipment ? parseEquipmentWithOEE(query.result.value.equipment) : undefined),
  };
}
