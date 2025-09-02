import { defineStore } from "pinia";
import type { Loan } from "../types/Loan";

export const useDataTableStore = defineStore("dataTableStore", {
  state: () => ({
    data: [] as Loan[],
    pageSize: 25,
    searchValue: "",
    statusValue: "All",
    sortFeild: null as string | null,
    sortValue: null as "asc" | "desc" | null,
  }),
  getters: {
    filteredData: (state) => {
      return state.data.filter((loan) => {
        const matchesSearch =
          state.searchValue.trim() === "" ||
          loan.borrowerName
            .toLowerCase()
            .includes(state.searchValue.toLowerCase());
        const matchesStatus =
          state.statusValue === "All" || loan.status === state.statusValue;
        return matchesSearch && matchesStatus;
      });
    },
    sortedData: (state) => {
      const dataCopy = [...state.filteredData];
      if (!state.sortFeild || !state.sortValue) {
        return dataCopy;
      }
      dataCopy.sort((a, b) => {
        let valA = a[state.sortFeild as keyof Loan];
        let valB = b[state.sortFeild as keyof Loan];

        if (state.sortFeild === "closeDate") {
          valA = new Date(valA as string).getTime();
          valB = new Date(valB as string).getTime();
        }

        if (typeof valA === "string" && typeof valB === "string") {
          valA = valA.toLowerCase();
          valB = valB.toLowerCase();
        }

        if (valA < valB) return state.sortValue === "asc" ? -1 : 1;
        if (valA > valB) return state.sortValue === "asc" ? 1 : -1;
        return 0;
      });
      return dataCopy;
    },
  },
  actions: {
    setPageSize(size: number) {
      this.pageSize = size;
    },
    setData(data: Loan[]) {
      this.data = data;
    },
    setSearchValue(value: string) {
      this.searchValue = value;
    },
    setStatusValue(value: string) {
      this.statusValue = value;
    },
    toggleSort(column: string) {
      if (this.sortFeild !== column) {
        this.sortFeild = column;
        this.sortValue = "asc";
      } else {
        if (this.sortValue === "asc") {
          this.sortValue = "desc";
        } else if (this.sortValue === "desc") {
          this.sortFeild = null;
          this.sortValue = null;
        } else {
          this.sortValue = "asc";
        }
      }
    },
    ariaSort(column: string) {
      if (this.sortFeild !== column) return "none";
      if (this.sortValue === "asc") return "ascending";
      if (this.sortValue === "desc") return "descending";
      return "none";
    },
  },
});
