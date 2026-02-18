<template>
  <div class="flex gap-3 mt-4 overflow-x-scroll overflow-y-hidden pb-1 max-w-md mx-auto">
    <div
      v-for="date in dates"
      :key="date.id"
      @click="selectDate(date)"
      :class="[
        'flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-xl px-5 cursor-pointer transition-all',
        selectedDate === date.id
          ? 'bg-primary text-white shadow-lg shadow-primary/20'
          : 'bg-white border border-primary/10 text-[#111814] hover:border-primary/30',
      ]"
    >
      <p :class="selectedDate === date.id ? 'text-sm font-bold' : 'text-sm font-medium'">
        {{ date.display }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  dates: {
    type: Array,
    required: true,
    default: () => [],
  },
  selectedDate: {
    type: [Number, null],
    required: true,
    default: null,
  },
});

const emit = defineEmits(["select-date"]);

const selectDate = (date) => {
  emit("select-date", date);
};
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
