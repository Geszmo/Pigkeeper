import { db, collection, getDocs, query, where } from '../firebaseConfig.js';

const analyticsData = document.getElementById('analyticsData');
const templateAnalytics = document.getElementById('templateAnalytics');
const selectedYearProfitLoss = document.getElementById('selectedYearProfitLoss');
const filterByPigIDContainer = document.getElementById('filterByPigIDContainer');
const filterByPigID = document.getElementById('filterByPigID');

const existingYears = [];
const netIncomeMap = {};

// Initialize selectedYear variable
selectedYearProfitLoss.addEventListener('change', () => {
    const selectedYear = selectedYearProfitLoss.value;
    ProfitLossChart(netIncomeMap, selectedYear, selectedYear === 'All');
})

filterByPigID.addEventListener('change', () => {
    const selectedPigID = filterByPigID.value;
    const analyticsTemplates = document.querySelectorAll('[id^="analytics-pig-"]'); // Select all templates

    if (selectedPigID === 'All') {
        // Show all templates
        analyticsTemplates.forEach(template => {
            template.style.display = ''; // Show all
        });
        return; // Exit the function early
    }

    analyticsTemplates.forEach(template => {
        const pigID = template.id.replace('analytics-pig-', ''); // Extract the pigID from the ID
        if (pigID.includes(selectedPigID)) {
            template.style.display = ''; // Show the template
        } else {
            template.style.display = 'none'; // Hide the template
        }
    });
})

export async function fetchPigsData() {
    const pigQuery = query(
        collection(db, "Piglets"),
        where("status", "==", "Inactive"),
        where("loggedInUserId", "==", loggedInUserId)
    );

    const pigquerySnapshot = await getDocs(pigQuery);

    if (!pigquerySnapshot.empty) {
        pigquerySnapshot.forEach((doc) => {
            const data = doc.data();
            fetchAnalyticsData(data.pigID, data, "Batch " + data.batch, data.numberOfPig);
        });
    }

    const pigSowQuery = query(
        collection(db, "Pigsow"),
        where("status", "==", "Inactive"),
        where("loggedInUserId", "==", loggedInUserId)
    );

    const pigSowQuerySnapshot = await getDocs(pigSowQuery);

    if (!pigSowQuerySnapshot.empty) {
        pigSowQuerySnapshot.forEach((doc) => {
            const data = doc.data();
            fetchAnalyticsData(data.pigsowID, data, data.sowName, 1);
        });
    }
    fetchPigsChartData();
}

