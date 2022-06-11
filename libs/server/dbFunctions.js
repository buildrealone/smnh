
import { MongoClient } from 'mongodb';
import bcrypt from 'bcrypt';

export async function connectMongoClient() {
    const client = await new MongoClient(process.env.MONGODB_URI)?.connect();
    return client;
};

export async function createIndexes() {

    const client = await connectMongoClient();
    const db = client?.db("sample");

    // await Promise.all([
    //     db?.collection(collection)?.createIndexes([
    //         { userId: -1 }, { unique: true },
    //         { name: 1 }, { unique: false },
    //         { email: 1 }, { unique: true },
    //         { phone: 1 }, { unique: true },
    //         { createdAt: -1 }, { unique: false },
    //         { updatedAt: -1 }, { unique: false },
    //     ]),
    // ]);

    await db?.collection("users")?.createIndex(
            // { userId: 1 }, { unique: true },
            // { name: 1 }, { unique: false },
            { phone: 1 }, { unique: true },
            // { email: "text" }, { unique: true },
            // { createdAt: -1 }, { unique: false },
            // { updatedAt: -1 }, { unique: false },
        );

    // const collectionIndexes = await db?.collection(collection)?.getIndexes(); // { ok: true };
    client?.close();
    return { ok: true }; // collectionIndexes;
};

export async function findUser({ submittedUserAccountInfo }) { 

    const client = await connectMongoClient();
    const db = client?.db("sample");

    return db
        .collection("users")
        .findOne({ ...submittedUserAccountInfo }, { projection: { passwordHash: 0 } })
        .then((foundUser) => { 
            client?.close();
            return foundUser; // { ok: true, ...foundUser };
        })
        .catch(() => {
            client?.close();
            return { ok: false };
        })
};

export async function findUserWithPassword({ submittedUserAccountInfo }) { 

    const client = await connectMongoClient();
    const db = client?.db("sample");

    return db
        .collection("users")
        .findOne({ ...submittedUserAccountInfo })
        .then((foundUser) => { 
            client?.close();
            return foundUser; // { ok: true, ...foundUser };
        })
        .catch(() => {
            client?.close();
            return { ok: false };
        })
};

export async function authenticateUserPassword({ submittedUserAccountInfo, submittedPassword }) { 

    const client = await connectMongoClient();
    const db = client?.db("sample");

    return db
        .collection("users")
        .findOne({ ...submittedUserAccountInfo }, { projection: { passwordHash: 1 } })
        .then((foundUser) => { 
            client?.close();
            const isPasswordAuthenticated = bcrypt.compareSync(submittedPassword, foundUser?.passwordHash);
            if (!isPasswordAuthenticated) return false;
            return true;
        })
        .catch(() => {
            client?.close();
            return false;
        });
};

export async function updateUserEmailVerificationStatus({ verifyingUserAccountInfo }) {

    const foundUser = await findUser({ submittedUserAccountInfo: verifyingUserAccountInfo });
    if (!foundUser?.email) return false;
    
    const client = await connectMongoClient();
    const db = client?.db("sample");

    return db
        .collection("users")
        .findOneAndUpdate(
            { ...verifyingUserAccountInfo },
            { $set: { isEmailVerified: true } }, // , isLoggedIn: true
            { returnDocument: "after" }
        )
        .then(({ value }) => {
            client?.close();  
            // console.log("value: ", value); // value: { _id, email, password, userId, isVerified, name }
            return true;
        })
        .catch(() => {
            client?.close();
            return false;
        })
  };

  export async function updateUserPhoneVerificationStatus({ verifyingUserAccountInfo }) {

    const foundUser = await findUser({ submittedUserAccountInfo: verifyingUserAccountInfo });
    if (!foundUser?.phone) return false;
    
    const client = await connectMongoClient();
    const db = client?.db("sample");

    return db
        .collection("users")
        .findOneAndUpdate(
            { ...verifyingUserAccountInfo },
            { $set: { isPhoneVerified: true } }, // , isLoggedIn: true
            { returnDocument: "after" }
        )
        .then(({ value }) => {
            client?.close();  
            // console.log("value: ", value); // value: { _id, email, password, userId, isVerified, name }
            return true;
        })
        .catch(() => {
            client?.close();
            return false;
        })
  };

