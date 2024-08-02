import { hash } from "bcrypt";
import { firestore } from "@/firebase";
import { addDoc, collection, getDocs, query, updateDoc, where } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { email, password, name } = await request.json();
        console.log({ email, password, name});
        const userCollection = collection(firestore, 'Users');

        // check if user already exists
        const userQuery = query(userCollection, where('email', '==', email));
        const querySnapshot = await getDocs(userQuery);
        console.log('querySnapshot:', querySnapshot);


        if (!querySnapshot.empty) {
            return new Response(JSON.stringify({ error: "User already exists" }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const hashedPassword = await hash(password, 10);

        const newUser = {
            name,
            email,
            password: hashedPassword,
            createdAt: new Date(),
        }

        const newUserDocRef = await addDoc(userCollection, newUser);

        await updateDoc(newUserDocRef, {
            id: newUserDocRef.id
        })

        console.log('User created with ID', newUserDocRef.id)
    } catch (error) {
        console.error('Error creating new user:', error);
    }

    return NextResponse.json({ message: 'success'});
}
