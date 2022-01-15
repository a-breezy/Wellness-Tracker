const router = require("express").Router();
const { Entry, User } = require("../../models");
const withAuth = require("../../utils/auth");



// CREATE NEW ENTRY
router.post("/", async (req, res) => {
  console.log("BODY", req.body);
  try {
    // NEED TO CHANGE THIS TO THE NAME OF THE DATABASE FOR THE VARIABLE NAME
    const dbMoodData = await Entry.create({
      user_id: req.session.userId,
      mood: Number(req.body.mood),
      sleep: Number(req.body.sleep),
      food: req.body.food,
      activities: req.body.activities
    });

    res.status(200).json({message: "Entry successfully created!", data: dbMoodData});
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

module.exports = router;
