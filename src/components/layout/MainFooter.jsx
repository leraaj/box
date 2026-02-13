import React from "react";
import "./layout.css";

const MainFooter = ({
  search,
  filter,
  monthYearOptions,
  setFilter,
  setSearch,
  backup,
  loading,
}) => {
  const formatDateParts = (date) => {
    const d = new Date(date);

    const dateStr = d.toLocaleDateString("en-PH", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });

    const timeStr = d.toLocaleTimeString("en-PH", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    return { dateStr, timeStr };
  };

  // ✅ compute once here
  const { dateStr, timeStr } = backup?.current?.createdTime
    ? formatDateParts(backup.current.createdTime)
    : { dateStr: "--", timeStr: "--" };

  return (
    <div className="main-footer">
      <div className="col-md col-12 text-white fs-h6 row m-0 p-0 gap-2">
        <span className="fs-6">Last update: </span>
        <span>
          <span
            className="d-flex gap-2 align-items-center"
            style={{ fontSize: "0.9rem" }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-calendar3"
              viewBox="0 0 16 16">
              <path d="M14 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2M1 3.857C1 3.384 1.448 3 2 3h12c.552 0 1 .384 1 .857v10.286c0 .473-.448.857-1 .857H2c-.552 0-1-.384-1-.857z" />
              <path d="M6.5 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
            </svg>
            {dateStr}
          </span>
          <span
            className="d-flex gap-2 align-items-center"
            style={{ fontSize: "0.9rem" }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-clock"
              viewBox="0 0 16 16">
              <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z" />
              <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0" />
            </svg>
            {timeStr}
          </span>
        </span>
      </div>

      <div className="col-md-4 col-12 mb-2">
        <div className="form-floating">
          <select
            className="form-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            disabled={loading}>
            <option value="">{loading ? "Loading..." : "Show all"}</option>
            {monthYearOptions.map((opt, i) => (
              <option key={i} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <label htmlFor="floatingSelect">Filter</label>
        </div>
      </div>
    </div>
  );
};

export default MainFooter;
