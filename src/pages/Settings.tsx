import { useEffect, useState, type FormEvent } from "react";
import { useApp } from "../context/AppContext";
import type { Settings as SettingsType } from "../types";

export function Settings() {
  const { settings, updateSettings, resetData } = useApp();
  const [form, setForm] = useState<SettingsType>(settings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setForm(settings);
  }, [settings]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    updateSettings(form);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Settings</h1>
          <p className="subtle">Manage your profile and preferences.</p>
        </div>
      </div>

      <form className="card settings-form" onSubmit={handleSubmit}>
        <label className="field">
          <span>Display name</span>
          <input
            name="displayName"
            value={form.displayName}
            onChange={(e) => setForm({ ...form, displayName: e.target.value })}
          />
        </label>

        <label className="field">
          <span>Email</span>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </label>

        <label className="field">
          <span>Items per page</span>
          <select
            name="itemsPerPage"
            value={form.itemsPerPage}
            onChange={(e) =>
              setForm({ ...form, itemsPerPage: Number(e.target.value) })
            }
          >
            {[10, 25, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>

        <label className="toggle">
          <input
            type="checkbox"
            checked={form.emailNotifications}
            onChange={(e) =>
              setForm({ ...form, emailNotifications: e.target.checked })
            }
          />
          <span>Email me when a task is assigned to me</span>
        </label>

        <div className="form-actions between">
          <button
            type="button"
            className="button ghost danger"
            onClick={() => {
              resetData();
              setSaved(false);
            }}
          >
            Reset demo data
          </button>
          <div className="save-cluster">
            {saved && (
              <span className="save-note" role="status">
                Saved!
              </span>
            )}
            <button type="submit" className="button primary">
              Save changes
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
