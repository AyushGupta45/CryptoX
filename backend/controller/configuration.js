import Config from "../models/config.model.js";

export const getConfigs = async (req, res) => {
  try {
    const configs = await Config.find();
    res.status(200).json(configs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createConfig = async (req, res) => {
  const config = new Config(req.body);
  try {
    await config.save();
    res.status(201).json(config);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const createConfigs = async (req, res) => {
  const configs = req.body;

  try {
    const savedConfigs = await Config.insertMany(configs);
    res.status(201).json(savedConfigs);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateConfigTradingEnabled = async (req, res) => {
  try {
    const { symbol } = req.params;
    const config = await Config.findOne({ symbol });

    if (!config) {
      return res.status(404).json({ message: "Config not found" });
    }
    config.tradingEnabled = !config.tradingEnabled;
    await config.save();
    res.status(200).json(config);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateConfig = async (req, res) => {
  try {
    const { symbol } = req.params;
    const { allowedBudget, riskPercentage, stopLoss, cooldown } = req.body;

    const config = await Config.findOneAndUpdate(
      { symbol },
      { allowedBudget, riskPercentage, stopLoss, cooldown },
      { new: true }
    );

    if (!config) {
      return res.status(404).json({ message: "Config not found" });
    }

    res.status(200).json(config);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

