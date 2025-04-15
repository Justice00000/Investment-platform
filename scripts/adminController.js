  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
  import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
  import emailjs from "https://cdn.jsdelivr.net/npm/emailjs-com@3.2.0/+esm";

  const firebaseConfig = {
    apiKey: "AIzaSyCWuFq3ZYhLdjVrKKa7RH2_T_f1Ct4rtIY",
    authDomain: "invest-6c18d.firebaseapp.com",
    projectId: "invest-6c18d",
    storageBucket: "invest-6c18d.appspot.com",
    messagingSenderId: "401038787144",
    appId: "1:401038787144:web:949e93e8ff282fdd294e7d",
    measurementId: "G-GL5QZ99F5F"
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const userId = "userId"; // Replace this with dynamic user ID

  const calculateButton = document.getElementById("calculate-returns");
  const investmentInput = document.getElementById("investment-amount");
  const planSelect = document.getElementById("investment-plan");
  const weeklyROI = document.getElementById("weekly-roi");
  const monthlyROI = document.getElementById("monthly-roi");
  const yearlyROI = document.getElementById("yearly-roi");

  function calculateReturns() {
    const amount = parseFloat(investmentInput.value);
    const rate = 0.2;
    if (!amount || amount < 1000 || amount > 7500) {
      alert("Please enter an amount between $1,000 and $7,500.");
      return;
    }
    const weekly = amount * rate;
    const monthly = weekly * 4;
    const yearly = weekly * 52;

    weeklyROI.textContent = `$${weekly.toFixed(2)}`;
    monthlyROI.textContent = `$${monthly.toFixed(2)}`;
    yearlyROI.textContent = `$${yearly.toFixed(2)}`;
  }

  calculateButton.addEventListener("click", calculateReturns);

  async function handleInvestment(plan) {
    const plans = {
      gold: { min: 1000, max: 2500 },
      diamond: { min: 2500, max: 4000 },
      vip: { min: 4000, max: 7500 }
    };
    const amount = parseFloat(investmentInput.value);
    const selected = plans[plan];

    if (!amount || amount < selected.min || amount > selected.max) {
      alert(`Amount must be between $${selected.min} and $${selected.max} for the ${plan.toUpperCase()} plan.`);
      return;
    }

    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      alert("User not found.");
      return;
    }

    const user = userSnap.data();
    const balance = accountBalance || 0;

    if (balance < amount) {
      alert("Insufficient balance to invest in this plan.");
      return;
    }

    const newBalance = balance - amount;

    await updateDoc(userRef, {
      balance: newBalance,
      plan: plan,
      investment: amount
    });

    // Optional EmailJS integration
    emailjs.send("service_id", "template_id", {
      user_email: user.email,
      plan_name: plan,
      amount: amount
    }, "public_key");

    alert(`Successfully invested $${amount} in the ${plan.toUpperCase()} plan! New balance: $${newBalance.toFixed(2)}`);
  }

  document.querySelectorAll("button").forEach((btn) => {
    if (btn.textContent.includes("Gold Plan")) {
      btn.addEventListener("click", () => handleInvestment("gold"));
    }
    if (btn.textContent.includes("Diamond Plan")) {
      btn.addEventListener("click", () => handleInvestment("diamond"));
    }
    if (btn.textContent.includes("VIP Plan")) {
      btn.addEventListener("click", () => handleInvestment("vip"));
    }
  });