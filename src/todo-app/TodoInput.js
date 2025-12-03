import { useState } from "react";

const defaultForm = {
    task_name: "",
    task_describle: "",
    task_prior: 1,
    task_deadline: "",
};

function TodoInput({ onAddTask, onAddRandomTask }) {
    const [form, setForm] = useState(defaultForm);
    const [error, setError] = useState("");

    const handleTimeChange = (event) => {
        const value = event.target.value;
        // Remove non-numeric characters except colon
        let cleaned = value.replace(/[^\d:]/g, "");

        // Auto-format to HH:mm
        if (cleaned.length <= 2) {
            // Just hours - keep as is
            // cleaned stays the same
        } else if (
            cleaned.length <= 4 &&
            !cleaned.includes(":")
        ) {
            // Hours and some minutes, add colon
            cleaned =
                cleaned.slice(0, 2) +
                ":" +
                cleaned.slice(2);
        } else if (cleaned.length > 5) {
            // Full time, limit to HH:mm
            cleaned = cleaned.slice(0, 5);
        }

        // Validate format (allow partial input like "1", "12", "12:3", "12:30")
        const timeRegex =
            /^([0-1]?[0-9]|2[0-3])(:([0-5]?[0-9])?)?$/;
        if (cleaned === "" || timeRegex.test(cleaned)) {
            setForm((prev) => ({
                ...prev,
                task_deadline: cleaned,
            }));
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        if (name === "task_deadline") {
            handleTimeChange(event);
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const toUnixTime = (timeValue) => {
        if (!timeValue) return undefined;

        // Parse time input (HH:mm format)
        const [hours, minutes] = timeValue
            .split(":")
            .map(Number);
        if (Number.isNaN(hours) || Number.isNaN(minutes)) {
            return undefined;
        }

        // Get today's date
        const today = new Date();
        today.setHours(hours, minutes, 0, 0);

        // If the time has passed today, set it for tomorrow
        const now = new Date();
        if (today < now) {
            today.setDate(today.getDate() + 1);
        }

        return Math.floor(today.getTime() / 1000);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!form.task_name.trim()) {
            setError("Tên công việc không được để trống");
            return;
        }

        onAddTask({
            task_name: form.task_name.trim(),
            task_describle: form.task_describle.trim(),
            task_prior: Number(form.task_prior),
            task_deadline_time: toUnixTime(
                form.task_deadline
            ),
        });

        setForm(defaultForm);
        setError("");
    };

    return (
        <form
            className="todo-input-card"
            onSubmit={handleSubmit}
        >
            <div>
                <h3>Tạo công việc mới</h3>
            </div>

            <div>
                <label htmlFor="task_name">
                    Tên công việc
                </label>
                <input
                    id="task_name"
                    name="task_name"
                    className="todo-input"
                    placeholder="Ví dụ: Viết tài liệu onboarding"
                    value={form.task_name}
                    onChange={handleChange}
                />
            </div>

            <div>
                <label htmlFor="task_describle">
                    Mô tả
                </label>
                <textarea
                    id="task_describle"
                    name="task_describle"
                    className="todo-input"
                    placeholder="Thêm mô tả cụ thể, checklist hoặc resources cần thiết..."
                    value={form.task_describle}
                    onChange={handleChange}
                />
            </div>

            <div className="todo-input-card__row">
                <div>
                    <label htmlFor="task_prior">
                        Độ ưu tiên
                    </label>
                    <select
                        id="task_prior"
                        name="task_prior"
                        className="todo-input priority-input"
                        value={form.task_prior}
                        onChange={handleChange}
                    >
                        <option value={0}>Thấp</option>
                        <option value={1}>
                            Trung bình
                        </option>
                        <option value={2}>Cao</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="task_deadline">
                        Deadline
                    </label>
                    <input
                        id="task_deadline"
                        name="task_deadline"
                        type="text"
                        className="todo-input deadline-input"
                        value={form.task_deadline}
                        onChange={handleChange}
                        pattern="^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$"
                        placeholder="HH:mm (24h)"
                        maxLength={5}
                        inputMode="numeric"
                    />
                </div>
            </div>

            {error && (
                <p
                    style={{
                        color: "#f87171",
                        fontSize: "0.85rem",
                    }}
                >
                    {error}
                </p>
            )}

            <div className="todo-input-card__buttons">
                <button type="submit">Add</button>
                <button
                    type="button"
                    className="ghost-button"
                    onClick={() => onAddRandomTask?.()}
                >
                    Random Add
                </button>
            </div>
        </form>
    );
}

export default TodoInput;
