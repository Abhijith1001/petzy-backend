const express = require('express');
const router = express.Router();
const { User } = require('../../models/user');
const  HireSitter  = require('../../models/sitterHire');
const RequestSitter = require('../../models/sitterRequest')


router.get('/userList/:petsitterId', async (req, res) => {
    const petsitterId = req.params.petsitterId;

    try {
        // Get the list of users who have a status other than 'hired' and 'pending' for the specified petsitter
        const userlist = await User.find({
            _id: { $nin: await getHiredUsersIds(petsitterId) },
            // Add a condition to exclude users with 'hired' and 'pending' status
            status: { $nin: ['hired', 'pending'] }
        });

        res.status(200).json(userlist);
    } catch (error) {
        res.status(400).json({ message: 'Cannot fetch user details' });
    }
});

// Helper function to get the list of hired and pending users' IDs for a specific petsitter
const getHiredUsersIds = async (petsitterId) => {
    try {
        const hiredUsers = await HireSitter.find({
            petsitterId,
            status: { $in: ['hired', 'pending'] } // Include users with 'hired' and 'pending' status
        });

        return hiredUsers.map(user => user.userId);
    } catch (error) {
        console.error('Error fetching hired users:', error);
        return [];
    }
};


// router.get('/userReq', async (req, res) => {
//     const petsitterId = req.params.petsitterId;

//     try {
//         // Get the list of users who have a status other than 'hired' and 'pending' for the specified petsitter
//         const reqUsers = await RequestSitter.find({
//             petsitterId,
//             status: { $in:  } // Include users with 'hired' and 'pending' status
//         });

//         res.status(200).json(reqUsers);
//     } catch (error) {
//         res.status(400).json({ message: 'Cannot fetch user details' });
//     }
// });

module.exports = router;
