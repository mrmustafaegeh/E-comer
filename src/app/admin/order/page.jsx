"use client";

import { useEffect, useState } from "react";
import OrderTable from "../../../Component/dashboard/OrderTable";

export default function DashboardOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function loadOrders() {
      try {
        const res = await fetch("/api/admin/admin-orders");
        const data = await res.json();
        setOrders(Array.isArray(data.orders) ? data.orders : []);
      } catch (err) {
        console.error("Failed to load orders:", err);
        setOrders([]);
      }
    }

    loadOrders();
  }, []);

  return <OrderTable orders={orders} />;
}