async function fetchAnalyticsData(pigID, pidData, pigName, numberOfPig = 0) {

    const financeQuery = query(
        collection(db, "FinancialRecord"),
        where("pigId", "==", pigID),
        where("loggedInUserId", "==", loggedInUserId)
    );

    const querySnapshot = await getDocs(financeQuery);

    if (!querySnapshot.empty) {

        filterByPigIDContainer.classList.remove("d-none");
        filterByPigID.innerHTML = '';
        const filterAll = document.createElement('option');
        filterAll.text = 'All';
        filterAll.value = 'All';
        filterAll.selected = true;
        filterByPigID.add(filterAll);

        templateAnalytics.classList.add("d-none");

        const dataSet = [];
        let totalExpense = 0;
        let dateFinance = '';
        let notesSold = '';
        let notesDeceased = '';

        let soldPigsow = 0;
        let numberofPigSold = 0;
        let numberOfPigDeceased = 0;

        const PigletsRecordsQuery = query(
            collection(db, "PigletsRecords"),
            where("pigID", "==", pigID),
            where("loggedInUserId", "==", loggedInUserId)
        );

        const querySnapshotPigletsRecords = await getDocs(PigletsRecordsQuery);

        if (!querySnapshotPigletsRecords.empty) {
            querySnapshotPigletsRecords.forEach((doc) => {
                const data = doc.data();
                if (data.status === 'Sold') {
                    numberofPigSold = data.numberOfPig || 0;
                    notesSold += data.notes.length > 0 ? `${data.notes}, ` : ' ';
                } else {
                    numberOfPigDeceased = data.numberOfPigDeceased || 0;
                    notesDeceased += data.notes.length > 0 ? `${data.notes}, ` : ' ';
                }

            });
        }

        if (!querySnapshot.empty) {
            let index = 0; // Initialize index
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                if (data.itemName === 'Sold Pigsow') {
                    soldPigsow = data.qty || 0;
                }

                if (data.type === "Expense") {
                    const qty = extractNumber(data.qty || 0); // Ensure default 0 if null
                    const price = extractNumber(data.price || 0);
                    const total = qty * price;
                    totalExpense += total;

                    dataSet.push({
                        name: data.itemName || 'N/A',
                        quantity: `${data.qty}` || 'N/A',
                        price: `${data.price}` || 'N/A',
                        total: total.toLocaleString() + ' PHP' || 'N/A',
                    });
                }

                // Check if this is the last iteration
                if (index === 0) {
                    // Perform any specific operation for the last document
                    dateFinance = data.dateFinance || 'N/A';
                }

                index++; // Increment index

            });
        }

        // Combine the notes
        let notes = `<br>Sold Notes: ${notesSold.trim().slice(0, -1)}\n<br>Deceased Notes: ${notesDeceased.trim().slice(0, -1)}`;

        const grossIncome = await getTotalIncome(pigID); // Example value, replace with actual data
        const netIncome = grossIncome - totalExpense;

        // Add the filled template to the DOM only if it doesn't already exist
        if (!document.querySelector(`#analytics-pig-${pigID}`)) {
            const option = document.createElement('option');
            option.text = pigID;
            option.value = pigID;
            filterByPigID.add(option);

            analyticsData.innerHTML += template({
                pigID: pigID,
                pigName: pigName,
                pigBirth: pidData.dateOfBirth,
                pigDays: pidData.daysInactive,
                dateFinance: dateFinance,
                numberOfPig: numberOfPig,
                numberofPigSold: numberofPigSold || soldPigsow,
                numberOfPigDeceased: numberOfPigDeceased,
                notes: notes,
                dataSet: dataSet,
                grossIncome: grossIncome.toLocaleString() + ' PHP',
                totalExpense: totalExpense.toLocaleString() + ' PHP',
                netIncome: netIncome.toLocaleString() + ' PHP',
            });
        }
    }
}

async function getTotalIncome(pigID) {
    const financeQuery = query(
        collection(db, "FinancialRecord"),
        where("pigId", "==", pigID),
        where("type", "==", "Income"),
        where("loggedInUserId", "==", loggedInUserId)
    );

    const querySnapshot = await getDocs(financeQuery);
    let totalIncome = 0;
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        const qty = extractNumber(data.qty || 0); // Ensure default 0 if null
        const price = extractNumber(data.price || 0);
        const total = qty * price;
        totalIncome += total;
    });

    return totalIncome || 0;
}

