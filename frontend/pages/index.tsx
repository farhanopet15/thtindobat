import React, { useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";

type Product = {
  id: number;
  name: string;
  stock: number;
  price: number;
};

const formatIDR = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(
    Number(n) || 0
  );

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const [productId, setProductId] = useState<string>("");
  const [qty, setQty] = useState<number>(1);
  const [discount, setDiscount] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);

  async function fetchProducts() {
    setLoadingProducts(true);
    try {
      const res = await api.get<Product[]>("/products");
      setProducts(res.data || []);
    } catch {
      alert("Gagal ambil produk");
    } finally {
      setLoadingProducts(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  const selectedProduct = useMemo(() => {
    return products.find((p) => String(p.id) === String(productId));
  }, [products, productId]);

  const estimate = useMemo(() => {
    if (!selectedProduct) return 0;
    const raw = selectedProduct.price * (Number(qty) || 0);
    const disc = Math.floor((raw * (Number(discount) || 0)) / 100);
    return raw - disc;
  }, [selectedProduct, qty, discount]);

  const canSubmit = useMemo(() => {
    if (!selectedProduct) return false;
    if (!productId) return false;
    if (qty <= 0) return false;
    if (discount < 0 || discount > 100) return false;
    return true;
  }, [selectedProduct, productId, qty, discount]);

  async function submitOrder(e: React.FormEvent) {
    e.preventDefault();

    if (!productId) return alert("Pilih obat dulu");
    if (qty <= 0) return alert("Qty harus > 0");
    if (discount < 0 || discount > 100) return alert("Diskon 0-100");

    setSubmitting(true);
    try {
      await api.post("/order", {
        product_id: Number(productId),
        quantity: Number(qty),
        discount_percent: Number(discount),
      });

      alert("Order sukses!");
      setQty(1);
      setDiscount(0);
      await fetchProducts();
    } catch (err: unknown) {
      // ✅ no-explicit-any safe extraction
      const maybeAxiosErr = err as {
        response?: { data?: { message?: string } };
      };

      const msg =
        maybeAxiosErr?.response?.data?.message ||
        "Order gagal (stok habis / kalah cepat)";
      alert(msg);

      await fetchProducts();
    } finally {
      setSubmitting(false);
    }
  }

  // ✅ Style statis (murni CSSProperties)
  const s: Record<string, React.CSSProperties> = {
    page: {
      minHeight: "100vh",
      background:
        "radial-gradient(1000px 500px at 10% 0%, #e8f0ff 0%, transparent 60%), radial-gradient(900px 500px at 90% 10%, #ffe9f3 0%, transparent 55%), #f6f7fb",
      padding: 28,
      color: "#0f172a",
      fontFamily:
        'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial',
    },
    container: { maxWidth: 1100, margin: "0 auto" },
    header: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 18,
      gap: 12,
      flexWrap: "wrap",
    },
    titleWrap: { display: "flex", flexDirection: "column", gap: 4 },
    title: { margin: 0, fontSize: 22, fontWeight: 800, letterSpacing: -0.3 },
    subtitle: { margin: 0, fontSize: 13, color: "#475569" },

    chips: { display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" },
    chip: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      padding: "8px 10px",
      borderRadius: 999,
      background: "rgba(255,255,255,0.75)",
      border: "1px solid rgba(15,23,42,0.08)",
      boxShadow: "0 10px 25px rgba(15,23,42,0.06)",
      fontSize: 12,
      color: "#0f172a",
      backdropFilter: "blur(8px)",
    },

    grid: {
      display: "grid",
      gridTemplateColumns: "2fr 1fr",
      gap: 18,
      alignItems: "start",
    },

    card: {
      background: "rgba(255,255,255,0.85)",
      border: "1px solid rgba(15,23,42,0.08)",
      borderRadius: 14,
      boxShadow: "0 18px 50px rgba(15,23,42,0.10)",
      backdropFilter: "blur(10px)",
      overflow: "hidden",
    },
    cardHeader: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "14px 16px",
      borderBottom: "1px solid rgba(15,23,42,0.06)",
    },
    cardTitle: { margin: 0, fontSize: 15, fontWeight: 800 },
    cardBody: { padding: 16 },

    tableWrap: {
      border: "1px solid rgba(15,23,42,0.08)",
      borderRadius: 12,
      overflow: "hidden",
      background: "#fff",
    },
    table: { width: "100%", borderCollapse: "collapse", fontSize: 13 },
    th: {
      textAlign: "left",
      padding: "10px 12px",
      background: "#f1f5f9",
      color: "#0f172a",
      fontWeight: 800,
      borderBottom: "1px solid rgba(15,23,42,0.10)",
    },
    td: {
      padding: "10px 12px",
      borderBottom: "1px solid rgba(15,23,42,0.06)",
      color: "#0f172a",
    },

    field: {
      display: "flex",
      flexDirection: "column",
      gap: 6,
      marginBottom: 12,
    },
    label: { fontSize: 12, fontWeight: 800, color: "#0f172a" },
    input: {
      padding: "10px 12px",
      borderRadius: 10,
      border: "1px solid rgba(15,23,42,0.18)",
      background: "#fff",
      outline: "none",
      color: "#0f172a",
      fontSize: 14,
    },

    estimateBox: {
      padding: 14,
      borderRadius: 12,
      border: "1px solid rgba(15,23,42,0.10)",
      background:
        "linear-gradient(180deg, rgba(241,245,249,0.9) 0%, rgba(255,255,255,0.9) 100%)",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 12,
      margin: "12px 0 14px",
    },
    estimateLabel: { fontSize: 12, color: "#475569", fontWeight: 700 },
    estimateValue: { fontSize: 18, fontWeight: 900, color: "#0f172a" },

    helper: { margin: 0, fontSize: 12, color: "#475569", lineHeight: 1.45 },
  };

  // ✅ Style helper functions (tidak masuk Record)
  const dot = (bg: string): React.CSSProperties => ({
    width: 8,
    height: 8,
    borderRadius: 999,
    background: bg,
    boxShadow: "0 0 0 3px rgba(0,0,0,0.05)",
  });

  const btn = (variant: "primary" | "ghost" = "primary"): React.CSSProperties =>
    variant === "primary"
      ? {
          padding: "10px 12px",
          borderRadius: 10,
          border: "1px solid rgba(15,23,42,0.10)",
          background: "linear-gradient(180deg, #111827 0%, #0b1220 100%)",
          color: "#fff",
          fontWeight: 700,
          cursor: "pointer",
          boxShadow: "0 14px 30px rgba(2,6,23,0.25)",
        }
      : {
          padding: "10px 12px",
          borderRadius: 10,
          border: "1px solid rgba(15,23,42,0.12)",
          background: "rgba(255,255,255,0.7)",
          color: "#0f172a",
          fontWeight: 700,
          cursor: "pointer",
          boxShadow: "0 10px 22px rgba(15,23,42,0.08)",
        };

  const pill = (tone: "green" | "amber" | "red"): React.CSSProperties => {
    const map = {
      green: { bg: "rgba(34,197,94,0.12)", fg: "#166534" },
      amber: { bg: "rgba(245,158,11,0.14)", fg: "#92400e" },
      red: { bg: "rgba(239,68,68,0.12)", fg: "#991b1b" },
    } as const;

    return {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      padding: "5px 10px",
      borderRadius: 999,
      background: map[tone].bg,
      color: map[tone].fg,
      fontWeight: 800,
      fontSize: 12,
    };
  };

  const totalItems = products.length;
  const totalStock = products.reduce((a, b) => a + (Number(b.stock) || 0), 0);

  return (
    <div style={s.page}>
      <div style={s.container}>
        <div style={s.header}>
          <div style={s.titleWrap}>
            <h1 style={s.title}>Mini-Indobat Inventory</h1>
          </div>

          <div style={s.chips}>
            <div style={s.chip}>
              <span style={dot("#3b82f6")} />
              Produk: <b>{totalItems}</b>
            </div>
            <div style={s.chip}>
              <span style={dot("#22c55e")} />
              Total stok: <b>{totalStock}</b>
            </div>
          </div>
        </div>

        <div style={s.grid}>
          {/* Dashboard */}
          <div style={s.card}>
            <div style={s.cardHeader}>
              <h2 style={s.cardTitle}>Dashboard Produk</h2>
              <button
                onClick={fetchProducts}
                disabled={loadingProducts}
                style={{
                  ...btn("ghost"),
                  opacity: loadingProducts ? 0.7 : 1,
                  cursor: loadingProducts ? "not-allowed" : "pointer",
                }}
              >
                {loadingProducts ? "Loading..." : "Refresh"}
              </button>
            </div>

            <div style={s.cardBody}>
              <div style={s.tableWrap}>
                <table style={s.table}>
                  <thead>
                    <tr>
                      <th style={s.th}>ID</th>
                      <th style={s.th}>Nama Obat</th>
                      <th style={s.th}>Stok</th>
                      <th style={s.th}>Harga</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => {
                      const tone =
                        p.stock <= 0 ? "red" : p.stock <= 3 ? "amber" : "green";

                      return (
                        <tr key={p.id}>
                          <td style={s.td}>{p.id}</td>
                          <td style={s.td}>
                            <div style={{ fontWeight: 800 }}>{p.name}</div>
                            <div style={{ fontSize: 12, color: "#64748b" }}>
                              SKU: OBAT-{p.id}
                            </div>
                          </td>
                          <td style={s.td}>
                            <span style={pill(tone)}>
                              {p.stock <= 0 ? "Habis" : `${p.stock} pcs`}
                            </span>
                          </td>
                          <td style={s.td}>{formatIDR(p.price)}</td>
                        </tr>
                      );
                    })}

                    {products.length === 0 && (
                      <tr>
                        <td style={{ ...s.td, padding: 14 }} colSpan={4}>
                          <div style={{ fontWeight: 900, marginBottom: 4 }}>
                            Belum ada produk
                          </div>
                          <div style={{ color: "#475569", fontSize: 13 }}>
                            Tambahkan via API <b>POST /products</b> lalu klik
                            refresh.
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Order */}
          <div style={s.card}>
            <div style={s.cardHeader}>
              <h2 style={s.cardTitle}>Buat Order</h2>
            </div>

            <div style={s.cardBody}>
              <form onSubmit={submitOrder}>
                <div style={s.field}>
                  <label style={s.label}>Obat</label>
                  <select
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                    style={s.input}
                  >
                    <option value="">-- pilih obat --</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} (stok: {p.stock})
                      </option>
                    ))}
                  </select>
                </div>

                <div style={s.field}>
                  <label style={s.label}>Qty</label>
                  <input
                    type="number"
                    value={qty}
                    min={1}
                    onChange={(e) => setQty(Number(e.target.value))}
                    style={s.input}
                  />
                </div>

                <div style={s.field}>
                  <label style={s.label}>Diskon (%)</label>
                  <input
                    type="number"
                    value={discount}
                    min={0}
                    max={100}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    style={s.input}
                  />
                </div>

                <div style={s.estimateBox}>
                  <div>
                    <div style={s.estimateLabel}>Estimasi Harga</div>
                    <div style={s.estimateValue}>{formatIDR(estimate)}</div>
                  </div>
                  <div
                    style={{
                      textAlign: "right",
                      fontSize: 12,
                      color: "#64748b",
                    }}
                  >
                    {selectedProduct ? (
                      <>
                        <div>
                          Harga satuan:{" "}
                          <b>{formatIDR(selectedProduct.price)}</b>
                        </div>
                        <div>
                          Stok tersedia: <b>{selectedProduct.stock}</b>
                        </div>
                      </>
                    ) : (
                      <div>Pilih obat untuk lihat detail</div>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!canSubmit || submitting}
                  style={{
                    ...btn("primary"),
                    width: "100%",
                    opacity: !canSubmit || submitting ? 0.55 : 1,
                    cursor:
                      !canSubmit || submitting ? "not-allowed" : "pointer",
                  }}
                >
                  {submitting ? "Submitting..." : "Submit Order"}
                </button>
              </form>

              <div style={{ marginTop: 12 }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
