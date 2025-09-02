<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useDataTableStore } from "../stores/useDataTableStore";
import Data from "../../data/loans.json";
import HeaderComponent from "./HeaderComponent.vue";

const dataTableStore = useDataTableStore();

const searchValue = ref("");
const statusValue = ref("All");
const chunkSize = ref(dataTableStore.pageSize);

const loadedData = ref([]);
const loadIndex = ref(0);
const pageSizeOptions = [25, 50, 100];

const onPageSizeChange = (e) => {
  const pageSize = Number(e.target.value);
  dataTableStore.setPageSize(pageSize);
};

const scrollFunc = (e) => {
  const target = e.target;
  if (target.scrollTop + target.clientHeight >= target.scrollHeight - 10) {
    loadMore();
  }
};

const loadMore = () => {
  const start = loadIndex.value * chunkSize.value;
  const end = start + chunkSize.value;
  const nextChunk = dataTableStore.sortedData.slice(start, end);
  if (nextChunk.length === 0) return;
  loadedData.value = [...loadedData.value, ...nextChunk];
  loadIndex.value++;
};

const resetLoading = () => {
  loadedData.value = [];
  loadIndex.value = 0;
  loadMore();
};

const toggleSort = (column) => {
  dataTableStore.toggleSort(column);
};

const ariaSort = (column) => {
  return dataTableStore.ariaSort(column);
};

onMounted(() => {
  dataTableStore.setData(Data);
  resetLoading();
});

watch(
  () => [statusValue.value, dataTableStore.pageSize],
  ([newStatus, newPageSize], [oldStatus, oldPageSize]) => {
    dataTableStore.setStatusValue(newStatus);

    if (newPageSize !== oldPageSize) {
      chunkSize.value = newPageSize;
    }

    resetLoading();
  }
);

let debounceTime;

watch(
  () => searchValue.value,
  (newSearch) => {
    clearTimeout(debounceTime);
    debounceTime = setTimeout(() => {
      dataTableStore.setSearchValue(newSearch || "");
    }, 600);
  }
);

watch(
  () => dataTableStore.sortedData,
  () => {
    resetLoading();
  },
  { immediate: true }
);
</script>

<template>
  <h1 class="title">Data Grid Table</h1>
  <div class="filters">
    <div>
      <label for="pageSize">Page size:</label>
      <select
        id="pageSize"
        :value="dataTableStore.pageSize"
        @change="onPageSizeChange"
      >
        <option v-for="size in pageSizeOptions" :key="size" :value="size">
          {{ size }}
        </option>
      </select>
    </div>
    <div>
      <input v-model="searchValue" placeholder="Search Borrower" />
      <select v-model="statusValue" class="status-value">
        <option value="All">All</option>
        <option value="Approved">Approved</option>
        <option value="Pending">Pending</option>
        <option value="Rejected">Rejected</option>
      </select>
    </div>
  </div>

  <div @scroll="scrollFunc" class="table-container">
    <table>
      <HeaderComponent
        :sortField="dataTableStore.sortFeild"
        :sortValue="dataTableStore.sortValue"
        @sort="toggleSort"
      />
      <tbody>
        <tr v-if="loadedData.length === 0">
          <td colspan="5" class="no-data-text">No data found</td>
        </tr>
        <tr v-else v-for="loan in loadedData" :key="loan.id">
          <td>{{ loan.id }}</td>
          <td>{{ loan.borrowerName }}</td>
          <td>{{ loan.amount }}</td>
          <td>{{ loan.status }}</td>
          <td>{{ loan.closeDate }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.title {
  text-align: center;
}
.filters {
  display: flex;
  justify-content: space-between;
}
input,
select {
  padding: 8px 12px;
  margin: 8px 10px 12px 0;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
table {
  width: 100%;
  border-collapse: collapse;
  font-family: Arial, sans-serif;
}
thead tr {
  background-color: #f0f0f0;
  user-select: none;
}

td {
  text-align: left;
  padding: 10px 12px;
  border-bottom: 1px solid #ddd;
  vertical-align: middle;
}

.table-container {
  height: 400px;
  overflow-y: auto;
  border: 1px solid #ccc;
  margin-top: 10px;
}
tbody tr:hover {
  background-color: #fafafa;
}

.no-data-text {
  text-align: center;
  font-size: 20px;
  padding: 30px;
}
</style>
