import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import Table from "../components/Table.vue";
import { useDataTableStore } from "../stores/useDataTableStore";
import { nextTick } from "vue";

describe("Table.vue", () => {
  let pinia: ReturnType<typeof createPinia>;

  beforeEach(() => {
    vi.useFakeTimers();
    pinia = createPinia();
    setActivePinia(pinia);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders table and filter controls", () => {
    const wrapper = mount(Table, { global: { plugins: [pinia] } });

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find("input[placeholder='Search Borrower']").exists()).toBe(
      true
    );
    expect(wrapper.find("select#pageSize").exists()).toBe(true);
    expect(wrapper.find("select").findAll("option").length).toBeGreaterThan(0);
    expect(wrapper.find(".table-container").exists()).toBe(true);
  });

  it("debounces search and updates store after timeout", async () => {
    const wrapper = mount(Table, { global: { plugins: [pinia] } });
    const store = useDataTableStore();

    const input = wrapper.find("input[placeholder='Search Borrower']");
    await input.setValue("John");

    expect(store.searchValue).not.toBe("John");

    vi.advanceTimersByTime(600);
    await nextTick();

    expect(store.searchValue).toBe("John");
  });

  it("updates status filter and reloads data", async () => {
    const wrapper = mount(Table, { global: { plugins: [pinia] } });
    const store = useDataTableStore();

    const selects = wrapper.findAll("select");
    const statusSelect = selects[1];
    if (!statusSelect) throw new Error("Status dropdown not found");

    await statusSelect.setValue("Approved");
    await nextTick();

    expect(store.statusValue).toBe("Approved");
  });

  it("changes page size and resets chunk loading", async () => {
    const wrapper = mount(Table, { global: { plugins: [pinia] } });
    const store = useDataTableStore();

    const select = wrapper.find("select#pageSize");
    await select.setValue("50");
    await select.trigger("change");

    expect(store.pageSize).toBe(50);
  });

  it("emits sort event and updates store sorting state", async () => {
    const wrapper = mount(Table, { global: { plugins: [pinia] } });
    const store = useDataTableStore();

    const header = wrapper.findComponent({ name: "HeaderComponent" });
    expect(header.exists()).toBe(true);

    await header.vm.$emit("sort", "borrowerName");
    await nextTick();
    expect(store.sortFeild).toBe("borrowerName");
    expect(["asc", "desc", null]).toContain(store.sortValue);
  });

  it("loads more data on scroll to bottom", async () => {
    const wrapper = mount(Table, { global: { plugins: [pinia] } });
    const store = useDataTableStore();

    const container = wrapper.find(".table-container");
    const el = container.element as HTMLElement;

    Object.defineProperty(el, "scrollTop", { value: 1000, writable: true });
    Object.defineProperty(el, "clientHeight", { value: 400 });
    Object.defineProperty(el, "scrollHeight", { value: 1400 });

    await container.trigger("scroll");

    await nextTick();

    expect(store.sortedData.length).toBeGreaterThan(0);
  });

  it("shows no data message when no filtered data exists", async () => {
    const wrapper = mount(Table, { global: { plugins: [pinia] } });
    const store = useDataTableStore();

    store.setData([]);
    await nextTick();

    expect(wrapper.find("td.no-data-text").exists()).toBe(true);
    expect(wrapper.find("td.no-data-text").text()).toContain("No data found");
  });

  it("filters data based on status correctly", async () => {
    const wrapper = mount(Table, { global: { plugins: [pinia] } });
    const store = useDataTableStore();

    store.setData([
      {
        id: 1,
        borrowerName: "Alice",
        amount: 100,
        status: "Approved",
        closeDate: "2025-01-01",
      },
      {
        id: 2,
        borrowerName: "Bob",
        amount: 200,
        status: "Pending",
        closeDate: "2025-02-01",
      },
    ]);
    await nextTick();

    const selects = wrapper.findAll("select");
    const statusSelect = selects[1];
    if (!statusSelect) throw new Error("Status dropdown not found");

    await statusSelect.setValue("Approved");
    await nextTick();

    expect(store.filteredData.length).toBe(1);
    expect(store.filteredData[0].status).toBe("Approved");
  });

  it("search with no results updates store and clears displayed rows", async () => {
    const wrapper = mount(Table, { global: { plugins: [pinia] } });
    const store = useDataTableStore();

    store.setData([
      {
        id: 1,
        borrowerName: "Charlie",
        amount: 300,
        status: "Rejected",
        closeDate: "2025-03-01",
      },
    ]);
    await nextTick();

    const input = wrapper.find("input[placeholder='Search Borrower']");
    await input.setValue("non-existent");
    vi.advanceTimersByTime(600);
    await nextTick();

    expect(store.searchValue).toBe("non-existent");
    expect(store.sortedData.length).toBe(0);
    expect(wrapper.find("td.no-data-text").exists()).toBe(true);
  });
});
