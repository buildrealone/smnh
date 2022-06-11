import { MongoClient } from 'mongodb';

const MONGODB_URI = "mongodb+srv://mitestyle:qwer8986@cluster0.czsto.mongodb.net/?retryWrites=true&w=majority";

export default function CreateUser({ name, email, phone }) {

    MongoClient.connect(MONGODB_URI, { useUnifiedTopology: true }, function (err, client) {
        
        // if (err) return res.json({ ok: false });
        if (err) return { ok: false };

        const database = client.db("sample");
        const userIdCounter = database.collection("userIdCounter");
        const users = database.collection("users");

        // (1). userIdCounter seq: 0 초기에 생성하기!
        // db.collection("userIdCounter").insertOne({ _id: "userIdCounter", seq: 0 }, ()=>{
        //     res.json({ _id: "userIdCounter", seq: 0 });
        // });
        
        userIdCounter.updateOne(
            { _id: "userIdCounter"  },
            {
              $inc: { seq: 1 },
            });
        
        userIdCounter.find({ _id: "userIdCounter" }).toArray(function (err1, res1) {

            // if (err1) return res.json({ ok: false });
            if (err1) return { ok: false };

            const data = {
                userId: res1?.[0]?.seq,
                name, // : "Anonymous",
                email, // : "email@naver.com",
                phone, // : "01012546345",
            };
    
            users.insertOne(data, (err3, res3) => { 
                client.close();
                // if (err3) return res.json({ ok: false });
                // return res.status(200).json({ ok: true, ...data });
                if (err3) return { ok: false };
                return { ok: true, ...data };
            });
        });
    });
};