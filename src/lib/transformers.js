import { formatMoney, formatDate } from "./formatters";

/**
 * Transform a database product document into a frontend-ready object
 */
export function transformProduct(dbProduct) {
  if (!dbProduct) return null;

  const id = dbProduct._id?.toString() || dbProduct.id;
  const name = dbProduct.name || dbProduct.title || "Untitled Product";
  const price = Number(dbProduct.price) || 0;
  const salePrice = dbProduct.salePrice ? Number(dbProduct.salePrice) : null;
  
  return {
    ...dbProduct,
    id,
    _id: id,
    name,
    title: name,
    price,
    formattedPrice: formatMoney(price),
    salePrice,
    formattedSalePrice: salePrice ? formatMoney(salePrice) : null,
    isOnSale: !!(salePrice && salePrice < price),
    discount: dbProduct.discount || (salePrice && price ? `-${Math.round(((price - salePrice) / price) * 100)}%` : ""),
    category: dbProduct.category?.toLowerCase() || "uncategorized",
    slug: dbProduct.slug || id,
    image: dbProduct.image || dbProduct.thumbnail || "/images/placeholder.png",
    createdAt: dbProduct.createdAt ? new Date(dbProduct.createdAt).toISOString() : null,
    formattedDate: dbProduct.createdAt ? formatDate(dbProduct.createdAt) : "",
  };
}

export function transformProducts(products) {
  if (!Array.isArray(products)) return [];
  return products.map(transformProduct);
}

/**
 * Transform a database order document
 */
export function transformOrder(order) {
  if (!order) return null;

  const id = order._id?.toString() || order.id;

  return {
    ...order,
    id,
    _id: id,
    totalAmount: Number(order.totalAmount || order.totalPrice || 0),
    formattedTotal: formatMoney(order.totalAmount || order.totalPrice || 0),
    formattedDate: order.createdAt ? formatDate(order.createdAt) : "",
    items: Array.isArray(order.items) ? order.items.map(item => ({
      ...item,
      id: item.id || item.productId || String(Math.random()),
      formattedPrice: formatMoney(item.price)
    })) : []
  };
}

/**
 * Transform a database user document
 */
export function transformUser(user) {
  if (!user) return null;
  
  const id = user._id?.toString() || user.id;
  
  return {
    id,
    _id: id,
    name: user.name || "Anonymous",
    email: user.email,
    image: user.image || null,
    role: user.role || "user",
    isAdmin: user.role === "admin",
    createdAt: user.createdAt ? new Date(user.createdAt).toISOString() : null,
  };
}