function template(data) {
    const rows = data.dataSet.map(row => `
        <tr>
            <td>${row.name}</td>
            <td>${row.quantity}</td>
            <td>${row.price}</td>
            <td>${row.total}</td>
        </tr>
    `).join('');

    return `
        <div class="card alert alert-body w-100" id="analytics-pig-${data.pigID}"> 
                <div class="table-responsive"> 
                    <table class="table table-hover">
                        <tbody>
                            <tr>
                                <td colspan="2" class="bg-secondary">
                                    <h4 class="text-white m-0">Financial Report for Pig ID: ${data.pigID}</h4>
                                </td>
                                <td colspan="2" class="bg-secondary">
                                    <h4 class="text-white m-0">Date: ${dateFormatter(data.dateFinance)}</h4>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="4">
                                    <p class="text-dark m-0"><b>Additonal Notes:</b> ${data.notes}</p>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="4" class="bg-secondary-subtle" >
                                    <h6 class="text-dark m-0">Pig Details: </h6>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="2"><b>Date of Birth:</b> ${dateFormatter(data.pigBirth)}</td>
                                <td><b>Days:</b> ${data.pigDays}</td>
                                <td><b>Sold:</b> ${data.numberofPigSold}</td>
                            </tr>
                            <tr>
                                <td colspan="2"><b>Name:</b> ${data.pigName}</td>
                                <td><b>Number of Pigs:</b> ${data.numberOfPig}</td>
                                <td><b>Deceased:</b> ${data.numberOfPigDeceased}</td>
                            </tr> 
                            <tr>
                                <td colspan="4" class="bg-secondary-subtle" >
                                    <h6 class="text-dark m-0">Cost Analysis: </h6>
                                </td>
                            </tr>
                            <tr>
                                <th>Item Name</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th>Total</th>
                            </tr> 
                            ${rows}
                        </tbody>
                        <tfooter>
                            <tr>
                                <td colspan="4" class="bg-secondary-subtle" >
                                    <h6 class="text-dark m-0">Financial Overview: </h6>
                                </td>
                            </tr>
                            <tr>
                                <th colspan="2">Gross Income</th> 
                                <th>${parseFloat(data.netIncome) < 0 ? 'Loss' : 'Profit'}</th>
                                <th>Total Expense</th>
                            </tr>
                            <tr>
                                <td colspan="2">${data.grossIncome}</td>
                                <td>${data.netIncome}</td>
                                <td>${data.totalExpense}</td>
                            </tr>
                        </tfooter>
                    </table>
                </div> 
        </div> 
    `;
}

export async function fetchPigsChartData() {
    const pigQuery = query(
        collection(db, "Piglets"),
        where("status", "==", "Inactive"),
        where("loggedInUserId", "==", loggedInUserId)
    );

    const pigSowQuery = query(
        collection(db, "Pigsow"),
        where("status", "==", "Inactive"),
        where("loggedInUserId", "==", loggedInUserId)
    );

    const [pigSnapshot, pigSowSnapshot] = await Promise.all([
        getDocs(pigQuery),
        getDocs(pigSowQuery)
    ]);

    const pigIDs = [];

    if (!pigSnapshot.empty) {
        pigSnapshot.forEach(doc => pigIDs.push(doc.data().pigID));
    }
    if (!pigSowSnapshot.empty) {
        pigSowSnapshot.forEach(doc => pigIDs.push(doc.data().pigsowID));
    }

    if (pigIDs.length > 0) {
        await generateNetProfitChart(pigIDs);
    } else {

        const currentYear = new Date().getFullYear();

        // Default months for the current year
        const defaultMonths = [
            `Jan ${currentYear}`, `Feb ${currentYear}`, `Mar ${currentYear}`,
            `Apr ${currentYear}`, `May ${currentYear}`, `Jun ${currentYear}`,
            `Jul ${currentYear}`, `Aug ${currentYear}`, `Sep ${currentYear}`,
            `Oct ${currentYear}`, `Nov ${currentYear}`, `Dec ${currentYear}`
        ];

        // Highcharts configuration
        Highcharts.chart('netProfitChart', {
            chart: { type: 'column' },
            title: { text: 'Profit & Loss' },
            yAxis: {
                allowDecimals: false,
                title: { text: null }
            },
            xAxis: {
                categories: defaultMonths, // Default months as x-axis categories
                crosshair: true,
            },
            credits: { enabled: false },
            legend: {
                enabled: true,
                align: 'center',
                verticalAlign: 'top',
                layout: 'horizontal'
            },
            tooltip: {
                useHTML: true,
                formatter: function () {
                    // Default tooltip showing no data
                    return `<b>${this.series.name}:</b> <br>No data available for this month.`;
                }
            },
            series: [
                {
                    name: 'Profit',
                    color: "#71A971",
                    data: Array(12).fill(0), // Default profit values (12 months)
                    marker: { enabled: false }
                },
                {
                    name: 'Loss',
                    color: "#FF5757",
                    data: Array(12).fill(0), // Default loss values (12 months)
                    marker: { enabled: false }
                }
            ]
        });

    }
}

