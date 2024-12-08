<template>
  <v-container>
    <v-row class="ma-0 justify-center">
      <v-col v-if="loading" class="d-flex flex-column align-center ga-4">
        <span>Loading Equipment...</span>
        <v-progress-circular :size="75" color="primary" indeterminate/>
      </v-col>
      <v-col v-else-if="error" class="d-flex flex-column align-center ga-4">
        <v-alert
          title="Error Fetching Equipment"
          type="error"
          text="There was an unexpected error fetching equipment. Please try again."
        />
      </v-col>
      <v-col
        v-else-if="equipments && equipments.length === 0"
        cols="12"
        class="d-flex flex-column align-center ga-4"
      >
        <v-card class="text-center">
          <v-card-title>
            No Equipment Found
          </v-card-title>
          <v-card-subtitle>
            Please try refreshing.
          </v-card-subtitle>
        </v-card>
      </v-col>
      <v-col v-else-if="equipments && equipments.length > 0" cols="12">
        <v-row>
          <v-col
            v-for="equipment in equipments"
            :key="equipment.id"

            cols="12"
            md="6"
            xl="4"
          >
            <EquipmentCard
              :id="equipment.id"
              :equipment="equipment"
              @click="navigateTo(`/equipment/${equipment.id}`)"
            />
          </v-col>
        </v-row>
      </v-col>
      <v-col v-else cols="12" class="d-flex flex-column align-center ga-4">
        <v-card class="text-center">
          <v-card-title>
            Unable to Fetch Equipment
          </v-card-title>
          <v-card-subtitle>
            Please try refreshing.
          </v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useEquipmentWithOEE } from "~/lib/hooks";



definePageMeta({
  title: "Dashboard",
});

const { data: equipments, error, loading } = useEquipmentWithOEE();
</script>
