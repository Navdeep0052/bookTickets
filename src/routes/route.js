const express = require("express")
const router = express.Router()
const seatController = require("../controllers/seatController")

router.post("/create",seatController.createSeat)
router.post("/book",seatController.bookSeats)
router.get("/available",seatController.getAvailableSeats)
router.delete("/delete",seatController.deleteSeats)




module.exports = router