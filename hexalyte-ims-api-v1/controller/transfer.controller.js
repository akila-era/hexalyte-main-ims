const transferService = require('../service/transfer.service');
const db = require('../models');
const warehousetransfers = db.warehousetransfers;
const Product = db.product;
const Warehouse = db.warehouselocation;

exports.transferStock = async (req, res) => {

  try {
    const result = await transferService.transferStock(req.body);
    if (result.message === "Source and target warehouses must be different.") {
      return res.status(400).json({ error: result.message });
    }
    if (result.message === "Product does not exist.") {
      return res.status(400).json({ error: result.message });
    }
    if (result.message === "Source warehouse does not exist.") {
      return res.status(400).json({ error: result.message });
    }
    if (result.message === "target Warehouse does not exist.") {
      return res.status(400).json({ error: result.message });
    }
    if (result.message === "Insufficient stock in the source warehouse.") {
      return res.status(400).json({ error: result.message });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllTransfers = async (req, res) => {
  try {
    const transfers = await transferService.getAllTransfers();
    res.status(200).json({ success: true, transfers });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
