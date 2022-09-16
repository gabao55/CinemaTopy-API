import mongo from "../db/db.js";

async function validToken(req, res, next){
    const token = req.headers.authorization?.replace('Bearer ', '');

    try {
        let db = await mongo();

        const session = await db.collection('sessions').findOne({ token });
        if (!session) {
            console.log('session');
        return res.status(401).send();
        }

        const user = await db.collection('users').findOne({ _id: session.userId });
        if (!user) {
            console.log('user');
            return res.sendStatus(401);
        }

        delete user.password;

        res.locals.session = session;
        res.locals.user = user;
        next();
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

export default validToken;