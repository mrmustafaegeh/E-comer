import { formatMoney, formatDate } from "./formatters";

/**
 * Transform a database product document into a frontend-ready object
 * @param {Object} dbProduct - The raw product from MongoDB
 * @returns {Object} - The transformed product
 */
export function transformProduct(dbProduct) {
  if (!dbProduct) return null;

  const id = dbProduct._id?.toString() || dbProduct.id;
  const name = dbProduct.name || dbProduct.title || "Untitled Product";
  
  return {
    ...dbProduct,
    id,
    _id: id, // Keep for backward compatibility
    name,
    title: name,
    price: Number(dbProduct.price) || 0,
    formattedPrice: formatMoney(dbProduct.price),
    salePrice: dbProduct.salePrice ? Number(dbProduct.salePrice) : null,
    formattedSalePrice: dbProduct.salePrice ? formatMoney(dbProduct.salePrice) : null,
    isOnSale: !!(dbProduct.salePrice && dbProduct.salePrice < dbProduct.price),
    discount: dbProduct.discount || (dbProduct.salePrice && dbProduct.price ? `-${Math.round(((dbProduct.price - dbProduct.salePrice) / dbProduct.price) * 100)}%` : ""),
    category: dbProduct.category?.toLowerCase() || "uncategorized",
    slug: dbProduct.slug || id,
    createdAt: dbProduct.createdAt ? new Date(dbProduct.createdAt).toISOString() : null,
    formattedDate: dbProduct.createdAt ? formatDate(dbProduct.createdAt) : "",
  };
}

/**
 * Transform a list of products
 * @param {Array} products - Array of raw product documents
 * @returns {Array} - Array of transformed products
 */
export function transformProducts(products) {
  if (!Array.isArray(products)) return [];
  return products.map(transformProduct);
}

/**
 * Transform a database order document
 * @param {Object} order - The raw order from MongoDB
 * @returns {Object} - The transformed order
 */
export function transformOrder(order) {
  if (!order) return null;

  const id = order._id?.toString() || order.id;

  return {
    ...order,
    id,
    _id: id,
    formattedTotal: formatMoney(order.totalAmount || order.totalPrice || 0),
    formattedDate: order.createdAt ? formatDate(order.createdAt) : "",
    items: Array.isArray(order.items) ? order.items.map(item => ({
      ...item,
      formattedPrice: formatMoney(item.price)
    })) : []
  };
}
