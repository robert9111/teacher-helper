const db = require("../db");
const upload = require("../services/pictureUpload");

const getProfile = async (req, res) => {
    try {
        const queryResult = await db.query(
            // eslint-disable-next-line
            `SELECT * FROM profiles WHERE user_id = $1`,
            [req.user.id]);


        return res.status(200).json({
            status: "Success",
            data: queryResult.rows[0]
        });
    } catch (err) {
        console.error(err);
        return res.status(400).json({
            status: "Failure",
            msg: "Request Denied",
            error: err.message
        });
    }

};

const uploadPicture = async (req, res) => {
    const location = await new Promise((resolve, reject) => {
        upload(req, res, (err) => {
            if (err) {
                reject(res.json({ msg: "Error uploading picture", err }));
            } else {
                let location;
                // eslint-disable-next-line
                resolve(location = req.file.location);
            }
        });
    });
    const query = await new Promise((resolve, reject) => {
        resolve(db.query(
            `UPDATE profiles SET profile_image = $1 
            WHERE user_id = $2`,
            [location, req.user.id]));
    });

    return res.status(200).json({
        msg: "Got it",
        query
    });
};

const postProfile = async (req, res) => {
    const {
        profile_name,
        profile_email,
        profile_school,
        profile_grade,
        profile_about,
    } = req.body;
    const user_id = req.user.id;

    try {
        const queryResult =
            await db.query(`INSERT INTO profiles(profile_name, profile_email, 
            profile_school, profile_grade, profile_about, user_id) 
            VALUES($1,$2,$3,$4,$5,$6) returning *`,
                [profile_name, profile_email, profile_school, profile_grade,
                    profile_about, user_id]);


        return res.status(200).json(
            {
                status: "Success",
                msg: "Posted data",
                data: queryResult.rows[0]
            });

    } catch (err) {
        console.log(err);
        return res.status(400).json({ msg: "Bad request", error: err.message });
    }

};

const updateProfile = async (req, res) => {
    return res.status(200).json({ msg: "Updated Data" });
};

const deleteFromProfile = async (req, res) => {
    return res.status(200).json({ msg: "Deleted X data" });
};

module.exports = {
    getProfile,
    postProfile,
    updateProfile,
    deleteFromProfile,
    uploadPicture
};