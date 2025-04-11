// Dashboard JavaScript
document.addEventListener('DOMContentLoaded', () => {
    // Update user name and initials
    function updateUserNameAndInitials() {
        const storedName = localStorage.getItem('userFullName') || 'Charles Crowther';
        
        // Update name in text
        const nameElements = document.querySelectorAll('.user-name');
        nameElements.forEach(el => {
            el.textContent = storedName;
        });

        // Update initials
        const initialsElements = document.querySelectorAll('.user-initials');
        initialsElements.forEach(el => {
            const names = storedName.split(' ');
            const initials = names.map(n => n.charAt(0).toUpperCase()).join('');
            el.textContent = initials.slice(0, 2);
        });
    }

    // Initial name update
    updateUserNameAndInitials();

    // Listen for name updates from profile page
    window.addEventListener('nameUpdated', () => {
        updateUserNameAndInitials();
    });

    // Fetch and update user dashboard data
    async function fetchDashboardData() {
        try {
            // In a real app, this would be an API call
            const mockData = {
                balance: 6060.00,
                investments: [
                    {
                        name: 'Gold Plan',
                        roi: 20.00,
                        minInvestment: 1000.00,
                        maxInvestment: 2500.00,
                        duration: 'Every week'
                    }
                ],
                referralEarnings: 0.00
            };
            
            // Update dashboard elements
            updateAccountBalance(mockData.balance);
            updateInvestmentStats(mockData.investments);
            updateReferralEarnings(mockData.referralEarnings);
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        }
    }

    function updateAccountBalance(balance) {
        const balanceElement = document.querySelector('.bg-purple-600 p');
        if (balanceElement) {
            balanceElement.textContent = `${balance.toLocaleString()} USD`;
        }
    }

    function updateInvestmentStats(investments) {
        const investmentContainer = document.querySelector('.space-y-4');
        
        // Clear existing investment plans (optional, depending on your design)
        // investmentContainer.innerHTML = '';

        // Dynamically create investment plan cards
        investments.forEach(plan => {
            // Check if plan card already exists
            if (!investmentContainer.querySelector('.bg-purple-700')) {
                const planCard = document.createElement('div');
                planCard.classList.add('bg-purple-700', 'p-4', 'rounded-lg');
                planCard.innerHTML = `
                    <div class="flex justify-between items-center mb-2">
                        <h3 class="text-lg font-bold">${plan.name}</h3>
                        <span class="bg-purple-500 text-white px-2 py-1 rounded">ROI ${plan.roi}%</span>
                    </div>
                    <div class="space-y-2">
                        <p>Minimum: ${plan.minInvestment.toLocaleString()} USD</p>
                        <p>Maximum: ${plan.maxInvestment.toLocaleString()} USD</p>
                        <p>Duration: ${plan.duration}</p>
                        <button class="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded mt-2">
                            Invest Now
                        </button>
                    </div>
                `;
                
                investmentContainer.appendChild(planCard);
            }
        });
    }

    function updateReferralEarnings(earnings) {
        const referralEarningsElement = document.querySelector('.bg-gradient-to-r.from-green-500 + p');
        if (referralEarningsElement) {
            referralEarningsElement.textContent = `${earnings.toLocaleString()} USD`;
        }
    }

    // Event Listeners for Action Buttons
    function addActionButtonListeners() {
        const depositButton = document.querySelector('a[href="../pages/deposit.html"] button');
        const withdrawButton = document.querySelector('a[href="../pages/withdrawal.html"] button');
        const transactionsButton = document.querySelector('a[href="../pages/transactions.html"] button');
        const referralButton = document.querySelector('.bg-gradient-to-r.from-green-500');

        if (depositButton) {
            depositButton.addEventListener('click', () => {
                window.location.href = '../pages/deposit.html';
            });
        }

        if (withdrawButton) {
            withdrawButton.addEventListener('click', () => {
                window.location.href = '../pages/withdrawal.html';
            });
        }

        if (transactionsButton) {
            transactionsButton.addEventListener('click', () => {
                window.location.href = '../pages/transactions.html';
            });
        }

        if (referralButton) {
            referralButton.addEventListener('click', () => {
                // Future implementation of referral program
                alert('Referral program coming soon!');
            });
        }
    }

    // Initial data fetch and setup
    function initDashboard() {
        fetchDashboardData();
        addActionButtonListeners();
    }

    // Call initialization
    initDashboard();

    // Periodic data refresh (every 5 minutes)
    setInterval(fetchDashboardData, 5 * 60 * 1000);
});