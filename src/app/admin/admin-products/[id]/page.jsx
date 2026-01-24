// app/admin/admin-products/[id]/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProductForm from "../../../../Component/dashboard/ProductForm";

export default function AdminEditProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`/api/admin/admin-products/${id}`, {
          cache: "no-store",
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data?.error || "Failed to load product");
        setProduct(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const onSubmit = async (values) => {
    try {
      setSaving(true);
      setError("");

      const res = await fetch(`/api/admin/admin-products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to update product");

      setProduct(data);
      // optional: go back to list page
      // router.push("/admin/admin-products");
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    const ok = confirm("Delete this product permanently?");
    if (!ok) return;

    try {
      setDeleting(true);
      setError("");

      const res = await fetch(`/api/admin/admin-products/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data?.error || "Failed to delete product");

      router.push("/admin/admin-products");
      router.refresh();
    } catch (e) {
      setError(e.message);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <div className="p-6">Loading…</div>;

  if (!product) {
    return (
      <div className="p-6">
        <p className="text-red-600">Failed to load product.</p>
        {error && <pre className="mt-2 text-sm opacity-80">{error}</pre>}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-start justify-between gap-4">
        <button
          onClick={onDelete}
          disabled={deleting}
          className="px-4 py-2 rounded-lg border hover:bg-red-50 disabled:opacity-60"
        >
          {deleting ? "Deleting..." : "Delete"}
        </button>
      </div>

      {error && (
        <div className="mt-4 p-3 rounded-lg border border-red-200 bg-red-50 text-red-700">
          {error}
        </div>
      )}

      <div className="mt-6">
        <ProductForm
          initialValues={product}
          onSubmit={onSubmit}
          saving={saving}
        />
      </div>
    </div>
  );
}
