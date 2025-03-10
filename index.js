const express = require("express");
const debug = require("debug");
const mongoose = require("mongoose");
const User = require("./models/user.models.js");
const dotenv = require("dotenv");
const Booking = require("./models/booking.models.js");
const Showtime = require("./models/showTime.models.js");
const Movie = require("./models/movies.models.js");
const Theater = require("./models/theater.models.js");


dotenv.config({
  path : './.env'
})

const app = express();
app.use(express.urlencoded({extended:true}));
app.use(express.json());

const dbgr = debug("development:mongoose");


// console.log(process.env.MONGODB_URI, process.env.DB_NAME);
mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`);


app.get("/", async (req,res) => {
  dbgr("connected");
  // const allUser = await User.find();
  res.send("hello world");
  
})


//sign up
app.post("/signup", async (req,res) => {
  let {name, email, password,role} = req.body;
  const userExist = await User.findOne({email});
  if(userExist){
    res.send("User with this email already exist");
  }
  else{
    bcrypt.genSalt(10,(err,salt)=>{
      bcrypt.hash("password", salt, async(err,hash) => {
        await User.create({name, email, password : hash,role});
        let token = jwt.sign({email}, "secretCode");
        res.cookie("token", token);
        res.redirect(":user/movies");
      })
    })
  }
})


// login
app.post("/login", async (req,res) => {
  let {email, password} = req.body;
  const userExist = await User.findOne({email});
  if(!userExist){
    res.send("Something went wrong");
  }
  else{
    bcrypt.compare(password,userExist.password, (err,result) => {
      if(!result){
        res.send("Something went wrong");
      }
      else{
        let token = jwt.sign({email}, "secretCode");
        res.cookie("token", token);
        res.redirect(":user/movies");
      }
    });
  }
})



// Get all movies
app.get(":user/movies", async (req, res) => {

  const movies = await Movie.find().populate("showtimes");
  // res.json(movies)
  res.redirect('/showtime')
})

app.get(":admin/movies", async (req, res) => {
  const movies = await Movie.find();
  res.json(movies)
})


// Add new movie
app.post(":admin/addMovie",async (req, res) => {
  const { name, genre, duration,poster } = req.body;
  const movie = new Movie({ name, genre, duration, poster });
  await movie.save();
  res.status(201).json({ message: "Movie added successfully" })
})


//get a theater
app.get(":admin/get/theater", async (req, res) => {
  const theaters = await Theater.find();
  res.json(theaters);
})

//add a theater
app.post(":admin/addTheater",async (req, res) => {
  const { name, location, capacity } = req.body;
  const theater = new Theater({ name, location, capacity });
  await theater.save();
  res.status(201).json({ message: "Theater added successfully" })
})



// Get all showtimes
app.get("/showtime",async (req, res) => {
  const showtimes = await Showtime.find().populate("movie theatre");
  res.json(showtimes);
})

// Add new showtime
app.post("admin/post/showtime",async (req, res) => {
  const { movie, theatre, startTime, price } = req.body;
  const showtime = new Showtime({ movie, theatre, startTime, seatsAvailable: 50, price });

  await showtime.save();
  const oneMovie = await Movie.findOne({movie});
  oneMovie.showtimes.push(oneMovie._id);
  oneMovie.save();
  res.status(201).json({ message: "Showtime added successfully" });
})



// Book Tickets
app.post("/userID/bookticket",async (req, res) => {
  const { user, showtime, seats } = req.body;

  const show = await Showtime.findById(showtime);
  if (!show || show.seatsAvailable < seats.length) return res.status(400).json({ message: "Not enough seats" });

  show.seatsAvailable -= seats.length;
  await show.save();

  const booking = new Booking({ user, showtime, seats, totalPrice: seats.length * show.price });
  await booking.save();

  res.status(201).json({ message: "Booking successful", booking });
})





app.listen(3000, (err) => {dbgr("port is running")});