const items = ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"];

let currentIndex = 0;
let lastUpdatedTime = Date.now();

const TEN_MINUTES = 1 * 60 * 1000;

async function getQOT(req, res, next) {
  try {
    const now = Date.now();

    // Check if 10 minutes passed
    if (now - lastUpdatedTime >= TEN_MINUTES) {
      currentIndex = (currentIndex + 1) % items.length;
      lastUpdatedTime = now;
    }
    return res.status(200).json({
      status: "success",
      message: "",
      data: {
        item: items[currentIndex],
        index: currentIndex,
        nextChangeInSeconds: Math.ceil(
          (TEN_MINUTES - (now - lastUpdatedTime)) / 1000
        )
      }
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { getQOT };
