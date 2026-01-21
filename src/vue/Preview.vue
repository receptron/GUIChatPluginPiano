<template>
  <div class="p-3 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg">
    <div v-if="pianoData" class="flex flex-col gap-2">
      <!-- Piano Icon -->
      <div class="text-3xl text-center">🎹</div>

      <!-- Title -->
      <div class="text-sm font-semibold text-gray-800 text-center truncate">
        {{ pianoData.state.title || "Piano" }}
      </div>

      <!-- Chord Display -->
      <div v-if="pianoData.state.chord" class="text-center">
        <span class="inline-block bg-purple-600 text-white text-xs font-bold py-1 px-3 rounded-full">
          {{ pianoData.state.chord }}
        </span>
      </div>

      <!-- Notes Count (for melody) -->
      <div v-if="pianoData.melody" class="text-xs text-center text-gray-600">
        {{ pianoData.melody.notes.length }} notes
      </div>

      <!-- Last Played Notes -->
      <div v-else-if="pianoData.state.lastPlayed.length > 0" class="text-xs text-center text-gray-600">
        {{ pianoData.state.lastPlayed.join(", ") }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { ToolResult } from "gui-chat-protocol";
import type { PianoToolData } from "../core/types";

const props = defineProps<{
  result: ToolResult;
}>();

const pianoData = computed(() => props.result.data as PianoToolData | null);
</script>