async function generateNetProfitChart(pigIDs) {
    try {

        for (const pigID of pigIDs) {
            const incomeQuery = query(
                collection(db, "FinancialRecord"),
                where("pigId", "==", pigID),
                where("loggedInUserId", "==", loggedInUserId)
            );

            const incomeSnapshot = await getDocs(incomeQuery);

            let netProfit = 0;
            let dateFinance = '';
            let firstIndexIncome = 0;
            let firstIndexExpense = 0;

            if (!incomeSnapshot.empty) {
                // Process Income Records
                incomeSnapshot.forEach(doc => {
                    const data = doc.data();
                    const qty = extractNumber(data.qty || 0);
                    const price = extractNumber(data.price || 0);
                    const total = qty * price;
                    if (data.type === "Income") {
                        netProfit += total;
                        // Check if this is the last iteration
                        if (firstIndexIncome === 0) {
                            // Perform any specific operation for the last document
                            dateFinance = dateFormatter(data.dateFinance);
                        }
                        firstIndexIncome++; // Increment firstIndexIncome
                    } else {
                        netProfit -= total;
                        // Check if this is the last iteration
                        if (firstIndexExpense === 0) {
                            // Perform any specific operation for the last document
                            dateFinance = dateFormatter(data.dateFinance);
                        }
                        firstIndexExpense++; // Increment firstIndexExpense
                    }
                });
            }

            const transactionDate = new Date(dateFinance);
            const month = transactionDate.toLocaleString('en-US', { month: 'short' });
            const year = transactionDate.getFullYear();
            const fullMonth = `${month} ${year}`; // Format as "MMM YYYY"
            const fullDate = transactionDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); // Full date

            // Initialize the map for this month if not already present
            if (!netIncomeMap[fullMonth]) {
                netIncomeMap[fullMonth] = { NetProfit: 0, NetLoss: 0, NetProfitDates: [], NetLossDates: [] };
            }

            // Add the data based on the status
            if (netProfit > 0) {
                // Check if the profit date already exists before adding
                const profitEntry = `${fullDate} (Profit: ${formatNumberWithCommas(netProfit)})`;
                if (!netIncomeMap[fullMonth].NetProfitDates.includes(profitEntry)) {
                    netIncomeMap[fullMonth].NetProfit += netProfit;
                    netIncomeMap[fullMonth].NetProfitDates.push(profitEntry);
                }
            } else if (netProfit < 0) {
                // Check if the loss date already exists before adding
                const lossEntry = `${fullDate} (Loss: ${formatNumberWithCommas(netProfit)})`;
                if (!netIncomeMap[fullMonth].NetLossDates.includes(lossEntry)) {
                    netIncomeMap[fullMonth].NetLoss += extractNumber(netProfit);
                    netIncomeMap[fullMonth].NetLossDates.push(lossEntry);
                }
            }


            // Add the year to the array if it doesn't already exist
            if (!existingYears.includes(year)) {
                existingYears.push(year);
            }
        }

        // Add this line to clear the dropdown before adding options
        selectedYearProfitLoss.innerHTML = '';

        const option = document.createElement('option');
        option.selected = true;
        option.text = 'All';
        option.value = 'All';
        selectedYearProfitLoss.appendChild(option);

        // Sort the years from oldest to latest
        existingYears.sort((a, b) => b - a);
        // Add the sorted years to the dropdown
        existingYears.forEach((year, index) => {
            const option = document.createElement('option');
            option.text = year;
            option.value = year;
            if (index === 0) {
                option.selected = true; // Select the first year by default
            }
            selectedYearProfitLoss.appendChild(option); // Append the option to the dropdown
        });


        ProfitLossChart(netIncomeMap);

    } catch (error) {
        console.error("Error generating net profit chart:", error);
    }
}

