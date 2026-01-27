import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    // 1. Total Revenue & Orders
    const statsQuery = db
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
        .toArray();

    // 2. Top Products (Get IDs and sales first)
    const topProductsQuery = db.collection("orders").aggregate([
        { $unwind: "$products" },
        {
          $group: {
            _id: "$products.productId",
            name: { $first: "$products.name" },
            image: { $first: "$products.image" },
            sales: { $sum: "$products.quantity" },
            revenue: { $sum: { $multiply: ["$products.price", "$products.quantity"] } },
          }
        },
        { $sort: { sales: -1 } },
        { $limit: 5 }
    ]).toArray();

    // 3. Recent Activity
    const recentActivityQuery = db.collection("orders")
        .find({})
        .sort({ createdAt: -1 })
        .limit(10)
        .toArray();

    // Run parallel
    const [statsResult, topProductsBasic, recentActivityData] = await Promise.all([
        statsQuery,
        topProductsQuery,
        recentActivityQuery
    ]);

    // 4. Manual Lookup for Top Products Stock
    const productIds = topProductsBasic.map(p => {
        try { return new ObjectId(p._id); } catch(e) { return null; }
    }).filter(id => id);

    const productsDetails = await db.collection("products")
        .find({ _id: { $in: productIds } })
        .project({ _id: 1, stock: 1 })
        .toArray();
    
    // Merge details
    const topProductsData = topProductsBasic.map(p => {
        const details = productsDetails.find(d => d._id.toString() === p._id.toString());
        return {
            id: p._id,
            name: p.name,
            image: p.image,
            sales: p.sales,
            revenue: p.revenue,
            stock: details ? details.stock : 0
        };
    });

    const formattedActivities = recentActivityData.map(order => ({
        id: order._id.toString(),
        type: "order",
        user: order.user?.email || order.shippingAddress?.fullName || "Guest",
        action: "placed an order",
        amount: "$" + (order.totalPrice || 0).toFixed(2),
        time: order.createdAt
    }));

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
      revenue: statsResult[0]?.totalRevenue || 0,
      orders: statsResult[0]?.totalOrders || 0,
      products: productsCount,
      users: usersCount,
      monthlyData: formattedMonthlyData,
      topProducts: topProductsData,
      activities: formattedActivities,
      orderStats: {
        pending: pendingOrders,
        processing: processingOrders,
      },
    };

    return NextResponse.json(response, {
  status: 200,
  headers: {
    "Cache-Control":
      process.env.NODE_ENV === "production"
        ? "private, s-maxage=60, stale-while-revalidate=120"
        : "no-store",
  },
})
  } catch (err) {
    console.error("ADMIN STATS ERROR:", err);
    return NextResponse.json(
      { error: "Failed to calculate stats" },
      { status: 500 }
    );
  }
}
