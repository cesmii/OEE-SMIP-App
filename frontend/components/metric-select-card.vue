<template>
  <v-card :border="active ? 'highlight lg opacity-100' : 'md'">
    <v-card-text>
      <metric-progress-circular :label="label" :value="value"/>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
interface Props {
  active: boolean;
  label: string;
  value?: number;
}
const { label, value, active } = defineProps<Props>();
</script>