function ProfitLossChart(netIncomeMap, selectedYear = currentYear, all) {
    // Combine all months (default + fetched) and sort by date
    const allMonths = Object.keys(netIncomeMap);
    const sortedMonths = [...new Set([...defaultMonths.map(month => `${month} ${new Date().getFullYear()}`), ...allMonths])];

    // Prepare categories data
    let categories;

    if (all) {
        categories = sortedMonths.sort((a, b) => new Date(a) - new Date(b)); // Sort by date
    } else {
        categories = defaultMonths.map(month => `${month} ${selectedYear}`); // Ensure all default months are included
    }

    const NetProfitData = categories.map(month => (netIncomeMap[month]?.NetProfit || 0));
    const NetLossData = categories.map(month => (netIncomeMap[month]?.NetLoss || 0));

    // Combine tooltips for Sold and Deceased
    const tooltipData = categories.map(month => {
        const Profit = netIncomeMap[month]?.NetProfitDates.join('<br>') || "No Profit Data";
        const Loss = netIncomeMap[month]?.NetLossDates.join('<br>') || "No Loss Data";
        return {
            ProfitTooltip: Profit,
            LossTooltip: Loss
        };
    });

    // Highcharts configuration
    Highcharts.chart('netProfitChart', {
        chart: {
            type: 'column',
            animation: {
                duration: 800,
                easing: 'easeOutBounce', // Smooth bounce effect
            },
        },
        title: {
            text: 'Profit & Loss',
            style: {
                fontSize: '16px',
                color: '#444',
                fontWeight: 'bold',
            },
        },
        xAxis: {
            categories: categories,
            crosshair: true,
            labels: {
                style: {
                    fontSize: '12px',
                    fontFamily: 'Arial, sans-serif',
                    color: '#666',
                },
            },
            lineColor: '#ccc',
            lineWidth: 1,
        },
        yAxis: {
            allowDecimals: false,
            title: { text: null },
            gridLineColor: '#f0f0f0',
            labels: {
                style: {
                    fontSize: '12px',
                    color: '#666',
                },
            },
        },
        credits: {
            enabled: false,
        },
        legend: {
            enabled: true,
            align: 'center',
            verticalAlign: 'top',
            layout: 'horizontal',
            itemStyle: {
                fontSize: '12px',
                fontWeight: 'normal',
                color: '#444',
            },
        },
        tooltip: {
            useHTML: true,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderColor: '#ccc',
            borderRadius: 8,
            style: {
                color: '#333',
                fontSize: '12px',
                fontFamily: 'Arial, sans-serif'
            },
            formatter: function () {
                if (this.series.name === 'Profit') {
                    return `<b>Total Profit: ${formatNumberWithCommas(this.y)}</b><br>${tooltipData[this.point.index].ProfitTooltip}`;
                } else if (this.series.name === 'Loss') {
                    return `<b>Total Loss: ${formatNumberWithCommas(this.y)}</b><br>${tooltipData[this.point.index].LossTooltip}`;
                }
            },
        },
        plotOptions: {
            column: {
                borderRadius: 20, // Rounded corners for bars
                dataLabels: {
                    // enabled: true, // Show values on bars
                    // format: '{y}', // Display the value
                    style: {
                        fontWeight: 'bold',
                        color: '#444', // Ensure readability
                    },
                },
            },
        },
        series: [{
            name: 'Profit',
            color: {
                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                stops: [
                    [0, '#71A971'],
                    [1, '#4E8C4E']
                ]
            },
            data: NetProfitData,
        }, {
            name: 'Loss',
            color: {
                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                stops: [
                    [0, '#FF5757'],
                    [1, '#CC4444']
                ]
            },
            data: NetLossData,
        }]
    });
}


fetchPigsData();
