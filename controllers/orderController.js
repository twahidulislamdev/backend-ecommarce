const orderSchema = require("../model/orderSchema");
const couponSchema = require("../model/couponSchema");
const customerSchema = require("../model/customerSchema");
const { normalizeText, normalizeCode, computeDiscount } = require("../utils");

// Create a new order
async function createOrderController(req, res) {
  let initialCustomerId = req.customer?.id || req.session?.userSchema?.id;
  const customerEmail = req.session?.userSchema?.email;
  const items = Array.isArray(req.body?.items) ? req.body.items : [];
  const shippingPayload = req.body?.shipping || {};
  const couponCode = normalizeCode(req.body?.couponCode);

  if (!initialCustomerId && !customerEmail) {
    return res.status(401).json({
      success: false,
      message: "Customer login required",
    });
  }

  let customer = null;
  if (initialCustomerId) {
    customer = await customerSchema.findById(initialCustomerId).select("firstName lastName email _id");
  }
  if (!customer && customerEmail) {
    customer = await customerSchema.findOne({ email: customerEmail }).select("firstName lastName email _id");
  }

  if (!customer) {
    return res.status(401).json({
      success: false,
      message: "Customer account not found",
    });
  }
  
  const customerId = customer._id;

  if (items.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Cart is empty",
    });
  }

  const shipping = {
    fullName: normalizeText(shippingPayload.fullName),
    phone: normalizeText(shippingPayload.phone),
    address: normalizeText(shippingPayload.address),
    city: normalizeText(shippingPayload.city),
  };

  if (
    !shipping.fullName ||
    !shipping.phone ||
    !shipping.address ||
    !shipping.city
  ) {
    return res.status(400).json({
      success: false,
      message: "All shipping fields are required",
    });
  }

  const normalizedItems = items
    .map((item) => {
      const price = Number(item.price);
      const quantity = Number(item.quantity);
      if (
        !Number.isFinite(price) ||
        price < 0 ||
        !Number.isFinite(quantity) ||
        quantity < 1
      ) {
        return null;
      }

      return {
        productId: item.productId || item.id || null,
        title: normalizeText(item.title),
        thumbnail: normalizeText(item.thumbnail),
        price,
        quantity,
      };
    })
    .filter(Boolean);

  if (
    normalizedItems.length === 0 ||
    normalizedItems.some((item) => !item.title)
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid cart items",
    });
  }

  const subTotal = normalizedItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const shippingFee = subTotal > 0 ? 5 : 0;
  let discountAmount = 0;
  let couponType = "";
  let appliedCode = "";

  if (couponCode) {
    const coupon = await couponSchema.findOne({ code: couponCode });
    if (!coupon) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid coupon code" });
    }
    if (!coupon.isActive) {
      return res
        .status(400)
        .json({ success: false, message: "Coupon is disabled" });
    }
    if (coupon.expiresAt && new Date(coupon.expiresAt).getTime() < Date.now()) {
      return res
        .status(400)
        .json({ success: false, message: "Coupon has expired" });
    }
    if (
      Number(coupon.usageLimit || 0) > 0 &&
      Number(coupon.usedCount || 0) >= Number(coupon.usageLimit)
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Coupon usage limit reached" });
    }
    if (
      Number(coupon.minOrderAmount || 0) > 0 &&
      subTotal < Number(coupon.minOrderAmount)
    ) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount is ${Number(coupon.minOrderAmount)}`,
      });
    }

    discountAmount = computeDiscount({ coupon, subTotal });
    if (discountAmount > 0) {
      appliedCode = coupon.code;
      couponType = coupon.type;

      if (Number(coupon.usageLimit || 0) > 0) {
        const updated = await couponSchema.findOneAndUpdate(
          { _id: coupon._id, usedCount: { $lt: coupon.usageLimit } },
          { $inc: { usedCount: 1 } },
          { new: true },
        );
        if (!updated) {
          return res
            .status(400)
            .json({ success: false, message: "Coupon usage limit reached" });
        }
      } else {
        await couponSchema.updateOne(
          { _id: coupon._id },
          { $inc: { usedCount: 1 } },
        );
      }
    }
  }

  const grandTotal = Math.max(
    0,
    Number((subTotal + shippingFee - discountAmount).toFixed(2)),
  );

  let order;
  try {
    order = await orderSchema.create({
      userId: customerId,
      customer: {
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
      },
      items: normalizedItems,
      shipping,
      subTotal,
      shippingFee,
      grandTotal,
      coupon: {
        code: appliedCode,
        discountAmount,
        type: couponType,
      },
    });
  } catch (err) {
    console.error("Order creation failed:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to place order",
    });
  }

  return res.status(201).json({
    success: true,
    message: "Order placed successfully",
    data: order,
  });
}
// Get orders of the logged-in customer
async function getMyOrdersController(req, res) {
  let initialCustomerId = req.customer?.id || req.session?.userSchema?.id;
  const customerEmail = req.session?.userSchema?.email;

  if (!initialCustomerId && !customerEmail) {
    return res.status(401).json({
      success: false,
      message: "Customer login required",
    });
  }

  let customerId = initialCustomerId;
  
  if (!customerId && customerEmail) {
    const customer = await customerSchema.findOne({ email: customerEmail }).select("_id");
    if (customer) {
      customerId = customer._id;
    }
  }

  if (!customerId) {
    return res.status(401).json({
      success: false,
      message: "Customer account not found",
    });
  }

  const orders = await orderSchema
    .find({ userId: customerId })
    .sort({ createdAt: -1 });
  return res.status(200).json({
    success: true,
    data: orders,
  });
}
// Get all orders (admin)
async function getAllOrdersController(req, res) {
  try {
    const orders = await orderSchema.find({}).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (err) {
    console.error("Failed to fetch orders:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to fetch orders",
    });
  }
}

const ALLOWED_ORDER_STATUSES = [
  "pending",
  "paid",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

// Update order details (admin)
function parseCustomerName(customerName) {
  const parts = normalizeText(customerName).split(/\s+/).filter(Boolean);
  if (parts.length === 0) return null;
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" "),
  };
}

function recalculateOrderTotals(order) {
  const subTotal = order.items.reduce(
    (total, item) => total + Number(item.price) * Number(item.quantity),
    0,
  );
  const discount = Number(order.coupon?.discountAmount) || 0;
  const shippingFee = Number(order.shippingFee) || 0;
  order.subTotal = subTotal;
  order.grandTotal = Math.max(0, subTotal + shippingFee - discount);
}

function applyQuantityToItems(items, targetQuantity) {
  const quantity = Math.max(1, Math.floor(Number(targetQuantity)));
  if (!Number.isFinite(quantity) || items.length === 0) return;

  if (items.length === 1) {
    items[0].quantity = quantity;
    return;
  }

  const currentTotal = items.reduce((sum, item) => sum + Number(item.quantity), 0);
  if (currentTotal <= 0) {
    items[0].quantity = quantity;
    return;
  }

  let assigned = 0;
  items.forEach((item, index) => {
    if (index === items.length - 1) {
      item.quantity = Math.max(1, quantity - assigned);
      return;
    }
    const share = Math.max(1, Math.round((Number(item.quantity) / currentTotal) * quantity));
    item.quantity = share;
    assigned += share;
  });
}
// Only Admin Can Update Order Status And Details
async function updateOrderController(req, res) {
  try {
    const { id } = req.params;
    const order = await orderSchema.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const status = normalizeText(req.body?.status).toLowerCase();
    if (status) {
      if (!ALLOWED_ORDER_STATUSES.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid order status",
        });
      }
      order.status = status;
    }

    const parsedCustomer = parseCustomerName(req.body?.customer);
    if (parsedCustomer) {
      order.customer.firstName = parsedCustomer.firstName;
      order.customer.lastName = parsedCustomer.lastName;
      if (order.shipping?.fullName) {
        order.shipping.fullName = `${parsedCustomer.firstName} ${parsedCustomer.lastName}`.trim();
      }
    }

    const productTitle = normalizeText(req.body?.product);
    if (productTitle && order.items.length === 1) {
      order.items[0].title = productTitle;
    }

    if (req.body?.quantity != null) {
      applyQuantityToItems(order.items, req.body.quantity);
      recalculateOrderTotals(order);
    }

    const manualTotal = Number(req.body?.total);
    if (Number.isFinite(manualTotal) && manualTotal >= 0) {
      order.grandTotal = manualTotal;
    } else if (req.body?.quantity != null) {
      recalculateOrderTotals(order);
    }

    order.markModified("items");
    order.markModified("customer");
    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order updated successfully",
      data: order,
    });
  } catch (err) {
    console.error("Order update failed:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to update order",
    });
  }
}

module.exports = {
  createOrderController,
  getMyOrdersController,
  getAllOrdersController,
  updateOrderController,
};