export async function connectOrCreateUser({ submittedUserAccountInfo }) { // , password 

    const newUserId = await updateUserIdCounter();
    if (!newUserId) return { ok: false };

    const foundUser = await findUser({ submittedUserAccountInfo }); // findUserWithPassword

    if (foundUser?.isEmailVerified) { // foundUser?.userId && foundUser?.email && foundUser?.role && foundUser?.fullName && foundUser?.nickname && foundUser?.passwordHash
        return { ok: true, isAlreadyRegistered: true, isNewAccountCreated: false, user: foundUser };
    }

    else if (!foundUser?.isEmailVerified) { // foundUser?.email && 
        const client = await connectMongoClient();
        const db = client?.db("sample");

        await db
        .collection("users")
        .deleteOne({ ...submittedUserAccountInfo });
        
        await db
        .collection("users")
        .insertOne({ ...submittedUserAccountInfo, userId: newUserId, isEmailVerified: false, isPhoneVerified: false, role: "user", nickname: `Anonymous${newUserId}` }); // , isLoggedIn: true,
    
        const newUser = await findUser({ submittedUserAccountInfo});
        if (!newUser) return { ok: false };

        return { ok: true, isAlreadyRegistered: false, isNewAccountCreated: true, user: newUser };
    };

    // else { 
    //     const client = await connectMongoClient();
    //     const db = client?.db("sample");

    //     await db
    //     .collection("users")
    //     .insertOne({ ...submittedUserAccountInfo, userId: newUserId, isEmailVerified: false, isPhoneVerified: false, role: "user", nickname: `Anonymous${newUserId}` }); // , isLoggedIn: true,
    
    //     const newUser = await findUser({ submittedUserAccountInfo});
    //     if (!newUser) return { ok: false };

    //     return { ok: true, isAlreadyRegistered: false, isNewAccountCreated: true, user: newUser };

    // };

};

export async function updateUserIdCounter() {
    
    const client = await connectMongoClient();
    const db = client?.db("sample");

    return db
        .collection("userIdCounter")
        .findOneAndUpdate(
            { _id: "userIdCounter" },
            { $inc: { seq: 1 } },
            { returnDocument: "after" }
        )
        .then(({ value }) => {
            client?.close();  
            return value?.seq;
        })
        .catch(() => {
            client?.close();
            return null;
        })
  };

  export async function updateUserPassword({ submittedUserAccountInfo, newPassword }) {
    
    const client = await connectMongoClient();
    const db = client?.db("sample");

    const newPasswordHash = bcrypt.hashSync(newPassword, 10);
    if (!newPasswordHash) return false;

    return db
        .collection("users")
        .findOneAndUpdate(
            { ...submittedUserAccountInfo },
            { $set: { passwordHash: newPasswordHash } },
            { returnDocument: "after" }
        )
        .then(({ value }) => {
            client?.close();  
            console.log("New password updated: ", value);
            return true;
        })
        .catch(() => {
            client?.close();
            return false;
        })
  };

  export async function updateUserFullName({ submittedUserAccountInfo, fullName }) {
    
    const client = await connectMongoClient();
    const db = client?.db("sample");

    return db
        .collection("users")
        .findOneAndUpdate(
            { ...submittedUserAccountInfo },
            { $set: { fullName } },
            { returnDocument: "after" }
        )
        .then(() => {
            client?.close();  
            return true;
        })
        .catch(() => {
            client?.close();
            return false;
        })
  };

  export async function updateUserNickname({ submittedUserAccountInfo, nickname }) {
    
    const client = await connectMongoClient();
    const db = client?.db("sample");

    return db
        .collection("users")
        .findOneAndUpdate(
            { ...submittedUserAccountInfo },
            { $set: { nickname } },
            { returnDocument: "after" }
        )
        .then(() => {
            client?.close();  
            return true;
        })
        .catch(() => {
            client?.close();
            return false;
        })
  };

  export async function updateUserPhone({ submittedUserAccountInfo, phone }) {
    
    const client = await connectMongoClient();
    const db = client?.db("sample");

    return db
        .collection("users")
        .findOneAndUpdate(
            { ...submittedUserAccountInfo },
            { $set: { phone } },
            { returnDocument: "after" }
        )
        .then(() => {
            client?.close();  
            return true;
        })
        .catch(() => {
            client?.close();
            return false;
        })
  };

