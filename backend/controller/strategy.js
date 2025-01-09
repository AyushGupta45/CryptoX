import Strategy from "../models/strategy.model.js";

export const getStrategies = async (req, res) => {
  try {
    const strategies = await Strategy.find();
    res.status(200).json(strategies);
  } catch (error) {
    res.status(500).json({ message: "Error fetching strategies", error });
  }
};

export const getStrategy = async (req, res) => {
  const { symbol } = req.params;
  try {
    const strategy = await Strategy.findOne({ symbol });
    if (!strategy) {
      return res
        .status(404)
        .json({ message: `Strategy with symbol ${symbol} not found` });
    }
    res.status(200).json(strategy);
  } catch (error) {
    res.status(500).json({ message: "Error fetching strategy", error });
  }
};

export const createStrategy = async (req, res) => {
  try {
    const strategyData = req.body;
    const strategy = new Strategy(strategyData);
    await strategy.save();
    res
      .status(201)
      .json({ message: "Strategy created successfully", strategy });
  } catch (error) {
    res.status(500).json({ message: "Error creating strategy", error });
  }
};

export const insertManyStrategies = async (req, res) => {
  try {
    const strategies = req.body;
    const result = await Strategy.insertMany(strategies);
    res.status(201).json({ message: "Strategies created successfully", result });
  } catch (error) {
    res.status(500).json({ message: "Error inserting strategies", error: error.message });
  }
};


export const updateStrategy = async (req, res) => {
  try {
    const { symbol } = req.params;
    const updateData = req.body;
    const updatedStrategy = await Strategy.findOneAndUpdate(
      { symbol },
      { ...updateData, updatedAt: new Date() },
      { new: true }
    );
    if (!updatedStrategy) {
      return res.status(404).json({ message: "Strategy not found" });
    }
    res
      .status(200)
      .json({ message: "Strategy updated successfully", updatedStrategy });
  } catch (error) {
    res.status(500).json({ message: "Error updating strategy", error });
  }
};

export const updateIndicatorEnabled = async (req, res) => {
  try {
    const { symbol, indicator } = req.body;

    if (!symbol || !indicator) {
      return res
        .status(400)
        .json({ message: "Invalid input. Symbol, indicator, and enabled are required." });
    }

    const strategy = await Strategy.findOne({ symbol });
    if (!strategy) {
      return res
        .status(404)
        .json({ message: `Strategy with symbol ${symbol} not found` });
    }

    strategy.indicators[indicator].enabled = !strategy.indicators[indicator].enabled;
    await strategy.save();

    res.status(200).json({
      message: `Indicator ${indicator} updated successfully.`,
      strategy,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating indicator status", error: error.message });
  }
};
