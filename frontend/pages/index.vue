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
            No OEE Equipment Found
          </v-card-title>
          <v-card-subtitle>
            Please try refreshing, or checking SMIP for OEE equipment.
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
            Waiting to fetch Equipment
          </v-card-title>
          <v-card-subtitle>
            If you don't see anything after a few seconds, try refreshing.
          </v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useEquipmentWithOEE } from "~/lib/hooks";
import { useGraphQLStore } from "~/stores/graphql";

// Get access to the GraphQL store which contains the API endpoint configuration
const graphqlStore = useGraphQLStore();
// Get access to the current route object to modify its metadata
const route = useRoute();

// Check if the GraphQL store has an endpoint configured
if (graphqlStore.endpoint) {
  try {
    // Parse the endpoint URL to extract the hostname (e.g., "subdomain.company.com")
    const hostname = new URL(graphqlStore.endpoint).hostname;
    
    // Extract the subdomain by splitting on '.' and taking the first part
    // Then convert to uppercase (e.g., "subdomain.company.com" → "SUBDOMAIN")
    const subdomain = hostname.split('.')[0].toUpperCase();
    
    // Create a dynamic title using the subdomain
    const title = `${subdomain} Dashboard`;
    
    // Update the route's metadata title - this is what v-app-bar-title displays
    // when using {{route.meta.title}} in the template
    route.meta.title = title;
    
    // Update the browser's document title (what shows in the browser tab)
    // Note: This creates a title like "SUBDOMAIN Dashboard"
    useHead({
      title: `${title} Dashboard`
    });
  } catch (error) {
    // If URL parsing fails (malformed endpoint), log the error
    console.error("Error parsing URL:", error);
  }
} else {
  // Fallback: If no endpoint is configured, set a default page title
  // definePageMeta runs at compile-time and sets static metadata
  definePageMeta({
    title: "Dashboard", // default fallback title
  });
}

const { data: equipments, error, loading } = useEquipmentWithOEE();
</script>
