/**
 * ============================================================
 * KAJU MEHNDI ARTIST - Admin Manager Script
 * ============================================================
 *
 * Usage:
 *
 *   1. NEW Admin Create karna:
 *      node manageAdmin.js create --name="Kaju Ma'am" --email="newadmin@kajumehndi.com" --password="StrongPass@123" --phone="+919244836867"
 *
 *   2. Admin ka EMAIL ya PASSWORD change karna:
 *      node manageAdmin.js update --email="admin@kajumehndi.com" --newEmail="kaju@kajumehndi.com" --newPassword="NewPass@456"
 *
 *   3. Kisi existing Customer/Student ko ADMIN banana:
 *      node manageAdmin.js promote --email="user@example.com"
 *
 *   4. Kisi Admin ko normal CUSTOMER banana (demote):
 *      node manageAdmin.js demote --email="admin@example.com"
 *
 *   5. Saare Admins ki list dekhna:
 *      node manageAdmin.js list
 *
 * ============================================================
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/kaju_mehndi";

// Parse command-line arguments
const args = process.argv.slice(2);
const command = args[0]; // create, update, promote, demote, list

const getArg = (name) => {
    const found = args.find((a) => a.startsWith(`--${name}=`));
    return found ? found.split("=").slice(1).join("=") : null;
};

const printLine = () => console.log("=".repeat(55));

async function main() {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB Database: kaju_mehndi");
    printLine();

    switch (command) {
        // ---- 1. NEW ADMIN CREATE ----
        case "create": {
            const name = getArg("name") || "Kaju Admin";
            const email = getArg("email");
            const password = getArg("password");
            const phone = getArg("phone") || "";

            if (!email || !password) {
                console.error("❌ ERROR: --email aur --password dono zaroori hain!");
                console.log("Example: node manageAdmin.js create --email=newadmin@kajumehndi.com --password=StrongPass@123");
                break;
            }

            if (password.length < 6) {
                console.error("❌ ERROR: Password kam se kam 6 characters ka hona chahiye!");
                break;
            }

            const existing = await User.findOne({ email: email.toLowerCase().trim() });
            if (existing) {
                // If exists but not admin, promote
                if (existing.role !== "admin") {
                    existing.role = "admin";
                    existing.isActive = true;
                    await existing.save();
                    console.log("✅ User ko Admin Role de diya gaya!");
                    console.log(`   Name:  ${existing.name}`);
                    console.log(`   Email: ${existing.email}`);
                    console.log(`   Role:  ${existing.role}`);
                } else {
                    console.log(`⚠️ Yeh email already Admin role ke saath exist karta hai: ${email}`);
                }
                break;
            }

            const newAdmin = await User.create({
                name: name.trim(),
                email: email.toLowerCase().trim(),
                password,
                phone: phone.trim(),
                role: "admin",
                isActive: true,
            });

            printLine();
            console.log("✅ NAAYA ADMIN SUCCESSFULLY BANA DIYA GAYA!");
            printLine();
            console.log(`   👤 Name:     ${newAdmin.name}`);
            console.log(`   📧 Email:    ${newAdmin.email}`);
            console.log(`   🔑 Password: ${password}`);
            console.log(`   📱 Phone:    ${phone || "—"}`);
            console.log(`   🛡️ Role:     admin`);
            printLine();
            console.log("Admin Login Portal: http://localhost:5173/admin-login");
            break;
        }

        // ---- 2. EMAIL / PASSWORD UPDATE ----
        case "update": {
            const email = getArg("email");
            const newEmail = getArg("newEmail");
            const newPassword = getArg("newPassword");

            if (!email) {
                console.error("❌ ERROR: --email (current admin email) dena zaroori hai!");
                console.log("Example: node manageAdmin.js update --email=admin@kajumehndi.com --newPassword=NewPass@456");
                break;
            }

            if (!newEmail && !newPassword) {
                console.error("❌ ERROR: --newEmail ya --newPassword mein se ek toh dena chahiye!");
                break;
            }

            const admin = await User.findOne({ email: email.toLowerCase().trim() }).select("+password");
            if (!admin) {
                console.error(`❌ ERROR: Yeh email database mein nahi mila: ${email}`);
                break;
            }

            if (newEmail) {
                const duplicateCheck = await User.findOne({ email: newEmail.toLowerCase().trim() });
                if (duplicateCheck && duplicateCheck._id.toString() !== admin._id.toString()) {
                    console.error(`❌ ERROR: Yeh email pehle se kisi aur account mein use ho raha hai: ${newEmail}`);
                    break;
                }
                admin.email = newEmail.toLowerCase().trim();
                console.log(`📧 Email update kiya: ${email} → ${newEmail}`);
            }

            if (newPassword) {
                if (newPassword.length < 6) {
                    console.error("❌ ERROR: Naya password kam se kam 6 characters ka hona chahiye!");
                    break;
                }
                admin.password = newPassword;
                admin.markModified("password"); // triggers pre-save hash
                console.log(`🔑 Password update kiya (hash hoke database mein save hoga)`);
            }

            await admin.save();

            printLine();
            console.log("✅ ADMIN DETAILS SUCCESSFULLY UPDATE HO GAYI!");
            printLine();
            console.log(`   👤 Name:     ${admin.name}`);
            console.log(`   📧 Email:    ${admin.email}`);
            if (newPassword) console.log(`   🔑 Password: ${newPassword}`);
            console.log(`   🛡️ Role:     ${admin.role}`);
            printLine();
            break;
        }

        // ---- 3. PROMOTE TO ADMIN ----
        case "promote": {
            const email = getArg("email");
            if (!email) {
                console.error("❌ ERROR: --email dena zaroori hai!");
                console.log("Example: node manageAdmin.js promote --email=user@example.com");
                break;
            }

            const user = await User.findOne({ email: email.toLowerCase().trim() });
            if (!user) {
                console.error(`❌ ERROR: Yeh email database mein nahi mila: ${email}`);
                break;
            }

            const oldRole = user.role;
            user.role = "admin";
            user.isActive = true;
            await user.save();

            printLine();
            console.log("✅ USER KO ADMIN BANA DIYA GAYA!");
            printLine();
            console.log(`   👤 Name:     ${user.name}`);
            console.log(`   📧 Email:    ${user.email}`);
            console.log(`   🔄 Role:     ${oldRole} → admin`);
            printLine();
            console.log("Yeh user ab /admin-login se Admin Dashboard access kar sakta hai.");
            break;
        }

        // ---- 4. DEMOTE FROM ADMIN ----
        case "demote": {
            const email = getArg("email");
            if (!email) {
                console.error("❌ ERROR: --email dena zaroori hai!");
                console.log("Example: node manageAdmin.js demote --email=admin@example.com");
                break;
            }

            const user = await User.findOne({ email: email.toLowerCase().trim() });
            if (!user) {
                console.error(`❌ ERROR: Yeh email database mein nahi mila: ${email}`);
                break;
            }

            if (user.role !== "admin") {
                console.log(`⚠️ Yeh user pehle se admin nahi hai (current role: ${user.role})`);
                break;
            }

            user.role = "customer";
            await user.save();

            printLine();
            console.log("✅ ADMIN KO CUSTOMER BANA DIYA GAYA!");
            printLine();
            console.log(`   👤 Name:     ${user.name}`);
            console.log(`   📧 Email:    ${user.email}`);
            console.log(`   🔄 Role:     admin → customer`);
            printLine();
            break;
        }

        // ---- 5. LIST ALL ADMINS ----
        case "list": {
            const admins = await User.find({ role: "admin" }, "name email phone isActive createdAt");
            if (admins.length === 0) {
                console.log("⚠️ Database mein koi Admin user nahi mila.");
            } else {
                printLine();
                console.log(`TOTAL ADMINS: ${admins.length}`);
                printLine();
                admins.forEach((a, i) => {
                    console.log(`${i + 1}. ${a.name}`);
                    console.log(`   Email:  ${a.email}`);
                    console.log(`   Phone:  ${a.phone || "—"}`);
                    console.log(`   Active: ${a.isActive ? "Yes ✅" : "No ❌"}`);
                    console.log(`   Created: ${new Date(a.createdAt).toLocaleDateString("en-IN")}`);
                    if (i < admins.length - 1) console.log("   ---");
                });
                printLine();
            }
            break;
        }

        default: {
            printLine();
            console.log("KAJU MEHNDI - Admin Manager Commands:");
            printLine();
            console.log("1. Naaya Admin banana:");
            console.log('   node manageAdmin.js create --name="Kaju Ma\'am" --email=admin@kajumehndi.com --password=StrongPass@123');
            console.log("");
            console.log("2. Email ya Password change karna:");
            console.log("   node manageAdmin.js update --email=admin@kajumehndi.com --newPassword=NewPass@456");
            console.log("   node manageAdmin.js update --email=admin@kajumehndi.com --newEmail=newadmin@kajumehndi.com");
            console.log("");
            console.log("3. Kisi user ko Admin banana:");
            console.log("   node manageAdmin.js promote --email=user@example.com");
            console.log("");
            console.log("4. Admin ko normal User banana:");
            console.log("   node manageAdmin.js demote --email=admin@example.com");
            console.log("");
            console.log("5. Saare Admins ki list:");
            console.log("   node manageAdmin.js list");
            printLine();
        }
    }

    await mongoose.disconnect();
    process.exit(0);
}

main().catch((err) => {
    console.error("Error:", err.message);
    process.exit(1);
});
