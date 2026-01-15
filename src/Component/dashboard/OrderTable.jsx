export default function OrderTable({ orders }) {
  const list = Array.isArray(orders)
    ? orders
    : Array.isArray(orders?.orders)
    ? orders.orders
    : [];

  if (list.length === 0) {
    return (
      <div className="rounded-md border border-gray-200 bg-white p-6 text-gray-600">
        No orders found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-md border border-gray-200 shadow-sm">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="border-b bg-gray-100 text-left text-sm font-medium text-gray-700">
            <th className="p-3">Order ID</th>
            <th className="p-3">User</th>
            <th className="p-3">Status</th>
            <th className="p-3">Total</th>
            <th className="p-3">Items</th>
            <th className="p-3">Date</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {list.map((order) => {
            const id = order?.id || order?._id;
            const total = order?.totalPrice ?? order?.total ?? 0;
            const itemsCount = Array.isArray(order?.items)
              ? order.items.length
              : Array.isArray(order?.products)
              ? order.products.length
              : 0;

            const created = order?.createdAt ? new Date(order.createdAt) : null;

            return (
              <tr key={id} className="border-b hover:bg-gray-50">
                <td className="p-3">{id}</td>
                <td className="p-3">
                  {order?.user?.email || order?.userEmail || order?.shippingAddress?.fullName || "-"}
                </td>
                <td className="p-3">{order?.status || "-"}</td>
                <td className="p-3">${Number(total).toFixed(2)}</td>
                <td className="p-3">{itemsCount} items</td>
                <td className="p-3">
                  {created ? created.toLocaleDateString() : "-"}
                </td>
                <td className="p-3 space-x-2">
                  <button className="rounded bg-blue-500 px-3 py-1 text-sm text-white">
                    Update Status
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
