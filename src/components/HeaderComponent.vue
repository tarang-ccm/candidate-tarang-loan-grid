<script setup>
import { defineEmits, defineProps } from "vue";

const props = defineProps({
  sortField: String,
  sortValue: String,
});

const emits = defineEmits(["sort"]);

const columns = [
  { key: "id", label: "ID" },
  { key: "borrowerName", label: "Borrower" },
  { key: "amount", label: "Amount" },
  { key: "status", label: "Status" },
  { key: "closeDate", label: "Close Date" },
];

const onClick = (key) => {
  emits("sort", key);
};

const ariaSort = (key) => {
  if (props.sortField !== key) return "none";
  return props.sortValue === "asc" ? "ascending" : "descending";
};
</script>

<template>
  <thead>
    <tr>
      <th
        v-for="col in columns"
        :key="col.key"
        @click="onClick(col.key)"
        :aria-sort="ariaSort(col.key)"
      >
        <div class="header">
          <Span>{{ col.label }}</Span>
          <i
            v-if="sortField === col.key && sortValue === 'asc'"
            class="fa fa-sort-up"
          ></i>
          <i
            v-else-if="sortField === col.key && sortValue === 'desc'"
            class="fa fa-sort-down"
          ></i>
          <i v-else class="fa fa-sort"></i>
        </div>
      </th>
    </tr>
  </thead>
</template>

<style scoped>
th {
  background: #000;
  color: white;
  position: sticky;
  top: 0;
  padding: 8px 12px;
  text-align: left;
}

.header {
  display: flex;
  justify-content: space-between;
}
</style>
