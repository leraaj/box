import React from "react";

import "./layout.css";
const MainFooter = ({
  search,
  filter,
  monthYearOptions,
  setFilter,
  setSearch,
}) => {
  return (
    <div className="main-footer">
      <div className="col-md-4 col-12 mb-2">
        <div class="form-floating">
          <select
            className="form-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}>
            <option value="">Show all</option>
            {monthYearOptions.map((opt, i) => (
              <option key={i} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <label for="floatingSelect">Filter</label>
        </div>
      </div>
    </div>
  );
};

export default MainFooter;
