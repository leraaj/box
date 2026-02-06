import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");

  const inputsRef = useRef([]);
  const { loginWithCode, isAuthenticated } = useAuth();

  const navigate = useNavigate();

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const newDigits = [...digits];
    newDigits[index] = value;
    setDigits(newDigits);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const code = digits.join("");

    const ok = loginWithCode(code);

    if (!ok) {
      setError("Invalid code");
      return;
    }

    navigate("/dashboard", { replace: true });
  };
  useEffect(() => {
    const code = digits.join("");

    if (code.length === 6 && !digits.includes("")) {
      const ok = loginWithCode(code);

      if (!ok) {
        setError("Invalid code");
        return;
      }

      navigate("/dashboard", { replace: true });
    }
  }, [digits, loginWithCode, navigate]);
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);
  return (
    <div
      className="d-flex justify-content-center align-items-center bg-dark"
      style={{ height: "100dvh", width: "100%" }}>
      <form onSubmit={handleSubmit}>
        <div className="d-flex justify-content-between gap-2 mb-3">
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => (inputsRef.current[i] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              className="form-control text-center fs-4 rounded-4 border-0"
              value={d}
              placeholder={`${i < 2 ? "M" : i >= 2 && i <= 3 ? "D" : "Y"}`}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              style={{ width: 48 }}
            />
          ))}
        </div>

        {error && <div className="text-danger mb-2">{error}</div>}
      </form>
    </div>
  );
}
