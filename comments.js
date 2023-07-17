// Create a web server
var express = require("express");
var router = express.Router();

// Import the model (comment.js) to use its database functions.
var comment = require("../models/comment.js");

// Create all our routes and set up logic within those routes where required.
router.get("/", function (req, res) {
    comment.all(function (data) {
        var hbsObject = {
            comments: data,
        };
        console.log(hbsObject);
        res.render("index", hbsObject);
    });
});

router.post("/api/comments", function (req, res) {
    comment.create(["comment"], [req.body.comment], function (result) {
        // Send back the ID of the new quote
        res.json({ id: result.insertId });
    });
});

router.put("/api/comments/:id", function (req, res) {
    var condition = "id = " + req.params.id;

    console.log("condition", condition);

    comment.update(
        {
            comment: req.body.comment,
        },
        condition,
        function (result) {
            if (result.changedRows == 0) {
                // If no rows were changed, then the comment does not exist, so 404
                return res.status(404).end();
            } else {
                res.status(200).end();
            }
        }
    );
});
