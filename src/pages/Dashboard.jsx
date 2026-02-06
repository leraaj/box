import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import Navbar from "../components/nav/Navbar";
import "../App.css";
import "../components/layout/layout.css";
import MainFooter from "../components/layout/MainFooter";
import MainContent from "../components/layout/MainContent";
import { meta } from "@eslint/js";

export default function Dashboard() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");
  const scrollRef = useRef(null);

  // Scroll helper
  const scrollDown = useCallback(() => {
    setTimeout(() => {
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  }, []);

  // Fetch messages once
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/messages`);
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        const data = await res.json();
        setMessages(data.data || []);
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      } finally {
        setLoading(false);
        scrollDown();
      }
    };
    fetchMessages();
  }, [scrollDown]);

  // Memoized month-year options to avoid recalculation
  const monthYearOptions = useMemo(() => {
    const options = Array.from(
      new Set(
        messages.map((m) => {
          const d = new Date(m.date);
          return `${d.toLocaleString("default", {
            month: "short",
          })} - ${d.getFullYear()}`;
        })
      )
    );
    return options.sort((a, b) => {
      const [m1, y1] = a.split(" - ");
      const [m2, y2] = b.split(" - ");
      return new Date(`${m2} 1, ${y2}`) - new Date(`${m1} 1, ${y1}`);
    });
  }, [messages]);

  // Memoized filtered messages for performance
  const filteredMessages = useMemo(() => {
    if (!messages.length) return [];
    let temp = messages;

    if (filter) {
      const [monthStr, yearStr] = filter.split(" - ");
      const month = new Date(`${monthStr} 1, ${yearStr}`).getMonth();
      const year = Number(yearStr);
      temp = temp.filter((m) => {
        const d = new Date(m.date);
        return d.getMonth() === month && d.getFullYear() === year;
      });
    }

    if (search) {
      const searchLower = search.toLowerCase();
      temp = temp.filter(
        (m) =>
          (m.body && m.body.toLowerCase().includes(searchLower)) ||
          (m.contact_name && m.contact_name.toLowerCase().includes(searchLower))
      );
    }

    return temp;
  }, [messages, filter, search]);

  // Scroll when filteredMessages change
  useEffect(() => {
    scrollDown();
  }, [filteredMessages, scrollDown]);
  // Helper to highlight search term in a string
  const highlightText = (text, query) => {
    if (!query) return text;

    const regex = new RegExp(`(${query})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} style={{ backgroundColor: "yellow", color: "black" }}>
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <>
      <div className="main-searchbar col-12">
        <input
          type="search"
          className="form-control"
          placeholder="Search from messages.."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          disabled={loading}
        />
      </div>

      <MainContent>
        <div className="messages-wrapper flex-grow-1 overflow-auto px-2 rounded">
          {loading ? (
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ height: "100%", width: "100%" }}>
              <span
                className="spinner-grow spinner-grow-sm text-secondary"
                style={{ width: "3rem", height: "3rem" }}
                aria-hidden="true"></span>
            </div>
          ) : filteredMessages.length === 0 ? (
            <p className="text-center text-light">No messages found.</p>
          ) : (
            filteredMessages.map((m, i) => {
              const d = new Date(m.date);
              const month = d.getMonth() + 1;
              const day = d.getDate();
              const year = d.getFullYear();
              let hours = d.getHours();
              const minutes = d.getMinutes().toString().padStart(2, "0");
              const ampm = hours >= 12 ? "PM" : "AM";
              hours = hours % 12 || 12;
              const formattedDate = `${month}/${day}/${year} - ${hours}:${minutes} ${ampm}`;

              return (
                <div
                  key={i}
                  className={`message ${
                    m.type == 1 ? "me" : m.type == 2 ? "you" : ""
                  }`}>
                  <div className="message-body">
                    {highlightText(m.body, search)}
                  </div>
                  <div className="message-datetime">{formattedDate}</div>
                </div>
              );
            })
          )}
          <div ref={scrollRef}></div>
        </div>
      </MainContent>

      <MainFooter
        filter={filter}
        monthYearOptions={monthYearOptions}
        search={search}
        setFilter={setFilter}
        setSearch={setSearch}
      />
    </>
  );
}
