document.addEventListener('DOMContentLoaded', () => {
    const investmentAmount = document.getElementById('investment-amount');
    const investmentPlan = document.getElementById('investment-plan');
    const calculateButton = document.getElementById('calculate-returns');
    const weeklyRoiElement = document.getElementById('weekly-roi');
    const monthlyRoiElement = document.getElementById('monthly-roi');
    const yearlyRoiElement = document.getElementById('yearly-roi');

    // Investment plan details
    const investmentPlans = {
        gold: {
            minInvestment: 1000,
            maxInvestment: 2500,
            weeklyRoi: 0.20 // 20%
        },
        diamond: {
            minInvestment: 2500,
            maxInvestment: 4000,
            weeklyRoi: 0.20 // 20%
        },
        vip: {
            minInvestment: 4000,
            maxInvestment: 7500,
            weeklyRoi: 0.20 // 20%
        }
    };

    // Validate investment amount
    function validateInvestment() {
        const amount = parseFloat(investmentAmount.value);
        const selectedPlan = investmentPlan.value;
        const plan = investmentPlans[selectedPlan];

        if (isNaN(amount)) {
            alert('Please enter a valid investment amount');
            return false;
        }

        if (amount < plan.minInvestment || amount > plan.maxInvestment) {
            alert(`For ${selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)} Plan, investment must be between $${plan.minInvestment} and $${plan.maxInvestment}`);
            return false;
        }

        return true;
    }

    // Calculate returns
    function calculateReturns() {
        if (!validateInvestment()) return;

        const amount = parseFloat(investmentAmount.value);
        const selectedPlan = investmentPlan.value;
        const plan = investmentPlans[selectedPlan];

        // Weekly ROI
        const weeklyReturn = amount * plan.weeklyRoi;
        weeklyRoiElement.textContent = `$${weeklyReturn.toFixed(2)}`;

        // Monthly ROI (4 weeks)
        const monthlyReturn = weeklyReturn * 4;
        monthlyRoiElement.textContent = `$${monthlyReturn.toFixed(2)}`;

        // Yearly Projection (52 weeks)
        const yearlyReturn = weeklyReturn * 52;
        yearlyRoiElement.textContent = `$${yearlyReturn.toFixed(2)}`;
    }

    // Event Listeners
    calculateButton.addEventListener('click', calculateReturns);

    // Optional: Recalculate when plan or amount changes
    investmentAmount.addEventListener('input', () => {
        // Optional: Add real-time validation or preview
    });

    investmentPlan.addEventListener('change', () => {
        // Reset calculator when plan changes
        weeklyRoiElement.textContent = '$0.00';
        monthlyRoiElement.textContent = '$0.00';
        yearlyRoiElement.textContent = '$0.00';
    });

    // Investment Plan Selection Buttons
    document.querySelectorAll('.investment-plans button').forEach(button => {
        button.addEventListener('click', (e) => {
            const planName = e.target.closest('div').querySelector('h2').textContent.split(' ')[0].toLowerCase();
            
            // Set the plan in the dropdown
            investmentPlan.value = planName;
            
            // Scroll to investment calculator
            document.getElementById('investment-amount').scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});