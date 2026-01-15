import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    // Run parallel aggregation queries for performance
    const [stats] = await Promise.all([
      // 1. Total Revenue (sum of all orders)
      db
        .collection("orders")
        .aggregate([
          {
            $group: {
              _id: null,
              totalRevenue: { $sum: "$totalPrice" },
              totalOrders: { $count: {} },
            },
          },
        ])
        .toArray(),
    ]);

    // 2. Count other entities
    const [productsCount, usersCount, pendingOrders, processingOrders] =
      await Promise.all([
        db.collection("products").countDocuments(),
        db.collection("users").countDocuments(),
        db.collection("orders").countDocuments({ status: "pending" }),
        db.collection("orders").countDocuments({ status: "processing" }),
      ]);

    // 3. Monthly Revenue (Last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyRevenue = await db
      .collection("orders")
      .aggregate([
        {
          $match: {
            createdAt: { $gte: sixMonthsAgo },
          },
        },
        {
          $group: {
            _id: {
              month: { $month: "$createdAt" },
              year: { $year: "$createdAt" },
            },
            revenue: { $sum: "$totalPrice" },
            orders: { $count: {} },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ])
      .toArray();

    // 4. Format Monthly Data
    const formattedMonthlyData = monthlyRevenue.map((item) => {
      const date = new Date();
      date.setMonth(item._id.month - 1);
      return {
        month: date.toLocaleString("default", { month: "short" }),
        revenue: item.revenue,
        orders: item.orders,
      };
    });

    const response = {
      revenue: stats[0]?.totalRevenue || 0,
      orders: stats[0]?.totalOrders || 0,
      products: productsCount,
      users: usersCount,
      monthlyData: formattedMonthlyData,
      orderStats: {
        pending: pendingOrders,
        processing: processingOrders,
      },
    };

    return NextResponse.json(response, { status: 200 });
  } catch (err) {
    console.error("ADMIN STATS ERROR:", err);
    return NextResponse.json(
      { error: "Failed to calculate stats" },
      { status: 500 }
    );
  }
}
