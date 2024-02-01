require("dotenv").config();
const express = require("express");
const session = require('express-session');
const app = express();
const bodyparser = require('body-parser')
const cors = require("cors");
const connection = require("./db");
const userRoutes = require("./routes/User/users");
const authRoutes = require("./routes/User/auth");
const passwordResetRoutes = require("./routes/User/passwordReset")
const shelterUser = require("./routes/Shelter/users")
const shelterAuth = require("./routes/Shelter/auth")
const addPet = require("./routes/Shelter/addpet")
const getPet = require("./routes/Shelter/getpet")
const getPets = require("./routes/Shelter/getbyshelterid")
const updatePet = require("./routes/Shelter/updatepet")
const deletePet = require("./routes/Shelter/deletepet")
const getbyid = require("./routes/Shelter/getbyid")
const guestRoutes = require('./routes/User/guest');
const passwordReset = require("./routes/Shelter/passReset")
const adoptionRequest = require("./routes/User/adoptionrequest")
const adoptionHistory = require("./routes/User/adoptionhistory")
const shelter = require("./routes/Shelter/shelter")
const user = require("./routes/User/user")
const adoptionDelete = require("./routes/User/adoptionrequest")
const shelt = require("./routes/User/adoptionrequest")
const request = require("./routes/Shelter/adoptionhistory")
const rejectAdoption = require("./routes/Shelter/adoptionhistory")
//const shel = require("./routes/Shelter/adoptionhistory")
const approve = require("./routes/Shelter/addoptionstatus")
const get =require("./routes/Shelter/get")
const geet =require("./routes/User/get")
const detailedpet = require("./routes/User/guest")
const topicsRouter = require('./routes/User/community');
const wishlist = require("./routes/User/wishlist")
const cart = require("./routes/User/cart")
const details = require("./routes/Shelter/details")
const getdetails = require("./routes/User/details")
const shelde = require("./routes/User/sheldet")
const paymentRouter= require('./routes/User/payment');
const review = require("./routes/User/review")
const Description = require("./routes/Shelter/Description")
const order = require('./routes/User/order')
const reject= require('./routes/Shelter/addoptionstatus')
const statuss = require('./routes/Shelter/ar')
const profileRoutes = require('./routes/User/profile');
const admin = require('./routes/Admin/users')
const admi = require('./routes/Admin/shelter')
const adm = require('./routes/Admin/product')
const path = require("path");
const wishpro = require('./routes/User/wishlistPro')
const userprofile = require('./routes/Shelter/userprofile')
const appr = require('./routes/User/approved')
const recoRouter = require('./routes/User/recommendation');
const revenue = require('./routes/Admin/order')
const donation = require('./routes/User/donation')
const rolesignup = require('./routes/Petsitter/user')
const rolelogin = require('./routes/Petsitter/auth')
const doctorsignup = require('./routes/Admin/doctor')
const doctorlogin = require('./routes/Doctor/auth')
const petsitter = require('./routes/Petsitter/petsitter')
const doctor = require('./routes/Doctor/doctor')
const petsitterList = require('./routes/Petsitter/findpetsitterss')
const PetsitterSearch = require('./routes/Petsitter/search')
const UserList = require('./routes/Petsitter/userlist')
const Petsitterprofile = require('./routes/Petsitter/profile')
const HireSitter = require('./routes/User/petsitter')
const SitterWork = require('./routes/Petsitter/work')

connection();
app.use(
    session({
        secret: 'your-secret-key',
        resave: false,
        saveUninitialized: true,
        cookie: {
            secure: false,
            maxAge: 30 * 24 * 60 * 60 * 1000
        }
    })
);

app.use(express.json());
app.use(bodyparser.urlencoded({extended:true}))
app.use(cors({
    origin: 'http://localhost:3000', 
    credentials: true
}));
app.use(express.static('public'))

app.use('/images', express.static(path.join(__dirname, 'public/product')));



app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/password-reset", passwordResetRoutes);


app.use("/api/shelterUser", shelterUser)
app.use("/api/shelterauth", shelterAuth)
app.use("/api/addpet",addPet)
app.use("/api/getpet",getPet)
app.use("/api/getpets",getPets)
app.use("/api/:petId",updatePet)
app.use('/api/deletepet', deletePet); 
app.use('/api/getbyid',getbyid)
app.use("/api/passwordreset", passwordReset);
app.use("/api/adoptionrequest", adoptionRequest);
app.use("/api/adoptionhistory", adoptionHistory);
app.use("/api/shelters",shelter)
app.use("/api/user",user)

app.use("/api/adoptiondelete",adoptionDelete)
app.use("/api/rejectapplication",rejectAdoption)

app.use("/api/adoptionapplications",request)
//app.use("/api",shel)
app.use("/api/shelters",shelt)
app.use("/api/approveapplication",approve)
app.use("/api/shelter",get)
app.use("/api/userss",geet)
app.use("/api/guest/pets",detailedpet)
app.use("/api/reject",reject)


app.use('/api/topics', topicsRouter);
app.use("/api/wishlist",wishlist)
app.use("/api/cart",cart)


app.use('/api', details);
app.use("/api/petDetails",getdetails)
app.use("/api",shelde)

app.use('/api', guestRoutes);
app.use('/api/order',order)

app.use('/api/reviews', review)
app.use("/api/save",Description)
app.use('/api/payment', paymentRouter);
app.use('/api/ado',statuss)
app.use('/api/pro', profileRoutes);
app.use('/api/admi',admin)
app.use('/api/adm',admi)
app.use('/api/admin',adm)
app.use('/api/user/w',wishpro)
app.use('/api/pro',userprofile)
app.use('/api/adoptionappr',appr)
const adoptionsusRoute = require('./routes/User/adop'); // Replace with the actual path to your route file
app.use('/api', adoptionsusRoute); // You can customize the route path as needed
app.use('/api/prod', recoRouter);
app.use('/api/amount',revenue)
app.use('/api/donation',donation)


app.use('/api/role/s',rolesignup)
app.use('/api/role',rolelogin)
app.use('/api/petsitter',petsitter)
app.use('/api/sitterlist',petsitterList)
app.use('/api/search',PetsitterSearch)
app.use('/api/listuser',UserList)
app.use('/api/petsitterprofile',Petsitterprofile)
app.use('/api/hire',HireSitter)
app.use('/api/work',SitterWork)

app.use('/api/doctorcreate',doctorsignup)
app.use('/api/doclogin/d',doctorlogin)
app.use('/api/doctor',doctor)




app.get("/api/getkey",(req,res)=>res.status(200).json({key: process.env.RAZORPAY_API_KEY}))
const port = process.env.PORT || 8080;
app.listen(port, console.log(`Listening on port ${port}...`));
