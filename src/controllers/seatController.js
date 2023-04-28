const Seat = require("../models/createSeat");

const createSeat = async function (req, res) {
  try {

     // check if there are already 80 seats in the database
     const existingSeats = await Seat.countDocuments()
     if (existingSeats >= 80) {
       return res.status(403).send("Completed Coach already created")
     }

    const seats = []

    // create the seats
    let seatNumber = 1;
    for (let rowNumber = 1; rowNumber <= 12; rowNumber++) {
      const seatsInRow = rowNumber === 12 ? 3 : 7 // last row has 3 seats
      for (let i = 1; i <= seatsInRow; i++) {
        const isAvailable = true // all seats are available initially

        const seat = new Seat({ seatNumber, rowNumber, isAvailable });
        seats.push(seat)
        seatNumber++
      }
    }

    // save the seats to the database
    const savedSeats = await Seat.insertMany(seats)

    return res.status(201).json(savedSeats)
  } catch (err) {
    //console.error(err);
    res.status(500).send("Server error")
  }
}


const bookSeats = async function (req, res) {
  try {
    const { numSeats } = req.body

    // check if numSeats is a valid number between 1 and 7
    if (typeof numSeats !== "number" || numSeats < 1 || numSeats > 7) {
      return res.status(400).json({ error: "Invalid number of seats" })
    }

    // find available seats
    const availableSeats = await Seat.find({ isAvailable: true }).sort({
      rowNumber: 1,
      seatNumber: 1,
    })

    let bookedSeats = []

    // check if enough seats are available
    if (availableSeats.length < numSeats) {
      return res.status(400).json({ error: "Not enough seats available" });
    }

    // check if all seats are in the same row
    const rowNumbers = availableSeats.map((seat) => seat.rowNumber)
    const isSameRow = rowNumbers.every((rowNumber, index, array) => {
      return index === 0 || rowNumber === array[index - 1]
    })

    // book seats in the same row
    if (isSameRow) {
      bookedSeats = availableSeats.slice(0, numSeats)
    } else {
      // find available seats in nearby rows
      let i = 0;
      while (bookedSeats.length < numSeats && i < availableSeats.length) {
        const seat = availableSeats[i]
        const nearbySeats = await Seat.find({
          rowNumber: seat.rowNumber,
          seatNumber: {
            $gte: seat.seatNumber,
            $lte: seat.seatNumber + numSeats - 1,
          },
          isAvailable: true,
        })
        if (nearbySeats.length >= numSeats) {
          bookedSeats = nearbySeats.slice(0, numSeats)
        }
        i++;
      }
    }

    // mark seats as booked
    await Promise.all(
      bookedSeats.map(async (seat) => {
        seat.isAvailable = false
        seat.isBooked = true
        await seat.save()
      })
    )

    res.json({ seats: bookedSeats })
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error")
  }
}


const getAvailableSeats = async function (req, res) {
  try {
    // find all available seats
    const availableSeats = await Seat.find({ isAvailable: true }).sort({
      rowNumber: 1,
      seatNumber: 1,
    })

    // return the list of available seats
    res.json({ seats: availableSeats })
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error")
  }
}

const deleteSeats = async function(req,res){
    try{
       //check if seats already deleted
       const existingSeats = await Seat.countDocuments()
       if(existingSeats===0){
        return res.status(403).send({status:false,msg:"seats alrady deleted"})
       }
        
      await Seat.deleteMany({})
      return res.status(200).send({status:true,msg:"all seats deleted successfully"})
    }
    catch(err){
        return res.status(500).send({status:false,msg:"server error"})
    }
}

module.exports = { createSeat, bookSeats, getAvailableSeats,deleteSeats }
