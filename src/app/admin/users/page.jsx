// app/admin/users/page.jsx
"use client";

import { useEffect, useMemo, useState } from "react";

function useDebouncedValue(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

export default function AdminUsersPage() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 450);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const query = useMemo(() => {
    const sp = new URLSearchParams();
    sp.set("page", String(page));
    sp.set("limit", String(limit));
    if (debouncedSearch) sp.set("search", debouncedSearch);
    return sp.toString();
  }, [page, limit, debouncedSearch]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/admin/admin-users?${query}`, {
          cache: "no-store",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Failed to load users");

        if (!cancelled) {
          setItems(data.users || []);
          setTotal(data.total || 0);
        }
      } catch (e) {
        if (!cancelled) setError(e?.message || "Something went wrong");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [query]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold">Users</h1>

        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search name or email..."
          className="border rounded-lg px-3 py-2 w-full md:w-80"
        />
      </div>

      {loading ? (
        <div className="py-12 text-center text-gray-600">Loading users...</div>
      ) : error ? (
        <div className="py-12 text-center text-red-600">{error}</div>
      ) : (
        <>
          <div className="overflow-x-auto border rounded-xl">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Created</th>
                </tr>
              </thead>
              <tbody>
                {items.map((u) => (
                  <tr key={u.id} className="border-t">
                    <td className="p-3">{u.name || "-"}</td>
                    <td className="p-3">{u.email || "-"}</td>
                    <td className="p-3">{u.role || "user"}</td>
                    <td className="p-3">
                      {u.createdAt
                        ? new Date(u.createdAt).toLocaleString()
                        : "-"}
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr>
                    <td className="p-6 text-center text-gray-500" colSpan={4}>
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-gray-600">
              Total: <span className="font-medium">{total}</span>
            </p>

            <div className="flex items-center gap-2">
              <button
                className="px-3 py-2 border rounded disabled:opacity-50"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Prev
              </button>

              <span className="text-sm text-gray-600">
                Page <span className="font-medium">{page}</span> /{" "}
                <span className="font-medium">{totalPages}</span>
              </span>

              <button
                className="px-3 py-2 border rounded disabled:opacity-50"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
