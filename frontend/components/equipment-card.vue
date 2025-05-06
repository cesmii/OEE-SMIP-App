<template>
  <v-card border="md" class="d-flex flex-row">
    <v-card-text class="d-flex flex-column justify-space-between align-center">
      <h2 class="text-h6 text-center">
        {{ equipment.displayName }}
      </h2>
      <metric-progress-circular label="OEE" :value="equipment.oee.summary?.metric?.value"/>
    </v-card-text>

    <v-card-text class="border-s-md pa-0 d-flex flex-column">
      <v-card
        v-for="metric in metrics"
        :key="metric.label"
        class="pa-0 flex-grow-1 metric-card"
        flat
        tile
      >
        <v-sheet class="percent-bg" :color="getColorState(metric.value)" :style="{width: `${metric.progressValue}%`}"/>

        <v-card-title class="text-subtitle-1 d-flex flex-row justify-space-between align-center h-100" >
          <ContrastLabel class="mr-4" :label="metric.label"/>
          <ContrastLabel v-if="metric.displayValue !== undefined && metric.displayValue !== null">
            {{metric.displayValue}}
          </ContrastLabel>
          <em v-else-if="metric.displayValue === null">Invalid Value</em>
          <em v-else>No Value</em>
        </v-card-title>
      </v-card>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import ContrastLabel from "./contrast-label.vue";
import type { IEquipmentWithOEE } from "~/lib/equipment";



interface Props {
  equipment: IEquipmentWithOEE;
}
const { equipment } = defineProps<Props>();

// Calculate availability directly based on productive/available time
const calculatedAvailability = computed(() => {
  const productiveTime = equipment.oee.availability?.attributes?.find(a => a.relativeName === 'productive_time_today')?.value;
  const availableTime = equipment.oee.availability?.attributes?.find(a => a.relativeName === 'daily_available_production_time')?.value;
  
  // If we have productive time but no available time (or it's zero), return 100%
  if (productiveTime && (!availableTime || Number(availableTime) === 0)) {
    return 100;
  }
  
  // If we have both values, calculate the ratio
  if (productiveTime && availableTime && Number(availableTime) > 0) {
    const result = (Number(productiveTime) / Number(availableTime)) * 100;
    return result;
  }
  
  // If all else fails, try to use the metric value
  return equipment.oee.availability?.metric?.value;
});

const metrics = computed(() => [
  makePercentMetric("Availability", calculatedAvailability.value),
  makePercentMetric("Performance", equipment.oee.performance?.metric?.value),
  makePercentMetric("Quality", equipment.oee.quality?.metric?.value),
]);
</script>

<style lang="scss">
@use "~/node_modules/vuetify/_styles.scss";

.metric-card:not(:last-child) {
  @extend .border-b-md;
}

.percent-bg {
  position: absolute;

  height: 100%;
  z-index: -1;
  opacity: 0.5;
}
</style>
