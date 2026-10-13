import Select from "react-select";

export default function GoalFilter({
  filter,
  setFilter,
}: {
  filter: string[];
  setFilter: (filter: string[]) => void;
}) {
  const filterOptions = [
    { value: "All", label: "All" },
    { value: "Daily", label: "Daily" },
    { value: "Weekly", label: "Weekly" },
    { value: "WeeklyOnThisDay", label: "Weekly On This Day" },
    { value: "WeeklyOnSetDay", label: "Weekly On Set Day" },
    { value: "Monthly", label: "Monthly" },
    { value: "MonthlyOnThisDay", label: "Monthly On This Day" },
    { value: "MonthlyOnSetDay", label: "Monthly On Set Day" },
    { value: "Yearly", label: "Yearly" },
    { value: "YearlyOnThisDay", label: "Yearly On This Day" },
    { value: "YearlyOnSetDay", label: "Yearly On Set Day" },
  ];

  console.log("Current filter:", filter);
  return (
    <div className="filter-container">
      <Select
        inputId="filterSelect"
        aria-label="Filter Goals"
        className="filter-select"
        classNamePrefix="filter-select"
        isMulti
        closeMenuOnSelect={false}
        placeholder="Filter Goals"
        options={filterOptions}
        value={filterOptions.filter((o) => filter.includes(o.value))}
        onChange={(selected) => setFilter(selected.map((o) => o.value))}
      />
    </div>
  );
}
