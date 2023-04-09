const Order = require("../models/Order");
const moment = require("moment");

exports.getAnalytic = async (req, res) => {
  try {
    const { q, limit, page, filterBy, start, end } = req.query;
    const sd = new Date(moment().startOf("month").toISOString());
    const ed = new Date(moment().endOf("month").toISOString());

    const filterByDay = await Order.aggregate([
      {
        $match: {
          $or: [
            {
              createdAt: {
                $gte: start ? new Date(start) : sd,
                $lte: end
                  ? new Date(
                      new Date(end).getFullYear(),
                      new Date(end).getMonth(),
                      new Date(end).getDate() + 1
                    )
                  : ed,
              },
            },
          ],
        },
      },
      {
        $project: {
          order: "$totalQty",
          salesTurnover: "$total",
          salesBuyPrice: "$totalBuyPrice",
          date: "$createdAt",
        },
      },
      {
        $group: {
          totalQty: { $sum: "$order" },
          totalSalesTurnover: { $sum: "$salesTurnover" },
          totalSalesBuyPrice: { $sum: "$salesBuyPrice" },
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
        },
      },
      {
        $addFields: {
          totalProfit: {
            $subtract: ["$totalSalesTurnover", "$totalSalesBuyPrice"],
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);

    res.json({
      message: "Successfully get data",
      data: filterByDay,
      filterBy: "Day",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
