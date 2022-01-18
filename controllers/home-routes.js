const router = require("express").Router();
// const sequelize = require("../config/connection");
const { Entry, User } = require("../models");

// Import the custom middleware ---> WHAT DOES THIS DO? ---> This creates a promise that must be resolved in order for app to progress
const withAuth = require("../utils/auth");

// GET ALL ENTRIES FOR AN INDIVDUAL USER
router.get("/", async (req, res) => {
	console.log("Here I am")
	try {
		// NEED TO CHANGE THIS TO THE NAME OF THE DATABASE FOR THE VARIABLE NAME, AND AWAIT ON ENTRY.FINDALL...THIS WILL BE USED TO POPULATE GRAPH
		const dbMoodData = await Entry.findAll();
		// THESE SHOULD ALL BE CHANGED TO ENTRY, THE DB TO THE DATABASE VARIABLE NAMED ABOVE
		// const entries = dbMoodData.map((gallery) =>
		// 	// WHAT DOES PLAIN: TRUE DO?
		// 	Entry.get({ plain: true })
		// );

		// WE need to create user_page in handlebars for user to login and see this stuff
		res.render("login", {
			dbMoodData,
			loggedIn: req.session.loggedIn,
		});
	} catch (err) {
		console.log(err);
		res.status(500).json(err);
	}
});

router.get("/login", (req, res) => {
	console.log(req.session.loggedIn, " ", req.session.userId);
	console.log(req.session);
	if (req.session.loggedIn) {
		res.redirect("/");
		return;
	}

	res.render("login");
});

// ***SHOULD BE MOVED TO API ROUTES BC OF THE RENDER
// GET ONE ENTRY
// Use the custom middleware before allowing the user to access the INDIVIDUAL ENTRIES
// WHEN A USER CLICKS ON THE POINT ON THE PLOT, IT BRINGS UP /ENTRY/:ID
router.get("/entry/:id", withAuth, async (req, res) => {
	try {
	  //  NEED TO CHANGE THIS TO THE NAME OF THE DATABASE FOR THE VARIABLE NAME AND AWAIT ON ENTRY.FINDBYPRIMARYKEY...
	  // THIS WILL BE USED TO FIND THE FULL INFORMATION ON ANY INDIVIDUAL ENTRY AND POPULATE UNDERNEATH THE GRAPH
	  // PERHAPS HAVE IT AUTOMATICALLY SHOW THE MOST RECENT ENTRY AS A PLACE HOLDER AND CHANGE TO WHICH EVER ONE IS CLICKED ON?
	  const dbMoodData = await Entry.findByPk(req.params.id, {
		include: [
		  {
			model: Entry,
			attributes: [
			  "id",
			  "username",
			  "mood",
			  "sleep",
			  "food",
			  "activities",
			],
		  },
		],
	  });
	  const userGraph = dbMoodData.get({ plain: true });
	  // THIS render needs to render within the user_page, without creating a new page
	  // PERHAPS THIS IS A HANDLEBARD PARTIAL
	  res.render("graph_stats", { userGraph, loggedIn: req.session.loggedIn });
	} catch (err) {
	  console.log(err);
	  res.status(500).json(err);
	}
  });

module.exports = router;
