import type { VariablesOf } from "@graphql-typed-document-node/core";
import { useQuery } from "@vue/apollo-composable";

import { useEquipmentIds } from "./useEquipmentIds";
import { GetEquipmentsDocument } from "~/generated/graphql/operations";
import { parseEquipmentWithOEE } from "~/lib/equipment";



export function useEquipmentWithOEE() {
  const idQuery = useEquipmentIds();

  // TODO: Use equipment timezone instead of user timezone.
  const startTime = new Date();
  startTime.setHours(0, 0, 0, 0);
  const endTime = new Date(startTime);
  endTime.setDate(startTime.getDate() + 1);

  // Making this `computed` so the query is reactive to changes in `equipmentIds`.
  const variables = computed<VariablesOf<typeof GetEquipmentsDocument>>(() => ({
    filter: {
      id: { in: idQuery.data.value ?? [] },
    },
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString(),
  }));

  const query = useQuery(
    GetEquipmentsDocument,
    variables,
    {
      errorPolicy: "ignore",
    },
  );

  // Compound status involving both queries.
  const error = computed(() => idQuery.query.error.value ?? query.error.value);
  const loading = computed(() => idQuery.query.loading.value || query.loading.value);

  return {
    query,
    error,
    loading,
    data: computed(() => query.result.value?.equipments?.map(parseEquipmentWithOEE)),
  };
}
