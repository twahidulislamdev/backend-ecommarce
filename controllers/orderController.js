const orderSchema = require("../model/orderSchema");
const couponSchema = require("../model/couponSchema");
const customerSchema = require("../model/customerSchema");
const { normalizeText, normalizeCode, computeDiscount } = require("../utils");

async function createOrderController(req, res) {
  const customerId = req.customer?.id || req.session?.userSchema?.id;
  const items = Array.isArray(req.body?.items) ? req.body.items : [];
  const shippingPayload = req.body?.shipping || {};
  const couponCode = normalizeCode(req.body?.couponCode);

  if (!customerId) {
    return res.status(401).json({
      success: false,
      message: "Customer login required",
    });
  }

  const customer = await customerSchema
    .findById(customerId)
    .select("firstName lastName email");
  if (!customer) {
    return res.status(401).json({
      success: false,
      message: "Customer account not found",
    });
  }

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

  const order = await orderSchema.create({
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

  return res.status(201).json({
    success: true,
    message: "Order placed successfully",
    data: order,
  });
}

async function getMyOrdersController(req, res) {
  const customerId = req.customer?.id || req.session?.customerUser?.id;
  if (!customerId) {
    return res.status(401).json({
      success: false,
      message: "Customer login required",
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

async function getAllOrdersController(req, res) {
  const orders = await orderSchema
    .find({})
    .populate("userId", "firstName lastName email role")
    .sort({ createdAt: -1 });

  return res.status(200).json({
    success: true,
    data: orders,
  });
}

async function updateOrderStatusController(req, res) {
  const { id } = req.params;
  const nextStatus = normalizeText(req.body?.status).toLowerCase();
  const allowedStatuses = [
    "pending",
    "paid",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];

  if (!allowedStatuses.includes(nextStatus)) {
    return res.status(400).json({
      success: false,
      message: "Invalid order status",
    });
  }

  const order = await orderSchema.findById(id);
  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found",
    });
  }

  order.status = nextStatus;
  await order.save();

  return res.status(200).json({
    success: true,
    message: "Order status updated successfully",
    data: order,
  });
}
module.exports = {
  createOrderController,
  getMyOrdersController,
  getAllOrdersController,
  updateOrderStatusController,
};