//   export async function updateUserLoggedInStatus({ submittedUserAccountInfo }) {
    
//     const client = await connectMongoClient();
//     const db = client?.db("sample");

//     return db
//         .collection("users")
//         .findOneAndUpdate(
//             { ...submittedUserAccountInfo },
//             { $set: { isLoggedIn: true } },
//             { returnDocument: "after" }
//         )
//         .then(() => {
//             client?.close();  
//             return true;
//         })
//         .catch(() => {
//             client?.close();
//             return false;
//         })
//   };

//   export async function logout({ submittedUserAccountInfo }) {
    
//     const client = await connectMongoClient();
//     const db = client?.db("sample");

//     const foundUser = await findUser({ submittedUserAccountInfo });
//     if (!foundUser) return false;

//     return db
//         .collection("users")
//         .findOneAndUpdate(
//             { ...submittedUserAccountInfo },
//             { $set: { isLoggedIn: false } },
//             { returnDocument: "after" }
//         )
//         .then(({ value }) => {
//             client?.close();  
//             return true;
//         })
//         .catch(() => {
//             client?.close();
//             return false;
//         })
//   };

//   export async function createUser({ submittedUserAccountInfo }) {

//     // const password = await bcrypt.hash(originalPassword, 10);
//     const client = await connectMongoClient();
//     const db = client?.db("sample");

//     const newUserId = await updateUserIdCounter();

//     // const foundUser = await findUser({ submittedUserAccountInfo});
//     // if (foundUser) return { ok: false };

//     await db // await
//         .collection("users")
//         .insertOne({ ...submittedUserAccountInfo, userId: newUserId, isVerified: false, name: "Anonymous" })
    
//     const newUser = await findUser({ submittedUserAccountInfo});
//     return newUser;

// };

//   export async function upsertUser({ submittedUserAccountInfo, newPassword }) {

//     // const password = await bcrypt.hash(originalPassword, 10);
//     const client = await connectMongoClient();
//     const db = client?.db("sample");

//     // const newUserId = await updateUserIdCounter();

//     await db
//         .collection("users")
//         .findOneAndUpdate(
//             { ...submittedUserAccountInfo },
//             // { $setOnInsert: { ...submittedUserAccountInfo, userId: newUserId, isVerified: false, name: "Anonymous" } },
//             { $setOnInsert: { password: newPassword } },
//             { returnDocument: "after", upsert: true, }
//         );

//     const foundUser = await findUser({ submittedUserAccountInfo});
    
//     return foundUser;

// };

  // export async function findUserVerificationCode({ submittedUserAccountInfo }) { 

//     const client = await connectMongoClient();
//     const db = client?.db("sample");

//     return db
//         .collection("users")
//         .findOne({ ...submittedUserAccountInfo }, { projection: { findUserVerificationCode: 1 } })
//         .then((foundUserVerificationCode) => { 
//             client?.close();
//             // return { ok: true, ...foundUser } || { ok: false };
//             return foundUserVerificationCode; // { ok: true, ...foundUser };
//         })
//         .catch(() => {
//             client?.close();
//             return { ok: false };
//         })
// };